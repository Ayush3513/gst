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

    // Convert file to base64
    const buffer = await file.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))

    console.log('Processing file:', file.name)

    // Process with GROQ
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
            content: "You are an expert at extracting information from invoices. Extract the following fields: supplier_name, invoice_number, amount, invoice_date, gst_amount. Return the data in a valid JSON format with these exact field names. The amount and gst_amount should be numbers, invoice_date should be in YYYY-MM-DD format."
          },
          {
            role: "user",
            content: `Please extract the invoice information from this image: data:${file.type};base64,${base64}`
          }
        ],
        temperature: 0.1,
        max_tokens: 1024,
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('GROQ API Error:', error)
      throw new Error('Failed to process invoice with GROQ')
    }

    const data = await response.json()
    console.log('GROQ Response:', data)

    const extractedData = JSON.parse(data.choices[0].message.content)
    console.log('Extracted Data:', extractedData)

    // Store in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: insertError } = await supabase
      .from('invoices')
      .insert([{
        supplier_name: extractedData.supplier_name,
        invoice_number: extractedData.invoice_number,
        amount: extractedData.amount,
        invoice_date: extractedData.invoice_date,
        gst_amount: extractedData.gst_amount,
        status: 'Processing'
      }])

    if (insertError) {
      console.error('Supabase Insert Error:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Processing Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})