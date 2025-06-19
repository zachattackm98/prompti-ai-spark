
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
      "All 4 AI video platforms",
      "10 cinematic emotions/moods",
      "Professional camera controls",
      "Lighting & visual styles",
      "Sound design & music options",
      "Dialog & narration features",
      "Enhanced prompt quality",
      "Batch processing",
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
      "Lighting & visual styles",
      "Sound design & music options",
      "Dialog & narration features",
      "Enhanced prompt quality",
      "Priority support",
      "Batch processing",
      "Style reference enhancement",
      "🚀 Coming Soon: Prompt history saving"
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
      "All 4 AI video platforms",
      "10 cinematic emotions/moods", 
      "Professional camera controls",
      "Lighting & visual styles",
      "Sound design & music options",
      "Dialog & narration features",
      "Enhanced prompt quality",
      "Priority support",
      "Batch processing",
      "Style reference enhancement",
      "🚀 Coming Soon: Prompt history saving",
      "🚀 Coming Soon: Multi-scene projects",
      "Priority access to new platforms",
      "Dedicated support manager"
    ],
    cta: "Contact Sales",
    popular: false,
    tier: "studio"
  }
];
