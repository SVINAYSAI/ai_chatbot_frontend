import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="border-t border-stone-200 px-3 py-2 bg-white flex items-end gap-2">
      <textarea
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type a message..."
        className="flex-1 resize-none rounded-xl border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 disabled:opacity-50 min-h-[40px] max-h-[120px]"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
        className="bg-stone-900 text-white rounded-xl p-2 hover:bg-stone-700 disabled:opacity-40 transition"
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
