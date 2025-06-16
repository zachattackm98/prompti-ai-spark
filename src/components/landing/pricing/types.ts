
import { LucideIcon } from 'lucide-react';

export interface PricingPlan {
  name: string;
  icon: LucideIcon;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  tier: 'starter' | 'creator' | 'studio';
}
