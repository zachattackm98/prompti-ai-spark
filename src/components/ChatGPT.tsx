
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fadeInVariants, viewportOptions } from '@/utils/animations';
import { Send, Key, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatGPT = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai-api-key') || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem('openai-api-key', value);
  };

  const sendMessage = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: newMessages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };

      setMessages([...newMessages, assistantMessage]);
      
      toast({
        title: "Message sent!",
        description: "ChatGPT has responded successfully.",
      });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      toast({
        title: "Error",
        description: "Failed to get response from ChatGPT. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.section 
      className="py-16 px-6"
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Try ChatGPT Integration
          </h2>
          <p className="text-gray-400">
            Test the ChatGPT API integration with your own API key
          </p>
        </div>

        <Card className="bg-slate-900/60 border-white/10 p-6">
          {/* API Key Input */}
          <div className="mb-6">
            <label className="block text-white mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" />
              OpenAI API Key
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Enter your OpenAI API key (sk-...)"
              className="bg-slate-800 border-white/20 text-white placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>

          {/* Chat Messages */}
          <div className="mb-4 h-64 overflow-y-auto bg-slate-800/50 rounded-lg p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <MessageCircle className="w-8 h-8 mr-2" />
                Start a conversation with ChatGPT
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
              placeholder="Type your message here..."
              className="flex-1 bg-slate-800 border-white/20 text-white placeholder:text-gray-400 resize-none"
              rows={2}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </motion.section>
  );
};

export default ChatGPT;
