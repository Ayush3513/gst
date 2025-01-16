import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
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
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('No file provided')
    }

    console.log('Starting to process file:', file.name)

    // Convert file to base64
    const buffer = await file.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))

    // Process with GROQ
    console.log('Sending request to GROQ API')
    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama2-70b-4096",
        messages: [
          {
            role: "system",
            content: `You are an expert at extracting information from invoices. Extract the following fields and return them in a valid JSON format:
              - supplier_name: The name of the supplier/vendor
              - invoice_number: The unique invoice identifier
              - amount: The total invoice amount (as a number)
              - invoice_date: The date of the invoice (in YYYY-MM-DD format)
              - gst_amount: The GST/tax amount (as a number)
              
              Return ONLY the JSON object with these exact field names, nothing else.`
          },
          {
            role: "user",
            content: `Extract the invoice information from this image: data:${file.type};base64,${base64}`
          }
        ],
        temperature: 0.1,
        max_tokens: 1024,
      })
    })

    if (!response.ok) {
      console.error('GROQ API Error:', await response.text())
      throw new Error('Failed to process invoice with GROQ')
    }

    const groqData = await response.json()
    console.log('GROQ Response received:', groqData)

    const extractedData = JSON.parse(groqData.choices[0].message.content)
    console.log('Parsed extracted data:', extractedData)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Insert invoice data
    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        supplier_name: extractedData.supplier_name,
        invoice_number: extractedData.invoice_number,
        amount: extractedData.amount,
        invoice_date: extractedData.invoice_date,
        gst_amount: extractedData.gst_amount,
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