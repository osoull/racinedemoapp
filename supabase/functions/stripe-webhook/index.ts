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
      'whsec_vgbAclrkWIyvPnFIk1RYa8bKmcAp8fKu',
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
      const session = event.data.object

      // Récupérer les détails du paiement
      const { data: stripePayment, error: fetchError } = await supabaseClient
        .from('stripe_payments')
        .select('transaction_id')
        .eq('stripe_session_id', session.id)
        .single()

      if (fetchError) {
        console.error('Error fetching stripe payment:', fetchError)
        throw new Error('Payment not found')
      }

      // Mettre à jour le statut de la transaction
      const { error: updateError } = await supabaseClient
        .from('transactions')
        .update({ status: 'completed' })
        .eq('id', stripePayment.transaction_id)

      if (updateError) {
        console.error('Error updating transaction:', updateError)
        throw new Error('Failed to update transaction')
      }

      // Mettre à jour le statut du paiement Stripe
      const { error: stripeUpdateError } = await supabaseClient
        .from('stripe_payments')
        .update({ status: 'completed' })
        .eq('stripe_session_id', session.id)

      if (stripeUpdateError) {
        console.error('Error updating stripe payment:', stripeUpdateError)
        throw new Error('Failed to update stripe payment')
      }

      // Créer une notification pour l'utilisateur
      const { error: notificationError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: session.client_reference_id,
          title: 'تم الدفع بنجاح',
          message: `تم إيداع ${session.amount_total / 100} ريال في محفظتك`
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