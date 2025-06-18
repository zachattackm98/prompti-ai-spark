
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Heading,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { emailStyles } from './shared/emailStyles.ts'
import { 
  EmailHeader, 
  ResetButton, 
  SecuritySection, 
  EmailFooter 
} from './shared/EmailComponents.tsx'
import { buildResetUrl } from './shared/urlUtils.ts'

interface PasswordResetEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const PasswordResetEmail = ({
  token_hash,
  supabase_url,
  email_action_type,
  redirect_to,
  user_email,
}: PasswordResetEmailProps) => {
  console.log('Password reset email - token_hash:', token_hash ? 'present' : 'missing');
  
  if (!token_hash) {
    throw new Error('token_hash is required for password reset email');
  }
  
  const resetUrl = buildResetUrl(supabase_url, token_hash, email_action_type, redirect_to);
  
  const securityItems = [
    '🔒 This link will expire in 1 hour for your security',
    '⚡ Use this link immediately - it can only be used once',
    '🛡️ Only use this link if you requested a password reset',
    '⚠️ If you didn\'t request this, please ignore this email and your account remains secure'
  ];

  return (
    <Html>
      <Head />
      <Preview>Reset your AiPromptMachine password - Action required within 1 hour</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <EmailHeader
            logoSrc="https://aipromptmachine.com/lovable-uploads/02d61b87-d7e8-4974-888b-0ce4a627c116.png"
            logoAlt="AiPromptMachine"
            title="Password Reset Request 🔐"
          />
          
          <Text style={emailStyles.text}>
            Hi there! We received a request to reset your password for your AiPromptMachine account ({user_email}).
          </Text>
          
          <Text style={emailStyles.text}>
            <strong>Important:</strong> This link expires in 1 hour and can only be used once. Click the button below to reset your password:
          </Text>
          
          <ResetButton href={resetUrl}>
            Reset Your Password Now
          </ResetButton>
          
          <Text style={emailStyles.text}>
            <strong>If the button doesn't work,</strong> copy and paste this link in your browser:
          </Text>
          
          <Link
            href={resetUrl}
            style={emailStyles.link}
          >
            {resetUrl}
          </Link>
          
          <SecuritySection
            title="Security Information:"
            items={securityItems}
          />
          
          <Text style={emailStyles.footerText}>
            If you didn't request a password reset, you can safely ignore this email. Your account remains secure and no changes have been made.
          </Text>
          
          <EmailFooter
            websiteUrl="https://aipromptmachine.com"
            websiteName="aipromptmachine.com"
          />
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;
