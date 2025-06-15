
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Camera, Film, Sparkles, Globe, Shield } from 'lucide-react';
import { fadeInVariants, staggerContainer, viewportOptions } from '@/utils/animations';

const Features = () => {
  const features = [
    {
      icon: Palette,
      title: "Style Library",
      description: "Access 50+ cinematic styles from noir to sci-fi, each crafted by film professionals."
    },
    {
      icon: Camera,
      title: "Camera Intelligence", 
      description: "Smart camera angle suggestions based on your scene type and emotional intent."
    },
    {
      icon: Film,
      title: "Director's Toolkit",
      description: "Reference legendary directors' techniques with one-click style applications."
    },
    {
      icon: Sparkles,
      title: "Auto-Enhancement",
      description: "Our AI automatically adds professional touches to make your prompts shine."
    },
    {
      icon: Globe,
      title: "Platform Optimizer",
      description: "Each prompt is fine-tuned for optimal results across all major AI video platforms."
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Every generated prompt is tested and refined for consistent, professional results."
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }
    }
  };

  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built for Professional Creators
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Every feature designed to elevate your video creation process from amateur to cinematic.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group will-change-transform"
            >
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-8 h-full hover:bg-slate-900/60 transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 will-change-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
