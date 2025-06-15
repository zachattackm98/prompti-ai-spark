
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sliders, Copy } from 'lucide-react';

const Process = () => {
  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      title: "Share Your Vision",
      description: "Tell us your scene idea in plain English. 'A dragon flying over a medieval castle' is all we need.",
      preview: "A dragon soaring majestically..."
    },
    {
      number: "02", 
      icon: Sliders,
      title: "Refine the Style",
      description: "Choose your mood, camera angle, and cinematic style. We'll guide you through each option.",
      preview: "Epic • Wide shot • Fantasy genre"
    },
    {
      number: "03",
      icon: Copy,
      title: "Copy & Create",
      description: "Get your perfectly structured prompt, ready to paste into any AI video platform.",
      preview: "SHOT: Wide establishing shot..."
    }
  ];

  return (
    <section className="py-20 px-6 bg-black/20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            From Idea to Masterpiece in 3 Steps
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our intelligent system transforms your creative vision into professional prompts that AI video tools love.
          </p>
        </motion.div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <span className="text-5xl font-bold text-purple-400 mr-4">{step.number}</span>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-lg text-gray-300 leading-relaxed">{step.description}</p>
              </div>
              
              <div className="flex-1">
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="bg-gray-900/50 rounded-xl p-6 font-mono text-sm">
                    <div className="text-purple-400 mb-2">// Step {step.number} Preview</div>
                    <div className="text-gray-300">{step.preview}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
