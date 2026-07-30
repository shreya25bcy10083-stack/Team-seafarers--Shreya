import { ApiClient, mockDelay } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  avatarState?: 'SPEAKING' | 'LISTENING' | 'THINKING' | 'HAPPY' | 'CONCERNED';
  tips?: string[];
  warning?: string;
  disclaimer?: string;
}

export const AIService = {
  async sendMessage(userMessage: string): Promise<ApiResponse<ChatMessage>> {
    const response = await ApiClient.request<{ reply: string; tips?: string[]; warning?: string; disclaimer?: string }>(
      API_CONFIG.ENDPOINTS.AI.CHAT,
      {
        method: 'POST',
        body: { message: userMessage },
      }
    );

    if (response.success && response.data?.reply) {
      const data = response.data;
      const responseMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: 'AI',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarState: data.warning ? 'CONCERNED' : 'SPEAKING',
        tips: data.tips,
        warning: data.warning,
        disclaimer: data.disclaimer,
      };

      return {
        success: true,
        message: 'AI response received',
        data: responseMsg,
      };
    }

    // Mock fallback if offline / backend not running
    await mockDelay(600);
    let aiReply = "I'm here to support you! Remember to take your scheduled medications and rest well today.";
    const lower = userMessage.toLowerCase();

    if (lower.includes('headache') || lower.includes('pain') || lower.includes('dizzy')) {
      aiReply =
        "I hear that you're feeling unwell. Please sit down comfortably, drink some water, and rest. If the symptom persists, I can notify your caregiver right away.";
    } else if (lower.includes('medication') || lower.includes('pill')) {
      aiReply =
        "Your medications are tracked safely in your schedule. Would you like me to check your upcoming doses?";
    } else if (lower.includes('hello') || lower.includes('hi')) {
      aiReply = "Good day! How are you feeling today? I am right here whenever you need assistance.";
    }

    const responseMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'AI',
      text: aiReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarState: 'SPEAKING',
      disclaimer: "This information is educational and should not replace advice from a qualified healthcare professional.",
    };

    return {
      success: true,
      message: 'AI response received (Mock Mode)',
      data: responseMsg,
    };
  },
};
