import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar, AvatarState } from '../../components/avatar/Avatar';
import { ChatBubble } from '../../components/common/ChatBubble';
import { useAI } from '../../hooks/useAI';
import { startListening, stopListening, speakText, stopSpeaking } from '../../utils/speechHelper';

export const ChatScreen: React.FC = () => {
  const { messages, isThinking, sendMessage } = useAI();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [avatarStateOverride, setAvatarStateOverride] = useState<AvatarState | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || inputText || speechTranscript;
    if (!messageText.trim()) return;

    stopListening();
    setIsListening(false);
    setSpeechTranscript('');
    setInputText('');

    setAvatarStateOverride('THINKING');

    await sendMessage(messageText);

    setAvatarStateOverride(null);
  };

  const currentAvatarState: AvatarState = avatarStateOverride || (isListening ? 'LISTENING' : isThinking ? 'THINKING' : 'IDLE');

  // Trigger TTS playback when last AI message updates
  const lastMessage = messages[messages.length - 1];
  React.useEffect(() => {
    if (lastMessage && lastMessage.sender === 'AI' && !isMuted) {
      setAvatarStateOverride('SPEAKING');
      speakText(
        lastMessage.text,
        () => setAvatarStateOverride('SPEAKING'),
        () => setAvatarStateOverride(null)
      );
    }
  }, [lastMessage, isMuted]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      stopSpeaking();
      setIsListening(true);
      setSpeechTranscript('');
      startListening(
        (transcript) => {
          setSpeechTranscript(transcript);
          setInputText(transcript);
        },
        (error) => {
          console.log('[ChatScreen] STT Error:', error);
          setIsListening(false);
        }
      );
    }
  };

  const toggleMute = () => {
    if (!isMuted) {
      stopSpeaking();
    }
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.container} accessibilityLabel="CareCompanion AI Voice Chat Screen">
      {/* Header Avatar Greeting */}
      <View style={styles.headerBox}>
        <Avatar state={currentAvatarState} size="md" showLabel={false} />
        <View style={styles.headerTextCol}>
          <Text style={styles.assistantTitle}>CareCompanion AI</Text>
          <Text style={styles.assistantSub}>
            {isListening
              ? '🎙️ Listening to your voice...'
              : isThinking
                ? '🤔 Processing response...'
                : avatarStateOverride === 'SPEAKING'
                  ? '🗣️ Speaking...'
                  : '🟢 Online & Ready to Help'}
          </Text>
        </View>
        <TouchableOpacity style={styles.muteBtn} onPress={toggleMute} accessibilityLabel="Toggle Voice Response">
          <Text style={styles.muteIcon}>{isMuted ? '🔇' : '🔊'}</Text>
        </TouchableOpacity>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </ScrollView>

      {/* Live Voice Recognition Transcript Preview Banner */}
      {isListening && (
        <View style={styles.voicePreviewBanner}>
          <Text style={styles.voicePreviewLabel}>🎙️ Live Speech Transcript (Edit or Send):</Text>
          <Text style={styles.voicePreviewText}>
            {speechTranscript || 'Speak naturally into your microphone...'}
          </Text>
        </View>
      )}

      {/* Input Bar with Mic and Send Button */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.micBtn, isListening && styles.micBtnActive]}
          onPress={toggleListening}
          accessibilityLabel={isListening ? 'Stop listening' : 'Start voice input'}
        >
          <Text style={styles.micIcon}>{isListening ? '🛑' : '🎙️'}</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder={isListening ? 'Listening...' : 'Ask about your health or medications...'}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && !speechTranscript.trim() && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() && !speechTranscript.trim()}
          accessibilityLabel="Send message"
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
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.border,
  },
  headerTextCol: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  assistantTitle: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  assistantSub: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.secondary.dark,
    marginTop: 2,
  },
  muteBtn: {
    padding: SPACING.xs,
  },
  muteIcon: {
    fontSize: 22,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  voicePreviewBanner: {
    backgroundColor: COLORS.accent.light,
    borderColor: COLORS.accent.main,
    borderWidth: 1,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    borderRadius: LAYOUT.borderRadiusSm,
    marginBottom: SPACING.xs,
  },
  voicePreviewLabel: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.accent.dark,
    marginBottom: 2,
  },
  voicePreviewText: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textPrimary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    padding: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral.border,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.neutral.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  micBtnActive: {
    backgroundColor: COLORS.error.light,
    borderColor: COLORS.error.main,
    borderWidth: 1.5,
  },
  micIcon: {
    fontSize: 22,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.neutral.background,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    maxHeight: 100,
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.neutral.border,
  },
  sendIcon: {
    color: COLORS.neutral.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
