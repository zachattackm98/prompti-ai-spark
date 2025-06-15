
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fadeInVariants, viewportOptions } from '@/utils/animations';
import { Send, MessageCircle, LogOut } from 'lucide-react';
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
        className="py-16 px-6"
        variants={fadeInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
      >
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h2 className="text-3xl font-bold text-white mb-4">
                Secure ChatGPT Integration
              </h2>
              <p className="text-gray-400">
                Chat securely with ChatGPT - your API key is protected on our servers
              </p>
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

          <Card className="bg-slate-900/60 border-white/10 p-6">
            {/* Chat Messages */}
            <div className="mb-4 h-64 overflow-y-auto bg-slate-800/50 rounded-lg p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <MessageCircle className="w-8 h-8 mr-2" />
                  {user ? 'Start a secure conversation with ChatGPT' : 'Sign in to start chatting with ChatGPT'}
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-gray-100 px-4 py-2 rounded-lg">
                    <p className="text-sm">ChatGPT is typing...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={user ? "Type your message here..." : "Sign in to start chatting..."}
                className="flex-1 bg-slate-800 border-white/20 text-white placeholder:text-gray-400 resize-none"
                rows={2}
                disabled={!user}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {!user && (
              <p className="text-center text-gray-400 text-sm mt-2">
                Sign in or create an account to use the ChatGPT feature
              </p>
            )}
          </Card>
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
