
"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages: Msg[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      setMessages([...newMessages, { role: "assistant", content: data.text ?? "" }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Something went wrong. Check your server logs and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 16px",
        background: "#0b0f19",
        color: "#e8eefc",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Title */}
        <header style={{ marginBottom: 18 }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Agent for letters counting (with ollama!!!)
          </h1>
          <p style={{ marginTop: 10, marginBottom: 0, color: "#b8c3df" }}>
            This uses a Local model and tool calling. Try: <b>“How many r’s are in strawberry?”</b>
          </p>
        </header>

        {/* Chat box */}
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Messages */}
          <div style={{ padding: 16, maxHeight: "62vh", overflowY: "auto" }}>
            {messages.length === 0 ? (
              <div
                style={{
                  padding: 16,
                  borderRadius: 14,
                  border: "1px dashed rgba(255,255,255,0.18)",
                  color: "#b8c3df",
                }}
              >
                Ask something to start the conversation.
              </div>
            ) : (
              messages.map((m, i) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      marginBottom: 12, // space between messages
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "78%",
                        padding: "12px 14px",
                        borderRadius: 16,
                        lineHeight: 1.45,
                        whiteSpace: "pre-wrap",
                        background: isUser ? "rgba(99,102,241,0.20)" : "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: "0.03em",
                          textTransform: "uppercase",
                          color: isUser ? "#cdd3ff" : "#cfe9ff",
                          marginBottom: 6,
                        }}
                      >
                        {isUser ? "You" : "Assistant"}
                      </div>
                      <div style={{ fontSize: 15 }}>{m.content}</div>
                    </div>
                  </div>
                );
              })
            )}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "12px 14px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#b8c3df",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
                    Assistant
                  </div>
                  Thinking…
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            style={{
              display: "flex",
              gap: 10,
              padding: 12,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.18)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              style={{
                flex: 1,
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                color: "#e8eefc",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: loading ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.25)",
                color: "#e8eefc",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
              }}
            >
              {loading ? "…" : "Send"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
