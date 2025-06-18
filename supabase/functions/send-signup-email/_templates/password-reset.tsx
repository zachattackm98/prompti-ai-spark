
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
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  user_email,
}: PasswordResetEmailProps) => {
  const resetUrl = buildResetUrl(supabase_url, token, email_action_type, redirect_to);
  
  const securityItems = [
    '🔒 This link will expire in 1 hour for your security',
    '⚡ Use this link immediately - it can only be used once',
    '🛡️ Only use this link if you requested a password reset',
    '⚠️ If you didn\'t request this, please ignore this email and your account remains secure'
  ];

  const importantTips = [
    'Click the button above rather than copying the link when possible',
    'Do not share this email or link with anyone',
    'Complete the password reset within 1 hour',
    'If the link doesn\'t work, request a new password reset'
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
            <strong>Important:</strong> This link expires in 1 hour and can only be used once. Click the button below to reset your password immediately:
          </Text>
          
          <ResetButton href={resetUrl}>
            Reset Your Password Now
          </ResetButton>
          
          <Section style={emailStyles.securitySection}>
            <Text style={emailStyles.securityTitle}>🚨 Important Instructions:</Text>
            {importantTips.map((tip, index) => (
              <Text key={index} style={emailStyles.securityItem}>• {tip}</Text>
            ))}
          </Section>
          
          <Text style={emailStyles.text}>
            <strong>If the button doesn't work,</strong> copy and paste this link in your browser (but use it quickly):
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
            <strong>Troubleshooting:</strong> If you're having trouble with this reset link, it may have expired. Simply request a new password reset from the login page. If you continue to have issues, this usually means the link was used already or has expired - just request a fresh one.
          </Text>
          
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
