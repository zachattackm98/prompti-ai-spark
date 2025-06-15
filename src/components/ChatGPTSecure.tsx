
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fadeInVariants, viewportOptions } from '@/utils/animations';
import { Send, MessageCircle, LogOut, Sparkles, Zap, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AuthDialog from './AuthDialog';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatGPTSecure = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const handleSendMessage = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    sendMessage();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-gpt', {
        body: { messages: newMessages },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      };

      setMessages([...newMessages, assistantMessage]);
      
      toast({
        title: "Message sent!",
        description: "ChatGPT has responded successfully.",
      });
    } catch (error: any) {
      console.error('Error calling ChatGPT:', error);
      toast({
        title: "Error",
        description: "Failed to get response from ChatGPT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setMessages([]);
  };

  return (
    <>
      <motion.section 
        className="py-16 px-6 relative overflow-hidden"
        variants={fadeInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-4 h-4 bg-purple-400/20 rounded-full"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: 0
            }}
          />
          <motion.div
            className="absolute top-32 right-20 w-3 h-3 bg-pink-400/20 rounded-full"
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 w-5 h-5 bg-blue-400/20 rounded-full"
            animate={{ 
              y: [0, -25, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ 
              duration: 3.5,
              repeat: Infinity,
              delay: 2
            }}
          />
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <motion.div
                className="flex items-center justify-center gap-3 mb-4"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-purple-400/30" />
                  </motion.div>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  AI Chat Experience
                </h2>
                <div className="relative">
                  <Zap className="w-8 h-8 text-pink-400" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-8 h-8 text-pink-400/50" />
                  </motion.div>
                </div>
              </motion.div>
              <motion.p 
                className="text-gray-300 text-lg"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Watch your prompts come to life with AI-powered responses
              </motion.p>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <p className="text-gray-300">Welcome, {user.email}</p>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-6 backdrop-blur-sm">
              {/* Chat Messages */}
              <div className="mb-6 h-80 overflow-y-auto bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-xl p-6 space-y-4 border border-white/5">
                {messages.length === 0 ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center h-full text-center space-y-6"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity
                        }}
                      />
                      <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-full border border-purple-400/30">
                        <MessageCircle className="w-12 h-12 text-purple-300" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <motion.h3 
                        className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {user ? 'Ready for AI Magic!' : 'Your AI Adventure Starts Here!'}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-gray-300 text-lg max-w-md mx-auto"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {user 
                          ? 'Type your prompt below and watch as AI transforms your ideas into amazing responses!'
                          : 'Start typing your prompt below - no signup required until you\'re ready to send!'
                        }
                      </motion.p>
                      
                      <motion.div 
                        className="flex items-center justify-center gap-2 text-sm text-purple-300"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Star className="w-4 h-4" />
                        <span>Powered by ChatGPT</span>
                        <Star className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                            : 'bg-gradient-to-r from-slate-700 to-slate-600 text-gray-100 shadow-lg'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <motion.div 
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-gray-100 px-4 py-3 rounded-xl shadow-lg">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4 text-purple-300" />
                        </motion.div>
                        <p className="text-sm">AI is crafting your response...</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Message Input */}
              <motion.div 
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="✨ Type your amazing prompt here..."
                      className="bg-slate-800/60 border-purple-400/30 text-white placeholder:text-gray-400 resize-none focus:border-purple-400/60 focus:ring-purple-400/20 backdrop-blur-sm"
                      rows={3}
                    />
                    {inputMessage && (
                      <motion.div
                        className="absolute top-2 right-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </motion.div>
                    )}
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                
                {!user && (
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <p className="text-purple-300 text-sm font-medium bg-purple-900/20 border border-purple-400/20 rounded-lg py-2 px-4 inline-block">
                      🚀 Ready to send? Just hit the button to create your free account!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
};

export default ChatGPTSecure;
