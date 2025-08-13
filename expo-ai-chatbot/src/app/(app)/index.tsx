import { generateUUID } from "@/lib/utils";
import { Redirect, Stack, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, type TextInput, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetch } from "expo/fetch";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
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

  // Local state for input management (AI SDK v5 no longer provides input state)
  const [input, setInput] = useState("");

  const {
    messages,
    status,
    sendMessage,
  } = useChat({
    id: chatId?.id,
    transport: new DefaultChatTransport({
      api: `${process.env.EXPO_PUBLIC_API_URL}/api/chat-open`,
      body: {
        modelId: "gpt-4o-mini",
      },
      fetch: (url: string, options: RequestInit) => {
        return fetch(url, {
          ...options,
          signal: options.signal,
          headers: {
            ...options.headers,
            "Content-Type": "application/json",
          },
        }).catch((error) => {
          console.error("Fetch error:", error);
          throw error;
        });
      },
    }),
    onFinish: () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    },
    onError(error) {
      console.log(">> error is", error.message);
    },
  });

  // Create isLoading state from status <mcreference link="https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat" index="2">2</mcreference>
  const isLoading = status === 'submitted' || status === 'streaming';



  const handleNewChat = useCallback(() => {
    // Clear images and generate new chat ID
    clearImageUris();
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
  const sendMessageForActions = async (message: any, options?: any) => {
    if (typeof message === 'string') {
      return sendMessage({ text: message });
    }
    if (message.content) {
      return sendMessage({ text: message.content });
    }
    return sendMessage({ text: message.text || '' });
  };

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
