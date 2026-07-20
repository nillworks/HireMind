"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { sendChatMessage } from "@/lib/api/ai";
import { MessageCircle, X, Send, Bot, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface ChatMsg {
  role: "user" | "model";
  text: string;
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const { data: session, isPending } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && session && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, session]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    const userMsg: ChatMsg = { role: "user", text };
    const modelMsg: ChatMsg = { role: "model", text: "" };
    setMessages((prev) => [...prev, userMsg, modelMsg]);
    setStreaming(true);

    const existingMessages = [...messages, userMsg];
    await sendChatMessage(
      text,
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isPending) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-Border dark:border-secondary/40 bg-white dark:bg-[#0f172a] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-Border dark:border-secondary/40 bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="text-sm font-semibold">Career Coach</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3" style={{ maxHeight: 400 }}>
            {!session ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Bot size={40} className="text-TextMuted mb-3" />
                <p className="text-sm font-medium text-TextPrimary dark:text-white mb-1">
                  Login to use Career Coach
                </p>
                <p className="text-xs text-TextSecondary dark:text-text-secondary mb-4">
                  Ask questions about jobs, resumes, interviews, and more!
                </p>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white hover:opacity-90 transition-opacity"
                >
                  <LogIn size={14} />
                  Login Now
                </Link>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-6">
                <Bot size={36} className="text-TextMuted mb-2" />
                <p className="text-sm font-medium text-TextPrimary dark:text-white mb-1">
                  Ask me anything!
                </p>
                <p className="text-xs text-TextSecondary dark:text-text-secondary max-w-[200px]">
                  Career advice, resume tips, interview prep, salary info, and more.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "model" && (
                    <div className="size-7 rounded-lg bg-gradient-to-br from-SrcPrimaryColor to-PrimaryColor flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white"
                        : "bg-gray-50 dark:bg-[#0B1120] border border-Border dark:border-secondary/40 text-TextPrimary dark:text-white"
                    }`}
                  >
                    {msg.role === "model" && !msg.text ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-PrimaryColor animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="size-1.5 rounded-full bg-PrimaryColor animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="size-1.5 rounded-full bg-PrimaryColor animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    ) : msg.role === "model" ? (
                      <ReactMarkdown
                        components={{
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside my-0.5">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside my-0.5">{children}</ol>,
                          li: ({ children }) => <li className="my-0.5">{children}</li>,
                          hr: () => <hr className="my-1 border-Border dark:border-secondary/40" />,
                          h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-0.5">{children}</h3>,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                  {msg.role === "user" && (
                    session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "You"}
                        className="size-7 rounded-lg object-cover shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="size-7 rounded-lg bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-white">
                          {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {session && (
            <div className="border-t border-Border dark:border-secondary/40 p-2 flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                disabled={streaming}
                className="flex-1 bg-transparent px-2 py-1.5 text-xs text-TextPrimary dark:text-white placeholder:text-TextMuted focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || streaming}
                className="size-7 rounded-lg bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor flex items-center justify-center text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
              >
                <Send size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
