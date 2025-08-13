import { generateUUID } from "@/lib/utils";
import { Redirect, Stack, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, type TextInput, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { generateText } from "ai";
import { Platform } from "react-native";

// Platform-specific Apple provider
let apple: any = null;

// Function to dynamically load Apple provider
const loadAppleProvider = async () => {
  if (Platform.OS === 'ios' && !apple) {
    try {
      const appleModule = await import('@react-native-ai/apple');
      apple = appleModule.apple;
    } catch (error) {
      console.warn('Apple AI provider not available:', error);
    }
  }
};

import { LottieLoader } from "@/components/lottie-loader";
import { ChatInterface } from "@/components/chat-interface";
import { ChatInput } from "@/components/ui/chat-input";
import { SuggestedActions } from "@/components/suggested-actions";
import type { ScrollView as GHScrollView } from "react-native-gesture-handler";
import { useStore } from "@/lib/globalStore";
import { MessageCirclePlusIcon, Menu } from "lucide-react-native";
import type { UIMessage } from "@ai-sdk/react";
import Animated, { FadeIn } from "react-native-reanimated";

type WeatherResult = {
  city: string;
  temperature: number;
  weatherCode: string;
  humidity: number;
  wind: number;
};

const HomePage = () => {
  const {
    clearImageUris,
    setBottomChatHeightHandler,
    setFocusKeyboard,
    chatId,
    setChatId,
  } = useStore();
  const inputRef = useRef<TextInput>(null);

  // Initialize chatId if not set
  useEffect(() => {
    if (!chatId) {
      setChatId({ id: generateUUID(), from: "newChat" });
    }
  }, []);

  // Local state for input management and messages
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Custom sendMessage function using Apple Foundation Model
  const sendMessage = useCallback(async ({ text }: { text: string }) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: generateUUID(),
      role: 'user' as const,
      content: text,
      parts: [{ type: 'text' as const, text: text }],
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let result;
      
      if (Platform.OS === 'ios') {
        // Load Apple provider if not already loaded
        await loadAppleProvider();
        
        if (apple) {
          // Use Apple Foundation Model on iOS
          result = await generateText({
            model: apple(),
            prompt: text,
          });
        } else {
          result = {
            text: 'Apple Foundation Model is not available. Please ensure you have Apple Intelligence enabled on your iOS device.'
          };
        }
      } else {
        // Fallback for web/Android - show platform message
        result = {
          text: `Apple Foundation Model is only available on iOS devices with Apple Intelligence enabled. Current platform: ${Platform.OS}. Please use an iOS device to access the Apple Foundation Model.`
        };
      }
      
      const assistantMessage = {
        id: generateUUID(),
        role: 'assistant' as const,
        content: result.text,
        parts: [{ type: 'text' as const, text: result.text }],
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: generateUUID(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error while processing your message. Please ensure you\'re using an iOS device with Apple Intelligence enabled.',
        parts: [{ type: 'text' as const, text: 'Sorry, I encountered an error while processing your message. Please ensure you\'re using an iOS device with Apple Intelligence enabled.' }],
        createdAt: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Scroll to end after message is added
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, []);



  const handleNewChat = useCallback(() => {
    // Clear images, messages and generate new chat ID
    clearImageUris();
    setMessages([]);
    const newChatId = generateUUID();
    setChatId({ id: newChatId, from: "newChat" });
    inputRef.current?.focus();
    setBottomChatHeightHandler(false);
  }, [clearImageUris, setBottomChatHeightHandler, setChatId]);

  const handleTextChange = (text: string) => {
    setInput(text);
  };

  const handleSubmit = () => {
    if (input.trim()) {
      sendMessage({ text: input }); // AI SDK v5 format <mcreference link="https://v5.ai-sdk.dev/docs/ai-sdk-ui/chatbot" index="3">3</mcreference>
      setInput("");
    }
  };

  // Create a compatible sendMessage function for SuggestedActions
  const sendMessageForActions = useCallback(async (message: any, options?: any) => {
    let text = '';
    if (typeof message === 'string') {
      text = message;
    } else if (message.content) {
      text = message.content;
    } else if (message.text) {
      text = message.text;
    }
    
    if (text.trim()) {
      await sendMessage({ text });
    }
  }, [sendMessage]);

  const { bottom } = useSafeAreaInsets();
  const scrollViewRef = useRef<GHScrollView>(null);



  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      className="flex-1 bg-white dark:bg-black"
      style={{ paddingBottom: bottom }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "hey",

          headerRight: () => (
            <Pressable disabled={!messages.length} onPress={handleNewChat}>
              <MessageCirclePlusIcon
                size={20}
                color={!messages.length ? "#eee" : "black"}
              />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        className="container relative mx-auto flex-1 bg-white dark:bg-black"
        ref={scrollViewRef}
      >
        <ChatInterface
          messages={messages}
          scrollViewRef={scrollViewRef}
          isLoading={isLoading}
        />
      </ScrollView>

      {messages.length === 0 && (
        <SuggestedActions hasInput={input.length > 0} sendMessage={sendMessageForActions} />
      )}

      <ChatInput
        ref={inputRef}
        scrollViewRef={scrollViewRef}
        input={input}
        onChangeText={handleTextChange}
        focusOnMount={false}
        onSubmit={() => {
          setBottomChatHeightHandler(true);
          handleSubmit();
          clearImageUris();
        }}
      />
    </Animated.View>
  );
};

export default HomePage;
