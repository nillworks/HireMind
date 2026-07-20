"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage, getChatHistory, clearChatHistory, type ChatMessage } from "@/lib/api/ai";
import { ArrowLeft, Send, Bot, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useSession } from "@/lib/auth-client";

const SUGGESTED_PROMPTS = [
  "What jobs match my skills?",
  "How can I improve my resume?",
  "Tips for interview preparation",
  "What salary should I expect for a software engineer?",
  "How do I negotiate a job offer?",
  "What skills should I learn to advance my career?",
];

export default function CareerCoachPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChatHistory()
      .then((history) => {
        const sorted = history.sort(
          (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
        );
        setMessages(sorted);
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || streaming) return;

    setInput("");
    const userMsg: ChatMessage = { role: "user", text: messageText };
    const modelMsg: ChatMessage = { role: "model", text: "" };
    setMessages((prev) => [...prev, userMsg, modelMsg]);
    setStreaming(true);

    const existingMessages = [...messages, userMsg];
    await sendChatMessage(
      messageText,
      null,
      (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "model") {
            updated[updated.length - 1] = { ...last, text: last.text + chunk };
          }
          return updated;
        });
      },
      () => setStreaming(false),
      (err) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "model") {
            updated[updated.length - 1] = { ...last, text: `Error: ${err.message}` };
          }
          return updated;
        });
        setStreaming(false);
      },
    );
  };

  const handleClear = async () => {
    try {
      await clearChatHistory();
      setMessages([]);
    } catch {
      // ignore
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/seeker" className="p-2 rounded-xl hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors">
            <ArrowLeft size={20} className="text-TextSecondary" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white flex items-center gap-2">
              <Bot size={24} className="text-SrcPrimaryColor" />
              Career Coach
            </h1>
            <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mt-0.5">
              Your AI-powered career advisor
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium font-SecondaryFont text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <Trash2 size={14} />
            Clear Chat
          </button>
        )}
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin"
      >
        {loadingHistory && (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin text-TextMuted" />
          </div>
        )}

        {!loadingHistory && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Bot size={48} className="text-TextMuted mb-3" />
            <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-white mb-1">
              How can I help you today?
            </h3>
            <p className="text-xs font-SecondaryFont text-TextSecondary mb-6 max-w-md">
              Ask me anything about your career, resume, interview prep, salary expectations, and more!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={streaming}
                  className="text-left px-4 py-2.5 rounded-xl bg-BorderLight dark:bg-secondary/15 hover:bg-Border dark:hover:bg-secondary/30 text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "model" && (
              <div className="size-8 rounded-xl bg-gradient-to-br from-SrcPrimaryColor to-PrimaryColor flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm font-SecondaryFont leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white"
                  : "bg-gray-50 dark:bg-[#0B1120] border border-Border dark:border-secondary/40 text-TextPrimary dark:text-white"
              }`}
            >
              {msg.role === "model" && !msg.text && (
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-PrimaryColor animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="size-1.5 rounded-full bg-PrimaryColor animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="size-1.5 rounded-full bg-PrimaryColor animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              )}
              {msg.text && msg.role === "model" ? (
                <ReactMarkdown
                  components={{
                    strong: ({ children }) => <strong className="font-semibold text-TextPrimary dark:text-white">{children}</strong>,
                    h3: ({ children }) => <h3 className="text-base font-semibold text-TextPrimary dark:text-white mt-3 mb-1">{children}</h3>,
                    hr: () => <hr className="my-2 border-Border dark:border-secondary/40" />,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 my-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 my-1">{children}</ol>,
                    li: ({ children }) => <li className="text-sm text-TextPrimary dark:text-white/90">{children}</li>,
                    p: ({ children }) => <p className="text-sm leading-relaxed text-TextPrimary dark:text-white/90 mb-1 last:mb-0">{children}</p>,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : msg.text}
            </div>
            {msg.role === "user" && (
              session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "You"}
                  className="size-8 rounded-xl object-cover shrink-0 mt-0.5"
                />
              ) : (
                <div className="size-8 rounded-xl bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-white">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              )
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 shrink-0 bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary/40 p-2 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your career question..."
          disabled={streaming}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || streaming}
          className="size-9 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor flex items-center justify-center text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
