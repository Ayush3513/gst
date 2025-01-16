import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting invoice processing...')
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('No file uploaded')
    }

    console.log('File received:', file.name)

    // Convert file to base64
    const buffer = await file.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))

    console.log('Sending to OCR.space API...')
    
    // Call OCR.space API
    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': Deno.env.get('OCR_SPACE_API_KEY') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image: `data:${file.type};base64,${base64}`,
        language: 'eng',
        isOverlayRequired: false,
      }),
    })

    const ocrData = await ocrResponse.json()
    console.log('OCR Response received:', ocrData)

    if (!ocrData.ParsedResults?.[0]?.ParsedText) {
      throw new Error('Failed to extract text from image')
    }

    const text = ocrData.ParsedResults[0].ParsedText
    console.log('Extracted text:', text)

    // Extract invoice data using regex patterns
    const extractData = (text: string) => {
      const invoiceNumberPattern = /(?:invoice|bill)(?:\s+)?(?:no|number|#)?[:.]?\s*([A-Za-z0-9-]+)/i
      const datePattern = /(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4})|(?:\d{2,4}[-/]\d{1,2}[-/]\d{1,2})/
      const amountPattern = /(?:total|amount|sum)(?:\s+)?(?:rs|inr)?(?:\s+)?[:.]?\s*(?:rs\.?|₹)?(?:\s+)?(\d+(?:,\d+)*(?:\.\d{2})?)/i
      const gstPattern = /(?:gst|tax)(?:\s+)?(?:amount)?(?:\s+)?[:.]?\s*(?:rs\.?|₹)?(?:\s+)?(\d+(?:,\d+)*(?:\.\d{2})?)/i
      const supplierPattern = /(?:from|supplier|vendor|billed\s+by)(?:\s+)?[:.]?\s*([A-Za-z\s]+(?:pvt\.?\s+ltd\.?|limited|inc\.?|corporation)?)/i

      const invoiceNumber = text.match(invoiceNumberPattern)?.[1] || 'INV' + Date.now()
      const dateMatch = text.match(datePattern)?.[0]
      const amount = text.match(amountPattern)?.[1]?.replace(/,/g, '') || '0'
      const gstAmount = text.match(gstPattern)?.[1]?.replace(/,/g, '') || '0'
      const supplierName = text.match(supplierPattern)?.[1]?.trim() || 'Unknown Supplier'

      let invoiceDate = new Date()
      if (dateMatch) {
        const parts = dateMatch.split(/[-/]/)
        if (parts.length === 3) {
          // Assuming date format is DD-MM-YYYY or YYYY-MM-DD
          if (parts[0].length === 4) {
            invoiceDate = new Date(parts[0], parseInt(parts[1]) - 1, parseInt(parts[2]))
          } else {
            invoiceDate = new Date(parts[2], parseInt(parts[1]) - 1, parseInt(parts[0]))
          }
        }
      }

      return {
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate.toISOString().split('T')[0],
        amount: parseFloat(amount),
        gst_amount: parseFloat(gstAmount),
        supplier_name: supplierName
      }
    }

    const extractedData = extractData(text)
    console.log('Extracted data:', extractedData)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Insert invoice data
    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        ...extractedData,
        status: 'Processing'
      }])

    if (invoiceError) {
      console.error('Invoice insertion error:', invoiceError)
      throw invoiceError
    }

    // Update analytics data
    const { data: currentAnalytics } = await supabase
      .from('analytics_data')
      .select('*')
      .single()

    const newTotalAmount = (currentAnalytics?.total_itc_amount || 0) + extractedData.gst_amount
    const newVerifiedAmount = (currentAnalytics?.verified_itc_amount || 0)

    const { error: analyticsError } = await supabase
      .from('analytics_data')
      .upsert({
        id: currentAnalytics?.id || crypto.randomUUID(),
        total_itc_amount: newTotalAmount,
        verified_itc_amount: newVerifiedAmount,
        gstr1_status: 'Pending',
        gstr2b_status: 'Pending',
        last_updated: new Date().toISOString()
      })

    if (analyticsError) {
      console.error('Analytics update error:', analyticsError)
      throw analyticsError
    }

    console.log('Successfully processed invoice and updated analytics')

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extractedData
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Processing Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 400 
      }
    )
  }
})