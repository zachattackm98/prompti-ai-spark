
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Wand2, Clock, Palette, Layers } from 'lucide-react';
import { fadeInVariants, staggerContainer, cardVariants, viewportOptions } from '@/utils/animations';

const Benefits = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate professional prompts in under 30 seconds. No more staring at blank screens."
    },
    {
      icon: Target,
      title: "Precision Crafted",
      description: "Every prompt is structured for maximum impact across all major AI video platforms."
    },
    {
      icon: Wand2,
      title: "Style Mastery",
      description: "Choose from cinematic styles, moods, and techniques used by Hollywood directors."
    },
    {
      icon: Clock,
      title: "Save Hours Daily",
      description: "What used to take hours of research and writing now happens in minutes."
    },
    {
      icon: Palette,
      title: "Creative Control",
      description: "Fine-tune every aspect from camera angles to emotional tone with precision."
    },
    {
      icon: Layers,
      title: "Multi-Platform",
      description: "One prompt, optimized for Sora, Runway, Pika, Veo, and more platforms."
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Creators Choose Prompti.ai
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stop wrestling with prompt engineering. Start creating cinematic masterpieces.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={cardVariants}
              className="bg-slate-900/40 border border-white/10 rounded-2xl p-8 hover:bg-slate-900/60 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 will-change-transform"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
              <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
