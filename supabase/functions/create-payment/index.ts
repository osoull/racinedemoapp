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

    // Récupérer le type d'utilisateur
    const { data: userProfile, error: userError } = await supabaseClient
      .from('profiles')
      .select('user_type')
      .eq('id', user_id)
      .single()

    if (userError) throw userError

    // Récupérer les commissions applicables
    const { data: commissions, error: commissionsError } = await supabaseClient
      .from('commissions')
      .select('*')

    if (commissionsError) throw commissionsError

    // Calculer les frais en fonction du type d'utilisateur
    const fees = commissions.reduce((acc: any, commission: any) => {
      if (
        (userProfile.user_type === 'borrower' && 
         ['admin_fee', 'collection_fee'].includes(commission.commission_type)) ||
        (userProfile.user_type === 'basic_investor' && 
         commission.commission_type === 'basic_investor_fee') ||
        (userProfile.user_type === 'qualified_investor' && 
         commission.commission_type === 'qualified_investor_fee')
      ) {
        acc[commission.commission_type] = {
          rate: commission.rate,
          amount: (amount * commission.rate) / 100,
          commission_id: commission.commission_id
        }
      }
      return acc
    }, {})

    const totalFees = Object.values(fees).reduce((sum: number, fee: any) => 
      sum + fee.amount, 0
    )

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sar',
            product_data: {
              name: 'إيداع رصيد',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/investor/wallet?success=true`,
      cancel_url: `${req.headers.get('origin')}/investor/wallet?canceled=true`,
      client_reference_id: user_id,
    })

    // Créer la transaction
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

    if (transactionError) throw transactionError

    // Créer les enregistrements de frais
    const feeRecords = Object.entries(fees).map(([fee_type, fee]: [string, any]) => ({
      transaction_id: transaction.id,
      commission_id: fee.commission_id,
      amount: amount,
      fee_amount: fee.amount,
      fee_type
    }))

    const { error: feeTrackingError } = await supabaseClient
      .from('fee_tracking')
      .insert(feeRecords)

    if (feeTrackingError) throw feeTrackingError

    // Créer l'enregistrement de paiement Stripe
    const { error: stripePaymentError } = await supabaseClient
      .from('stripe_payments')
      .insert({
        user_id,
        transaction_id: transaction.id,
        stripe_session_id: session.id,
        amount,
        status: 'pending'
      })

    if (stripePaymentError) throw stripePaymentError

    return new Response(
      JSON.stringify({ sessionId: session.id, sessionUrl: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
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