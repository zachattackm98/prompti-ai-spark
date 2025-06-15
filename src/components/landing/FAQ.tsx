
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How is Prompti.ai different from writing prompts myself?",
      answer: "Prompti.ai uses advanced AI trained on thousands of successful video prompts to structure your ideas professionally. Instead of guessing what works, you get prompts optimized for each platform's specific requirements, saving hours of trial and error."
    },
    {
      question: "Which AI video platforms does it work with?",
      answer: "Prompti.ai generates prompts optimized for all major platforms including Sora, Runway Gen-2, Pika Labs, Veo, Stable Video Diffusion, and more. Each prompt is automatically formatted for maximum compatibility."
    },
    {
      question: "Do I need any technical knowledge to use it?",
      answer: "Not at all! Prompti.ai is designed for creators, not engineers. Simply describe your scene idea in plain English, choose your style preferences, and we handle all the technical prompt engineering behind the scenes."
    },
    {
      question: "Can I customize the generated prompts?",
      answer: "Absolutely! Every prompt can be fine-tuned for tone, style, camera angles, lighting, and more. You can also save your favorite settings as custom presets for faster future generation."
    },
    {
      question: "How much time does Prompti.ai actually save?",
      answer: "Most users report saving 2-3 hours per prompt. What used to require research, writing, testing, and refinement now takes under 2 minutes. That's a 90%+ time reduction while improving quality."
    },
    {
      question: "Is there a limit to how many prompts I can generate?",
      answer: "The Starter plan includes 5 prompts per month. Creator and Studio plans offer unlimited prompt generation, perfect for professional workflows and high-volume content creation."
    }
  ];

  return (
    <section id="faq" className="py-20 px-6 bg-black/20">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to know about creating cinematic prompts with AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 data-[state=open]:bg-white/10"
              >
                <AccordionTrigger className="text-white hover:text-purple-400 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
