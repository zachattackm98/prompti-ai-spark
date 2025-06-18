
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
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
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  user_email,
}: PasswordResetEmailProps) => {
  const resetUrl = buildResetUrl(supabase_url, token, email_action_type, redirect_to);
  
  const securityItems = [
    '🔒 This link will expire in 1 hour for your security',
    '🛡️ Only use this link if you requested a password reset',
    '⚠️ If you didn\'t request this, please ignore this email'
  ];

  return (
    <Html>
      <Head />
      <Preview>Reset your AiPromptMachine password</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <EmailHeader
            logoSrc="https://aipromptmachine.com/lovable-uploads/02d61b87-d7e8-4974-888b-0ce4a627c116.png"
            logoAlt="AiPromptMachine"
            title="Password Reset Request 🔐"
          />
          
          <Text style={emailStyles.text}>
            Hi there! We received a request to reset your password for your AiPromptMachine account.
          </Text>
          
          <Text style={emailStyles.text}>
            If you requested this password reset, click the button below to set a new password:
          </Text>
          
          <ResetButton href={resetUrl}>
            Reset Your Password
          </ResetButton>
          
          <Text style={emailStyles.text}>
            Or copy and paste this link in your browser:
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
            If you're having trouble with the button above, copy and paste the URL into your web browser. If you didn't request a password reset, you can safely ignore this email - your account remains secure.
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
