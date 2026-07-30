import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { ChatMessage } from '../../types/AI';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'USER';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>{message.text}</Text>
      </View>
      {message.disclaimer ? (
        <Text style={styles.disclaimerText}>⚠️ {message.disclaimer}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: LAYOUT.borderRadiusCard,
  },
  userBubble: {
    backgroundColor: COLORS.primary.main,
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    backgroundColor: COLORS.neutral.white,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
  },
  text: {
    fontSize: TYPOGRAPHY.fontSize.body,
    lineHeight: 20,
  },
  userText: {
    color: COLORS.neutral.white,
  },
  aiText: {
    color: COLORS.neutral.textPrimary,
  },
  disclaimerText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.warning.dark,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
