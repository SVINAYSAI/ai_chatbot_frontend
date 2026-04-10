export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
          ${isUser
            ? "bg-stone-900 text-white rounded-br-sm"
            : "bg-white text-stone-800 shadow-sm rounded-bl-sm border border-stone-100"
          }`}
      >
        {content}
      </div>
    </div>
  );
}
