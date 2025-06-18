
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { SignupConfirmationEmail } from './_templates/signup-confirmation.tsx'
import { PasswordResetEmail } from './_templates/password-reset.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

// Environment-aware URL helper
const getProductionUrl = (path: string = '') => {
  return `https://www.aipromptmachine.com${path}`;
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('Received email webhook');
    
    // Parse the webhook payload
    const webhookData = JSON.parse(payload)
    
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = webhookData

    console.log('Processing email for:', user.email)
    console.log('Email action type:', email_action_type)
    console.log('Token hash present:', token_hash ? 'yes' : 'no')

    let html: string
    let subject: string
    let emailTemplate: React.ReactElement

    // Handle different email types
    if (email_action_type === 'signup') {
      console.log('Processing signup confirmation email')
      
      const finalRedirectUrl = redirect_to || getProductionUrl('/');
      
      emailTemplate = React.createElement(SignupConfirmationEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash,
        redirect_to: finalRedirectUrl,
        email_action_type,
        user_email: user.email,
      })
      
      subject = 'Welcome to AiPromptMachine - Confirm Your Account'
      
    } else if (email_action_type === 'recovery') {
      console.log('Processing password reset email')
      
      if (!token_hash) {
        console.error('No token_hash provided for password reset');
        return new Response('Missing token_hash for password reset', { status: 400 });
      }
      
      const finalResetUrl = redirect_to || getProductionUrl('/reset-password');
      
      emailTemplate = React.createElement(PasswordResetEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash,
        redirect_to: finalResetUrl,
        email_action_type,
        user_email: user.email,
      })
      
      subject = 'Reset Your AiPromptMachine Password'
      
    } else {
      return new Response(`Unsupported email action type: ${email_action_type}`, { status: 400 })
    }

    // Render the email template
    html = await renderAsync(emailTemplate)

    console.log('Sending email via Resend to:', user.email)

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'AiPromptMachine <noreply@aipromptmachine.com>',
      to: [user.email],
      subject,
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
    
  } catch (error: any) {
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
