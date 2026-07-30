import { mockDelay } from './api';
import { ApiResponse } from '../types/API';

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  avatarState?: 'SPEAKING' | 'LISTENING' | 'THINKING' | 'HAPPY' | 'CONCERNED';
}

export const AIService = {
  async sendMessage(userMessage: string): Promise<ApiResponse<ChatMessage>> {
    await mockDelay(800);

    let aiReply = "I'm here to support you! Remember to take your scheduled medications and rest well today.";
    const lower = userMessage.toLowerCase();

    if (lower.includes('headache') || lower.includes('pain') || lower.includes('dizzy')) {
      aiReply =
        "I hear that you're feeling unwell. Please sit down comfortably, drink some water, and rest. If the symptom persists, I can notify your caregiver Robert right away.";
    } else if (lower.includes('medication') || lower.includes('pill')) {
      aiReply =
        "You have taken your morning Metformin! Your next medication is Calcium + Vitamin D at 01:00 PM. Would you like me to set a voice reminder?";
    } else if (lower.includes('hello') || lower.includes('hi')) {
      aiReply = "Good day, Eleanor! How are you feeling today? I am right here whenever you need assistance.";
    }

    const responseMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'AI',
      text: aiReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarState: 'SPEAKING',
    };

    return {
      success: true,
      message: 'AI response received',
      data: responseMsg,
    };
  },
};
