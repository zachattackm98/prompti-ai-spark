
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { SignupConfirmationEmail } from './_templates/signup-confirmation.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('Received signup email webhook payload')
    
    // Parse the webhook payload
    const webhookData = JSON.parse(payload)
    
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = webhookData

    console.log('Processing signup confirmation for:', user.email)
    console.log('Email action type:', email_action_type)

    // Only handle signup confirmations
    if (email_action_type !== 'signup') {
      console.log('Not a signup confirmation, skipping')
      return new Response('Not a signup confirmation', { status: 200 })
    }

    // Render the email template
    const html = await renderAsync(
      React.createElement(SignupConfirmationEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash,
        redirect_to: redirect_to || 'https://aipromptmachine.com',
        email_action_type,
        user_email: user.email,
      })
    )

    console.log('Sending signup email via Resend to:', user.email)

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'AiPromptMachine <noreply@aipromptmachine.com>',
      to: [user.email],
      subject: 'Welcome to AiPromptMachine - Confirm Your Account',
      html,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify({ success: true, emailId: data?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    console.error('Error in send-signup-email function:', error)
    
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          details: error.toString(),
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
