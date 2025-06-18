
import {
  Section,
  Text,
  Link,
  Button,
  Heading,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { emailStyles } from './emailStyles.ts'

interface EmailHeaderProps {
  logoSrc: string;
  logoAlt: string;
  title: string;
}

export const EmailHeader = ({ logoSrc, logoAlt, title }: EmailHeaderProps) => (
  <Section style={emailStyles.header}>
    <img 
      src={logoSrc} 
      alt={logoAlt} 
      style={emailStyles.logo}
    />
    <Heading style={emailStyles.h1}>{title}</Heading>
  </Section>
);

interface ResetButtonProps {
  href: string;
  children: React.ReactNode;
}

export const ResetButton = ({ href, children }: ResetButtonProps) => (
  <Section style={emailStyles.buttonContainer}>
    <Button
      href={href}
      style={emailStyles.button}
    >
      {children}
    </Button>
  </Section>
);

interface SecuritySectionProps {
  title: string;
  items: string[];
}

export const SecuritySection = ({ title, items }: SecuritySectionProps) => (
  <Section style={emailStyles.securitySection}>
    <Text style={emailStyles.securityTitle}>{title}</Text>
    {items.map((item, index) => (
      <Text key={index} style={emailStyles.securityItem}>{item}</Text>
    ))}
  </Section>
);

interface EmailFooterProps {
  websiteUrl: string;
  websiteName: string;
}

export const EmailFooter = ({ websiteUrl, websiteName }: EmailFooterProps) => (
  <Text style={emailStyles.footer}>
    Best regards,<br />
    The AiPromptMachine Team<br />
    <Link href={websiteUrl} style={emailStyles.footerLink}>
      {websiteName}
    </Link>
  </Text>
);
