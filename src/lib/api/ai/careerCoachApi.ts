import fetchClient from "@/lib/utils/fetchClient";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  _id?: string;
  createdAt?: string;
}

export async function sendChatMessage(
  message: string,
  conversationId: string | null,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const tokenRes = await fetch("/api/auth/token", { credentials: "include" });
  const { token } = await tokenRes.json();

  try {
    const res = await fetch(`${apiUrl}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ message, conversationId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Failed to send message");
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response stream");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) {
              onError(new Error(data.error));
              return;
            }
            if (data.done) {
              onDone();
              return;
            }
            if (data.text) {
              onChunk(data.text);
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error("Chat failed"));
  }
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  const res = await fetchClient<{ success: boolean; data: ChatMessage[] }>(
    "/api/ai/chat/history",
  );
  return res.data ?? [];
}

export async function clearChatHistory(): Promise<void> {
  await fetchClient("/api/ai/chat/history", { method: "DELETE" });
}
