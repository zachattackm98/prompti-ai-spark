import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

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
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your AiPromptMachine password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <img 
            src="https://aipromptmachine.com/lovable-uploads/02d61b87-d7e8-4974-888b-0ce4a627c116.png" 
            alt="AiPromptMachine" 
            style={logo}
          />
          <Heading style={h1}>Password Reset Request 🔐</Heading>
        </Section>
        
        <Text style={text}>
          Hi there! We received a request to reset your password for your AiPromptMachine account.
        </Text>
        
        <Text style={text}>
          If you requested this password reset, click the button below to set a new password:
        </Text>
        
        <Section style={buttonContainer}>
          <Button
            href={`${supabase_url}/auth/v1/verify?token=${token}&type=${email_action_type}&redirect_to=${redirect_to}`}
            style={button}
          >
            Reset Your Password
          </Button>
        </Section>
        
        <Text style={text}>
          Or copy and paste this link in your browser:
        </Text>
        
        <Link
          href={`${supabase_url}/auth/v1/verify?token=${token}&type=${email_action_type}&redirect_to=${redirect_to}`}
          style={link}
        >
          {`${supabase_url}/auth/v1/verify?token=${token}&type=${email_action_type}&redirect_to=${redirect_to}`}
        </Link>
        
        <Section style={securitySection}>
          <Text style={securityTitle}>Security Information:</Text>
          <Text style={securityItem}>🔒 This link will expire in 1 hour for your security</Text>
          <Text style={securityItem}>🛡️ Only use this link if you requested a password reset</Text>
          <Text style={securityItem}>⚠️ If you didn't request this, please ignore this email</Text>
        </Section>
        
        <Text style={footerText}>
          If you're having trouble with the button above, copy and paste the URL into your web browser. If you didn't request a password reset, you can safely ignore this email - your account remains secure.
        </Text>
        
        <Text style={footer}>
          Best regards,<br />
          The AiPromptMachine Team<br />
          <Link href="https://aipromptmachine.com" style={footerLink}>
            aipromptmachine.com
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PasswordResetEmail

const main = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  backgroundColor: '#1e293b',
  borderRadius: '8px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '30px',
}

const logo = {
  width: '32px',
  height: '32px',
  margin: '0 auto 20px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
}

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const link = {
  color: '#a855f7',
  textDecoration: 'underline',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
}

const securitySection = {
  backgroundColor: '#334155',
  borderRadius: '6px',
  padding: '20px',
  margin: '24px 0',
}

const securityTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
}

const securityItem = {
  color: '#e2e8f0',
  fontSize: '14px',
  margin: '8px 0',
}

const footerText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0',
}

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '32px',
  textAlign: 'center' as const,
}

const footerLink = {
  color: '#a855f7',
  textDecoration: 'none',
}
