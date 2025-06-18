
import { Sparkles, Crown, Rocket } from 'lucide-react';
import { PricingPlan } from './types';

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    icon: Sparkles,
    price: "Free",
    description: "Perfect for trying out Prompti.ai",
    features: [
      "5 prompts per month", // Matches TIER_LIMITS.starter
      "2 AI video platforms (Veo3, Sora)",
      "4 basic emotions/moods",
      "Standard prompt quality",
      "Email support"
    ],
    cta: "Start Free",
    popular: false,
    tier: "starter"
  },
  {
    name: "Creator",
    icon: Crown,
    price: "$19",
    period: "/month",
    description: "For serious content creators",
    features: [
      "500 prompts per month", // Matches TIER_LIMITS.creator
      "All 4 AI video platforms",
      "10 cinematic emotions/moods", 
      "Professional camera controls",
      "Advanced lighting & visual styles",
      "Enhanced prompt quality",
      "Priority support",
      "Batch processing"
    ],
    cta: "Start Creating",
    popular: true,
    tier: "creator"
  },
  {
    name: "Studio",
    icon: Rocket,
    price: "$49",
    period: "/month",
    description: "For teams and agencies",
    features: [
      "1000 prompts per month", // Matches TIER_LIMITS.studio
      "Everything in Creator",
      "Team collaboration",
      "Priority access to new platforms",
      "Custom brand style guides",
      "API access",
      "White-label options",
      "Dedicated support manager"
    ],
    cta: "Contact Sales",
    popular: false,
    tier: "studio"
  }
];
