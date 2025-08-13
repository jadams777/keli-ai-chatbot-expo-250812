import { View, ScrollView, ActivityIndicator } from "react-native";

// import Markdown from "react-native-markdown-display";
import { CustomMarkdown } from "@/components/ui/markdown";
import { useKeyboard } from "@react-native-community/hooks";
import { Text } from "@/components/ui/text";
import WeatherCard from "@/components/weather";
import { WelcomeMessage } from "@/components/welcome-message";
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LottieLoader } from "@/components/lottie-loader";
import type { UIMessage } from "@ai-sdk/react";

type ChatInterfaceProps = {
  messages: UIMessage[];
  scrollViewRef: React.RefObject<ScrollView>;
  isLoading?: boolean;
};

// Helper function to get content from UIMessage parts array <mcreference link="https://v5.ai-sdk.dev/docs/migration-guides/migration-guide-5-0" index="1">1</mcreference>
const getMessageContent = (message: UIMessage): string => {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('');
};

// Helper function to get tool calls from UIMessage parts <mcreference link="https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage" index="2">2</mcreference>
const getToolCalls = (message: UIMessage) => {
  return message.parts.filter(part => part.type === 'tool-call');
};

// Helper function to get tool results from UIMessage parts
const getToolResults = (message: UIMessage) => {
  return message.parts.filter(part => part.type === 'tool-result');
};

export const ChatInterface = forwardRef<ScrollView, ChatInterfaceProps>(
  ({ messages, scrollViewRef, isLoading }, ref) => {
    const { keyboardShown, keyboardHeight } = useKeyboard();

    return (
      <View className="flex-1">
        <ScrollView ref={ref} className="flex-1 space-y-4 p-4">
          {!messages.length && <WelcomeMessage />}
          {messages.length > 0
            ? messages.map((m, index) => (
                <React.Fragment key={m.id}>
                  {/* Render tool calls (loading state) */}
                  {getToolCalls(m).map((toolCall: any) => {
                    if (toolCall.toolName === "getWeather") {
                      return (
                        <View
                          key={toolCall.toolCallId}
                          className={cn(
                            "mt-4 max-w-[85%] rounded-2xl bg-muted/50 p-4",
                          )}
                        >
                          <ActivityIndicator size="small" color="black" />
                          <Text>Getting weather data...</Text>
                        </View>
                      );
                    }
                    return null;
                  }).filter(Boolean)}
                  
                  {/* Render tool results */}
                  {getToolResults(m).map((toolResult: any) => {
                    if (toolResult.toolName === "getWeather" && toolResult.result) {
                      return (
                        <WeatherCard
                          key={toolResult.toolCallId}
                          city={toolResult.result.city || "Unknown"}
                          temperature={toolResult.result.current?.temperature_2m || 0}
                          weatherCode={toolResult.result.current?.weathercode || "0"}
                          humidity={toolResult.result.current?.relative_humidity_2m || 0}
                          wind={toolResult.result.current?.wind_speed_10m || 0}
                        />
                      );
                    }
                    return null;
                  }).filter(Boolean)}

                  <View
                    className={`flex-row px-4 ${m.role === "user" ? "ml-auto max-w-[85%]" : "max-w-[95%] pl-0"} rounded-3xl ${m.role === "user" ? "bg-muted/50" : ""} `}
                  >
                    {getMessageContent(m).length > 0 && (
                      <>
                        <View
                          className={
                            m.role === "user"
                              ? ""
                              : "mr-2 mt-1 h-8 w-8 items-center justify-center rounded-full bg-gray-200"
                          }
                        >
                          <Text className="text-base">
                            {m.role === "user" ? "" : "🤖"}
                          </Text>
                        </View>
                        <CustomMarkdown content={getMessageContent(m)} />
                      </>
                    )}
                  </View>
                  {isLoading &&
                    messages[messages.length - 1].role === "user" &&
                    m === messages[messages.length - 1] && (
                      <View className="flex-row">
                        <View
                          className={
                            "mr-2 mt-1 h-8 w-8 items-center justify-center rounded-full bg-gray-200"
                          }
                        >
                          <Text className="text-base">{"🤖"}</Text>
                        </View>
                        <View className="-ml-2 -mt-[1px]">
                          <LottieLoader width={40} height={40} />
                        </View>
                      </View>
                    )}
                </React.Fragment>
              ))
            : null}
        </ScrollView>
      </View>
    );
  },
);
