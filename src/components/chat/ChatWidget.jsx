import { useChatStore } from "../../store/chatStore";
import ChatWindow from "./ChatWindow";
import { MessageCircle, X } from "lucide-react";

export default function ChatWidget() {
  const { isOpen, openChat, closeChat } = useChatStore();

  return (
    <>
      {/* Chat window — slides in from bottom right */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-stone-200">
          <ChatWindow onClose={closeChat} />
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={isOpen ? closeChat : openChat}
        className="fixed bottom-4 right-4 bg-stone-900 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 hover:bg-stone-700 transition-all duration-200 hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
