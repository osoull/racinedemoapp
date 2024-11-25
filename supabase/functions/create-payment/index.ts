import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, user_id } = await req.json()

    if (!amount || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Amount and user_id are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Creating Stripe session for amount:', amount)

    try {
      // Create Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'sar',
              product_data: {
                name: 'إيداع رصيد',
              },
              unit_amount: Math.round(amount * 100), // Stripe uses cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/investor/wallet?success=true`,
        cancel_url: `${req.headers.get('origin')}/investor/wallet?canceled=true`,
        client_reference_id: user_id,
      })

      console.log('Stripe session created:', session.id)

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabaseClient
        .from('transactions')
        .insert({
          user_id,
          amount,
          type: 'deposit',
          status: 'pending'
        })
        .select()
        .single()

      if (transactionError) {
        console.error('Error creating transaction:', transactionError)
        throw transactionError
      }

      console.log('Transaction created:', transaction.id)

      // Create stripe payment record
      const { error: stripePaymentError } = await supabaseClient
        .from('stripe_payments')
        .insert({
          user_id,
          transaction_id: transaction.id,
          stripe_session_id: session.id,
          amount,
          status: 'pending'
        })

      if (stripePaymentError) {
        console.error('Error creating stripe payment:', stripePaymentError)
        throw stripePaymentError
      }

      return new Response(
        JSON.stringify({ sessionId: session.id, sessionUrl: session.url }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (stripeError) {
      console.error('Stripe or database error:', stripeError)
      return new Response(
        JSON.stringify({ error: 'Failed to create payment session' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
  } catch (error) {
    console.error('Error in create-payment function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})