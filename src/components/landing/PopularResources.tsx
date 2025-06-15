
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Lightbulb, Users } from 'lucide-react';
import { fadeInVariants, staggerContainer, cardVariants, viewportOptions } from '@/utils/animations';

const PopularResources = () => {
  const resources = [
    {
      icon: BookOpen,
      title: "Prompt Guide",
      description: "Master the art of AI video prompting",
      link: "#"
    },
    {
      icon: Video,
      title: "Tutorial Series",
      description: "Step-by-step video walkthroughs",
      link: "#"
    },
    {
      icon: Lightbulb,
      title: "Inspiration Gallery",
      description: "Browse successful prompt examples",
      link: "#"
    },
    {
      icon: Users,
      title: "Creator Community",
      description: "Connect with fellow video creators",
      link: "#"
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
            Popular Resources
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to master AI video creation and join our thriving community
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {resources.map((resource, index) => (
            <motion.a
              key={resource.title}
              href={resource.link}
              variants={cardVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group block will-change-transform hover:scale-[1.02]"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <resource.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{resource.title}</h3>
              <p className="text-gray-300 leading-relaxed">{resource.description}</p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularResources;
