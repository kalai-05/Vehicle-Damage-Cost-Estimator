import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CHAT_ICON_SIZE = 60;
const CHAT_BOX_WIDTH = 300;
const CHAT_BOX_HEIGHT = 400;
const TAB_BAR_HEIGHT = 50; // Adjust this based on your tab bar height

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    x: SCREEN_WIDTH - CHAT_ICON_SIZE - 20,
    y: SCREEN_HEIGHT - CHAT_ICON_SIZE - TAB_BAR_HEIGHT - 20,
  });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();
  const chatBoxRef = useRef();

  // Add initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Hello! How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ]);

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let newX = event.nativeEvent.absoluteX - CHAT_ICON_SIZE / 2;
      let newY = event.nativeEvent.absoluteY - CHAT_ICON_SIZE / 2;

      // Boundary checks
      newX = Math.max(10, Math.min(newX, SCREEN_WIDTH - CHAT_ICON_SIZE - 10));
      newY = Math.max(
        10,
        Math.min(newY, SCREEN_HEIGHT - CHAT_ICON_SIZE - TAB_BAR_HEIGHT - 10)
      );

      const snapThreshold = SCREEN_WIDTH / 2;
      const snapX =
        newX < snapThreshold ? 20 : SCREEN_WIDTH - CHAT_ICON_SIZE - 20;

      setPosition({ x: snapX, y: newY });
    }
  };

  const onGestureEvent = (event) => {
    const newX = event.nativeEvent.absoluteX - CHAT_ICON_SIZE / 2;
    const newY = event.nativeEvent.absoluteY - CHAT_ICON_SIZE / 2;

    // Prevent going out of bounds while dragging
    const boundedX = Math.max(
      10,
      Math.min(newX, SCREEN_WIDTH - CHAT_ICON_SIZE - 10)
    );
    const boundedY = Math.max(
      10,
      Math.min(newY, SCREEN_HEIGHT - CHAT_ICON_SIZE - TAB_BAR_HEIGHT - 10)
    );

    setPosition({
      x: boundedX,
      y: boundedY,
    });
  };

  const toggleChat = () => {
    if (isOpen) {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -20,
          duration: 300,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      scrollViewRef.current?.scrollToEnd({ animated: true });

      const response = await fetch("http://192.168.234.70:4000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
        }),
      });

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        text: data.response || "I couldn't understand that. Can you rephrase?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting to the server.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // Calculate chat box position based on keyboard visibility
  const getChatBoxPosition = () => {
    if (keyboardHeight > 0) {
      // When keyboard is open, position chat box above keyboard
      const availableHeight = SCREEN_HEIGHT - keyboardHeight - 20;
      const chatBoxTop = Math.min(
        availableHeight - CHAT_BOX_HEIGHT,
        SCREEN_HEIGHT * 0.1
      );
      return { top: chatBoxTop };
    }
    // Default position when keyboard is closed
    return { top: "20%" };
  };

  return (
    <>
      {/* Chat Box */}
      <Animated.View
        ref={chatBoxRef}
        style={[
          styles.chatContainer,
          {
            opacity: opacityAnim,
            transform: [{ translateY }],
            ...getChatBoxPosition(),
          },
          isOpen ? styles.chatOpen : styles.chatClosed,
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Chat Assistant</Text>
            <TouchableOpacity onPress={toggleChat}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.chatBody}
            contentContainerStyle={styles.chatContent}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
            keyboardDismissMode="on-drag"
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.sender === "user"
                    ? styles.userMessage
                    : styles.botMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === "user"
                      ? styles.userMessageText
                      : styles.botMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View style={[styles.messageBubble, styles.botMessage]}>
                <ActivityIndicator size="small" color="#001f3d" />
              </View>
            )}
          </ScrollView>

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type your message..."
              placeholderTextColor="#aaa"
              value={inputMessage}
              onChangeText={setInputMessage}
              onSubmitEditing={sendMessage}
              enablesReturnKeyAutomatically={true}
              blurOnSubmit={false}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>

      {/* Floating Chat Icon */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.chatIcon,
            {
              left: position.x,
              top: position.y,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity onPress={toggleChat} activeOpacity={0.7}>
            <Animated.View style={styles.iconContainer}>
              <Ionicons
                name={isOpen ? "close" : "chatbubble-ellipses"}
                size={28}
                color="#fff"
              />
              {!isOpen &&
                messages.filter((m) => m.sender === "bot" && !m.read).length >
                  0 && (
                  <Animated.View
                    style={[styles.notificationBadge, { opacity: opacityAnim }]}
                  >
                    <Text style={styles.badgeText}>
                      {
                        messages.filter((m) => m.sender === "bot" && !m.read)
                          .length
                      }
                    </Text>
                  </Animated.View>
                )}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  chatIcon: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#001f3d",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  iconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#ff6b6b",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  chatContainer: {
    position: "absolute",
    width: 300,
    height: 400,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
    zIndex: 99,
    alignSelf: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatOpen: {
    display: "flex",
  },
  chatClosed: {
    display: "none",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#001f3d",
  },
  chatTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatBody: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  chatContent: {
    padding: 16,
    paddingBottom: 80, // Extra space at bottom
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#001f3d",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  botMessageText: {
    color: "#333",
  },
  userMessageText: {
    color: "#fff",
  },
  chatInputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  chatInput: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginRight: 10,
    color: "#333",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#001f3d",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatBot;
