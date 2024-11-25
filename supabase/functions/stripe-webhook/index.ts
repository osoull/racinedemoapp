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

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()
  
  let event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.error('Error verifying webhook signature:', err)
    return new Response(err.message, { status: 400 })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Get the transaction ID from metadata
      const transactionId = session.metadata?.transaction_id

      if (!transactionId) {
        throw new Error('No transaction ID found in session metadata')
      }

      // Update transaction status
      const { error: transactionError } = await supabaseClient
        .from('transactions')
        .update({ status: 'completed' })
        .eq('id', transactionId)

      if (transactionError) {
        throw transactionError
      }

      // Update stripe payment status
      const { error: stripePaymentError } = await supabaseClient
        .from('stripe_payments')
        .update({ status: 'completed' })
        .eq('stripe_session_id', session.id)

      if (stripePaymentError) {
        throw stripePaymentError
      }

      // Create notification for the user
      const { error: notificationError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: session.client_reference_id,
          title: 'تم الدفع بنجاح',
          message: `تم إيداع ${session.amount_total ? session.amount_total / 100 : 0} ريال في محفظتك`
        })

      if (notificationError) {
        console.error('Error creating notification:', notificationError)
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})