
import { Sparkles, Crown, Rocket } from 'lucide-react';
import { PricingPlan } from './types';

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    icon: Sparkles,
    price: "Free",
    description: "Perfect for trying out Prompti.ai",
    features: [
      "5 prompts per month",
      "2 AI video platforms (Veo3, Sora)",
      "10 cinematic emotions/moods",
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
      "500 prompts per month",
      "All 4 AI video platforms",
      "10 cinematic emotions/moods", 
      "Professional camera controls",
      "Enhanced visual styles",
      "Enhanced prompt quality",
      "Priority support",
      "Batch processing",
      "🚀 Coming Soon: Prompt history saving",
      "🚀 Coming Soon: Multi-scene projects"
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
      "1000 prompts per month",
      "Everything in Creator",
      "Advanced lighting controls",
      "Team collaboration",
      "Priority access to new platforms",
      "Custom brand style guides",
      "API access",
      "White-label options",
      "Dedicated support manager",
      "🚀 Coming Soon: Advanced project management",
      "🚀 Coming Soon: Extended history archives"
    ],
    cta: "Contact Sales",
    popular: false,
    tier: "studio"
  }
];
