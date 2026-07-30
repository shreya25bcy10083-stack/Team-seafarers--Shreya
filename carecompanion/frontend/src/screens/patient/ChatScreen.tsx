import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../../components/avatar/Avatar';
import { VoiceButton } from '../../components/buttons/VoiceButton';
import { useAI } from '../../hooks/useAI';

export const ChatScreen: React.FC = () => {
  const { messages, isThinking, sendMessage } = useAI();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const suggestedPrompts = [
    'What medications do I take today?',
    'Explain my blood report',
    'I am feeling slightly dizzy',
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <View style={styles.container} accessibilityLabel="AI Companion Voice Chat Screen">
      {/* Top Header with Avatar */}
      <View style={styles.avatarHeader}>
        <Avatar state={isThinking ? 'THINKING' : isListening ? 'LISTENING' : 'SMILING'} size="md" />
      </View>

      {/* Chat Messages Log */}
      <ScrollView contentContainerStyle={styles.chatList}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'USER';
          return (
            <View
              key={msg.id}
              style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.aiWrapper]}
              accessibilityLabel={`${isUser ? 'You' : 'AI Companion'} said: ${msg.text}`}
            >
              <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.aiBubbleText]}>
                  {msg.text}
                </Text>
                <Text style={styles.timestamp}>{msg.timestamp}</Text>
              </View>
            </View>
          );
        })}

        {isThinking && (
          <View style={[styles.bubbleWrapper, styles.aiWrapper]}>
            <View style={[styles.bubble, styles.aiBubble]}>
              <Text style={styles.aiBubbleText}>CareCompanion is thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggested Quick Prompts */}
      <View style={styles.promptsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {suggestedPrompts.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.promptChip}
              onPress={() => handlePromptClick(prompt)}
              accessibilityRole="button"
              accessibilityLabel={`Ask prompt: ${prompt}`}
            >
              <Text style={styles.promptText}>💬 {prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Speak or type a message..."
          placeholderTextColor={COLORS.neutral.textMuted}
          value={inputText}
          onChangeText={setInputText}
          accessibilityLabel="Message input"
        />

        <VoiceButton
          isListening={isListening}
          onPress={() => {
            setIsListening(!isListening);
            if (!isListening) {
              setTimeout(() => {
                setIsListening(false);
                sendMessage('I have taken my morning pills!');
              }, 2500);
            }
          }}
        />

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSend}
          accessibilityRole="button"
          accessibilityLabel="Send Message"
        >
          <Text style={styles.sendIcon}>➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.background,
  },
  avatarHeader: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.border,
  },
  chatList: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  bubbleWrapper: {
    marginBottom: SPACING.md,
    maxWidth: '82%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  aiWrapper: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: SPACING.md,
    borderRadius: LAYOUT.borderRadiusCard,
  },
  userBubble: {
    backgroundColor: COLORS.secondary.main,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.accent.light,
    borderColor: COLORS.accent.main,
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: TYPOGRAPHY.fontSize.body,
    lineHeight: TYPOGRAPHY.lineHeight.body,
  },
  userBubbleText: {
    color: COLORS.neutral.white,
  },
  aiBubbleText: {
    color: COLORS.neutral.textPrimary,
  },
  timestamp: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.neutral.textMuted,
    marginTop: 4,
    textAlign: 'right',
  },
  promptsContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  promptChip: {
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.secondary.main,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginRight: SPACING.sm,
  },
  promptText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.secondary.main,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.neutral.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral.border,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    height: LAYOUT.preferredTouchTarget,
    minHeight: LAYOUT.minTouchTarget,
    backgroundColor: COLORS.neutral.background,
    borderRadius: LAYOUT.borderRadiusMd,
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textPrimary,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: COLORS.neutral.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
