import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
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
    return new Response(err.message, { status: 400 })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    // Update stripe payment status
    const { data: stripePayment, error: fetchError } = await supabaseClient
      .from('stripe_payments')
      .select('transaction_id')
      .eq('stripe_session_id', session.id)
      .single()

    if (fetchError) {
      console.error('Error fetching stripe payment:', fetchError)
      return new Response(JSON.stringify({ error: 'Payment not found' }), { status: 404 })
    }

    // Update transaction status
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', stripePayment.transaction_id)

    if (updateError) {
      console.error('Error updating transaction:', updateError)
      return new Response(JSON.stringify({ error: 'Failed to update transaction' }), { status: 500 })
    }

    // Update stripe payment status
    const { error: stripeUpdateError } = await supabaseClient
      .from('stripe_payments')
      .update({ status: 'completed' })
      .eq('stripe_session_id', session.id)

    if (stripeUpdateError) {
      console.error('Error updating stripe payment:', stripeUpdateError)
      return new Response(JSON.stringify({ error: 'Failed to update stripe payment' }), { status: 500 })
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})