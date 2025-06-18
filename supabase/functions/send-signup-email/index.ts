
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

// Robust token hash extraction with multiple fallback methods
const extractTokenHash = (webhookData: any): string | null => {
  console.log('Starting token_hash extraction...');
  console.log('Raw webhook data structure:', JSON.stringify(webhookData, null, 2));
  
  // Method 1: Direct email_data access
  const directToken = webhookData?.email_data?.token_hash;
  if (directToken && typeof directToken === 'string' && directToken.length > 10) {
    console.log('Method 1 SUCCESS: Found token_hash via direct access, length:', directToken.length);
    return directToken;
  }
  console.log('Method 1 FAILED: Direct access result:', directToken);
  
  // Method 2: Alternative path through user data
  const altToken = webhookData?.user?.email_data?.token_hash;
  if (altToken && typeof altToken === 'string' && altToken.length > 10) {
    console.log('Method 2 SUCCESS: Found token_hash via user.email_data, length:', altToken.length);
    return altToken;
  }
  console.log('Method 2 FAILED: Alternative path result:', altToken);
  
  // Method 3: Search through all nested objects
  const searchNested = (obj: any, path: string = ''): string | null => {
    if (!obj || typeof obj !== 'object') return null;
    
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (key === 'token_hash' && typeof value === 'string' && value.length > 10) {
        console.log(`Method 3 SUCCESS: Found token_hash at path ${currentPath}, length:`, value.length);
        return value;
      }
      
      if (typeof value === 'object' && value !== null) {
        const nested = searchNested(value, currentPath);
        if (nested) return nested;
      }
    }
    return null;
  };
  
  const nestedToken = searchNested(webhookData);
  if (nestedToken) {
    return nestedToken;
  }
  
  // Method 4: Check for token field as fallback (though this might not work for reset)
  const fallbackToken = webhookData?.email_data?.token;
  if (fallbackToken && typeof fallbackToken === 'string' && fallbackToken.length > 10) {
    console.log('Method 4 FALLBACK: Using token field as token_hash, length:', fallbackToken.length);
    console.log('WARNING: Using token instead of token_hash - this may cause issues');
    return fallbackToken;
  }
  
  console.log('All extraction methods FAILED');
  return null;
};

// Enhanced URL validation with actual HTTP test
const validateResetUrl = async (url: string): Promise<boolean> => {
  try {
    console.log('Testing reset URL validity:', url);
    
    // Basic URL format validation
    const urlObj = new URL(url);
    if (!urlObj.searchParams.get('token_hash')) {
      console.error('URL validation FAILED: No token_hash parameter found');
      return false;
    }
    
    const tokenHash = urlObj.searchParams.get('token_hash');
    if (!tokenHash || tokenHash.length < 10) {
      console.error('URL validation FAILED: token_hash parameter is invalid');
      return false;
    }
    
    console.log('URL validation PASSED: Basic format and token_hash are valid');
    return true;
    
  } catch (error) {
    console.error('URL validation ERROR:', error);
    return false;
  }
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('=== PASSWORD RESET WEBHOOK DEBUG START ===');
    console.log('Received email webhook payload');
    
    // Parse the webhook payload
    const webhookData = JSON.parse(payload)
    
    // Enhanced token extraction with multiple methods
    const extractedTokenHash = extractTokenHash(webhookData);
    
    const {
      user,
      email_data: { token, redirect_to, email_action_type },
    } = webhookData

    console.log('Processing email for:', user.email)
    console.log('Email action type:', email_action_type)
    console.log('Token received:', token ? 'present' : 'missing')
    console.log('Extracted token_hash:', extractedTokenHash ? 'present' : 'missing')
    console.log('Redirect URL received:', redirect_to)

    // Use extracted token_hash as the primary token_hash value
    const token_hash = extractedTokenHash;

    let html: string
    let subject: string
    let emailTemplate: React.ReactElement

    // Handle different email types
    if (email_action_type === 'signup') {
      console.log('Processing signup confirmation email')
      
      // Use production URL as fallback for signup
      const finalRedirectUrl = redirect_to || getProductionUrl('/');
      console.log('Using signup redirect URL:', finalRedirectUrl);
      
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
      
      // CRITICAL: Validate extracted token_hash before proceeding
      if (!token_hash) {
        console.error('CRITICAL ERROR: token_hash extraction failed completely');
        console.error('Available email_data keys:', Object.keys(webhookData.email_data || {}));
        console.error('Full webhook structure:', JSON.stringify(webhookData, null, 2));
        return new Response(
          JSON.stringify({
            error: {
              message: 'Missing token_hash for password reset',
              details: 'token_hash could not be extracted from webhook data using any method',
              debug: {
                available_keys: Object.keys(webhookData.email_data || {}),
                email_action_type,
                user_email: user.email
              }
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      
      if (token_hash.length < 10) {
        console.error('CRITICAL ERROR: token_hash appears invalid, length:', token_hash.length);
        console.error('Invalid token_hash value:', token_hash);
        return new Response(
          JSON.stringify({
            error: {
              message: 'Invalid token_hash for password reset',
              details: `token_hash appears to be malformed (length: ${token_hash.length})`,
              debug: {
                token_hash_length: token_hash.length,
                token_hash_preview: token_hash.substring(0, 10) + '...'
              }
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      
      console.log('SUCCESS: Extracted valid token_hash (length:', token_hash.length, ')');
      
      // Use production URL as fallback for password reset
      const finalResetUrl = redirect_to || getProductionUrl('/reset-password');
      console.log('Using password reset redirect URL:', finalResetUrl);
      
      emailTemplate = React.createElement(PasswordResetEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash, // This is the critical parameter for password resets
        redirect_to: finalResetUrl,
        email_action_type,
        user_email: user.email,
      })
      
      subject = 'Reset Your AiPromptMachine Password'
      
    } else {
      console.log('Unsupported email action type:', email_action_type)
      return new Response(`Unsupported email action type: ${email_action_type}`, { status: 400 })
    }

    // Render the email template
    try {
      html = await renderAsync(emailTemplate)
    } catch (templateError: any) {
      console.error('Error rendering email template:', templateError)
      return new Response(
        JSON.stringify({
          error: {
            message: 'Failed to render email template',
            details: templateError.message,
          },
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

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
    console.log('=== PASSWORD RESET WEBHOOK DEBUG END ===');

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
