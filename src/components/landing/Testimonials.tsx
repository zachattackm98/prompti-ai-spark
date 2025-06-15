
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { fadeInVariants, staggerContainer, cardVariants, viewportOptions } from '@/utils/animations';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      avatar: "SC",
      rating: 5,
      text: "Prompti.ai transformed my workflow. What used to take me 2 hours of research and writing now takes 2 minutes. The quality is incredible."
    },
    {
      name: "Marcus Rodriguez", 
      role: "Film Director",
      avatar: "MR",
      rating: 5,
      text: "The cinematic styles are spot-on. It's like having a professional screenwriter and cinematographer in your pocket."
    },
    {
      name: "Emma Thompson",
      role: "Marketing Agency",
      avatar: "ET", 
      rating: 5,
      text: "Our client video campaigns have never looked better. Prompti.ai helps us create consistently professional content at scale."
    }
  ];

  return (
    <section className="py-20 px-6 bg-black/20">
      <div className="container mx-auto">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Loved by Creators Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of creators who've elevated their video content with Prompti.ai
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 relative hover:scale-[1.02] transition-all duration-300 will-change-transform"
            >
              <Quote className="w-8 h-8 text-purple-400 mb-4" />
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
