
import { Sparkles, Crown, Rocket } from 'lucide-react';
import { PricingPlan } from './types';

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    icon: Sparkles,
    price: "Free",
    description: "Experience the full power with 5 prompts/month",
    features: [
      "5 prompts per month",
      "All 4 AI video platforms (Veo3, Sora, Runway, Pika)",
      "10 cinematic emotions/moods",
      "Professional camera controls",
      "Advanced lighting & visual styles",
      "Sound design & music options",
      "Dialog & narration features",
      "Style reference enhancement",
      "Email support"
    ],
    cta: "Start Free",
    popular: false,
    tier: "starter"
  },
  {
    name: "Creator",
    icon: Crown,
    price: "$12",
    period: "/month",
    description: "For serious content creators who need more",
    features: [
      "150 prompts per month",
      "Everything in Starter plan",
      "Multi-scene projects",
      "Priority support",
      "Prompt history saving",
      "Advanced analytics",
      "Enhanced prompt quality"
    ],
    cta: "Upgrade to Creator",
    popular: true,
    tier: "creator"
  },
  {
    name: "Studio",
    icon: Rocket,
    price: "$18",
    period: "/month",
    description: "For teams and agencies with high volume needs",
    features: [
      "300 prompts per month",
      "Everything in Creator plan", 
      "Priority access to new platforms",
      "Dedicated support manager"
    ],
    cta: "Upgrade to Studio",
    popular: false,
    tier: "studio"
  }
];
