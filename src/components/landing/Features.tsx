
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Camera, Film, Sparkles2, Globe, Shield } from 'lucide-react';

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
      icon: Sparkles2,
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

  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built for Professional Creators
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Every feature designed to elevate your video creation process from amateur to cinematic.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
