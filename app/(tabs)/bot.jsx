import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = "https://api.aimlapi.com/v1";
  const API_KEY = "7bca81681f44441f837044c65bdb740c";
  const SYSTEM_PROMPT = "I am a healthcare chatbot specializing in answering medication-related queries. Provide accurate, concise, and helpful information about medications, side effects, and dosages.";
  const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2";

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        _id: 1,
        text: "Hi! I'm here to assist you with medication-related questions. How can I help?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Assistant",
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages = []) => {
    const userMessage = newMessages[0];
    setMessages((previousMessages) => GiftedChat.append(previousMessages, userMessage));

    setIsLoading(true);

    try {
      const payload = {
        model: MODEL_ID,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage.text },
        ],
        temperature: 0.7,
        max_tokens: 256,
      };

      const response = await axios.post(
        `${BASE_URL}/chat/completions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const assistantMessage = response.data?.choices[0]?.message?.content || "Sorry, I couldn't process that.";

      const botMessage = {
        _id: Math.random().toString(36).substr(2, 9),
        text: assistantMessage,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Assistant",
        },
      };

      setMessages((previousMessages) => GiftedChat.append(previousMessages, botMessage));
    } catch (error) {
      console.error("Error fetching AI response:", error.response?.data || error.message);
      const errorMessage = {
        _id: Math.random().toString(36).substr(2, 9),
        text: "Oops! Something went wrong. Please try again.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Assistant",
        },
      };
      setMessages((previousMessages) => GiftedChat.append(previousMessages, errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderFooter={() => (isLoading ? <ActivityIndicator size="small" color="#3b82f6" /> : null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default App;
