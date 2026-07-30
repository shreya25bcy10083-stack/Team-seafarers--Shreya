import { useState } from 'react';
import { AIService, ChatMessage } from '../services/ai.service';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_0',
    sender: 'AI',
    text: 'Hello Eleanor! I am your CareCompanion. How are you feeling today? Remember to take your morning medication.',
    timestamp: '08:00 AM',
    avatarState: 'SPEAKING',
  },
];

export const useAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'USER',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const res = await AIService.sendMessage(text);
      if (res.success) {
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error('AI message failed', err);
    } finally {
      setIsThinking(false);
    }
  };

  return {
    messages,
    isThinking,
    sendMessage,
  };
};
