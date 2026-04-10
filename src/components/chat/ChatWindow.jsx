import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/chatStore";
import { sendMessage } from "../../api/chatApi";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import toast from "react-hot-toast";

export default function ChatWindow({ onClose }) {
  const { messages, sessionToken, isLoading, addMessage, setLoading, setSessionToken } = useChatStore();
  const bottomRef = useRef(null);

  // Greet user on first open
  useEffect(() => {
    if (messages.length === 0) {
      const restaurantName = import.meta.env.VITE_RESTAURANT_NAME || "our restaurant";
      addMessage("assistant", `Hi there! 👋 Welcome to ${restaurantName}. I can help you book a table, cancel a reservation, or answer any questions. What would you like to do today?`);
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return;

    addMessage("user", text);
    setLoading(true);

    try {
      const res = await sendMessage(sessionToken, text);
      const { session_token, reply, action_taken, booking_ref } = res.data;

      // Save session token for conversation continuity
      if (!sessionToken) setSessionToken(session_token);

      addMessage("assistant", reply);

      // Navigate to confirmation page if booking was made
      if (action_taken === "booked" && booking_ref) {
        toast.success(`Booking confirmed! Reference: ${booking_ref}`);
        setTimeout(() => {
          window.location.href = `/booking/confirm/${booking_ref}`;
        }, 2000);
      }
    } catch (err) {
      console.error("Chat error:", err);
      addMessage("assistant", "Sorry, I ran into an issue. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-stone-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-medium">Table Booking Assistant</span>
        </div>
        <button 
          onClick={onClose} 
          className="text-stone-400 hover:text-white transition"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-stone-50 chat-scrollbar">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
