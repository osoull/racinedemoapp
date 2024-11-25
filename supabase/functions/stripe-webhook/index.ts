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

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Update stripe payment status
      const { error: stripePaymentError } = await supabaseClient
        .from('stripe_payments')
        .update({ status: 'completed' })
        .eq('stripe_session_id', session.id)

      if (stripePaymentError) throw stripePaymentError

      // Get the transaction ID
      const { data: stripePayment, error: getPaymentError } = await supabaseClient
        .from('stripe_payments')
        .select('transaction_id, user_id')
        .eq('stripe_session_id', session.id)
        .single()

      if (getPaymentError) throw getPaymentError

      // Update transaction status
      const { error: transactionError } = await supabaseClient
        .from('transactions')
        .update({ status: 'completed' })
        .eq('id', stripePayment.transaction_id)

      if (transactionError) throw transactionError

      // Create notification for the user
      const { error: notificationError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: stripePayment.user_id,
          title: 'تم الدفع بنجاح',
          message: `تم إيداع ${session.amount_total ? session.amount_total / 100 : 0} ريال في محفظتك`
        })

      if (notificationError) {
        console.error('Error creating notification:', notificationError)
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 400 }
    )
  }
})