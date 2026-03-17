import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  nanoToDate,
  useAddReaction,
  useGetAllMessages,
  useRemoveReaction,
  useSendMessage,
} from "../hooks/useQueries";

const REACTION_EMOJIS = ["❤️", "😂", "😮", "😢", "👏", "🔥"];

const MY_REACTIONS_KEY = "twoverse_my_reactions";

function getMyReactions(): Set<string> {
  try {
    const raw = localStorage.getItem(MY_REACTIONS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveMyReactions(set: Set<string>) {
  localStorage.setItem(MY_REACTIONS_KEY, JSON.stringify([...set]));
}

function reactionKey(msgId: bigint, emoji: string) {
  return `${msgId.toString()}_${emoji}`;
}

const SPARKLE_SYMBOLS = ["✨", "💕", "💫", "🩷"];
const SPARKLE_PARTICLES = [
  { angle: 0, dist: 38, sym: SPARKLE_SYMBOLS[0] },
  { angle: 30, dist: 42, sym: SPARKLE_SYMBOLS[1] },
  { angle: 60, dist: 35, sym: SPARKLE_SYMBOLS[2] },
  { angle: 90, dist: 44, sym: SPARKLE_SYMBOLS[3] },
  { angle: 120, dist: 40, sym: SPARKLE_SYMBOLS[0] },
  { angle: 150, dist: 36, sym: SPARKLE_SYMBOLS[1] },
  { angle: 180, dist: 42, sym: SPARKLE_SYMBOLS[2] },
  { angle: 210, dist: 38, sym: SPARKLE_SYMBOLS[3] },
  { angle: 240, dist: 45, sym: SPARKLE_SYMBOLS[0] },
  { angle: 270, dist: 36, sym: SPARKLE_SYMBOLS[1] },
  { angle: 300, dist: 43, sym: SPARKLE_SYMBOLS[2] },
  { angle: 330, dist: 40, sym: SPARKLE_SYMBOLS[3] },
];

export default function Chat() {
  const [displayName, setDisplayName] = useState<string>(
    () => localStorage.getItem("twoverse_display_name") || "",
  );
  const [pendingName, setPendingName] = useState("");
  const [nameDialogOpen, setNameDialogOpen] = useState(!displayName);
  const [message, setMessage] = useState("");
  const [pickerForMessage, setPickerForMessage] = useState<bigint | null>(null);
  const [myReactions, setMyReactionsState] =
    useState<Set<string>>(getMyReactions);
  const [showSparkle, setShowSparkle] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useGetAllMessages();
  const sendMessage = useSendMessage();
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSaveName = () => {
    if (!pendingName.trim()) return;
    const name = pendingName.trim();
    setDisplayName(name);
    localStorage.setItem("twoverse_display_name", name);
    setNameDialogOpen(false);
  };

  const handleSend = () => {
    const content = message.trim();
    if (!content || !displayName) return;
    sendMessage.mutate(
      { senderName: displayName, content },
      {
        onSuccess: () => {
          setMessage("");
          setShowSparkle(true);
          setTimeout(() => setShowSparkle(false), 700);
        },
        onError: () => toast.error("Couldn't send message"),
      },
    );
  };

  const handleReaction = (msgId: bigint, emoji: string) => {
    const key = reactionKey(msgId, emoji);
    const newSet = new Set(myReactions);
    if (newSet.has(key)) {
      removeReaction.mutate(
        { messageId: msgId, emoji },
        { onError: () => toast.error("Couldn't remove reaction") },
      );
      newSet.delete(key);
    } else {
      addReaction.mutate(
        { messageId: msgId, emoji },
        { onError: () => toast.error("Couldn't add reaction") },
      );
      newSet.add(key);
    }
    setMyReactionsState(newSet);
    saveMyReactions(newSet);
    setPickerForMessage(null);
  };

  const formatTime = (ts: bigint) => {
    return nanoToDate(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative z-10 flex flex-col h-[calc(100dvh-80px)]">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-4 border-b"
        style={{
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.15)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="font-display text-xl font-bold"
              style={{ color: "rgba(255,255,255,0.97)" }}
            >
              Our Chat 💬
            </h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
              {displayName
                ? `Chatting as ${displayName}`
                : "Set your name to chat"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNameDialogOpen(true)}
            className="text-xs font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {displayName ? "Change name" : "Set name"}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading && (
          <div data-ocid="chat.loading_state" className="text-center py-8">
            <div
              className="text-sm animate-pulse"
              style={{ color: "rgba(255,255,255,0.60)" }}
            >
              Loading messages... 💕
            </div>
          </div>
        )}
        {!isLoading && messages.length === 0 && (
          <div data-ocid="chat.empty_state" className="text-center py-16">
            <div className="text-4xl mb-3">💌</div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              No messages yet.
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              Send the first one!
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMine = msg.senderName === displayName;
            const isPickerOpen = pickerForMessage === msg.id;
            return (
              <motion.div
                key={msg.id.toString()}
                data-ocid={`chat.item.${idx + 1}`}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col ${
                  isMine ? "items-end" : "items-start"
                } gap-1`}
              >
                <span
                  className="text-[11px] px-1 font-medium"
                  style={{ color: "rgba(255,255,255,0.60)" }}
                >
                  {msg.senderName}
                </span>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setPickerForMessage(isPickerOpen ? null : msg.id)
                    }
                    className="rounded-3xl px-4 py-2.5 max-w-[260px] text-left shadow-xs transition-all"
                    style={
                      isMine
                        ? {
                            background: "rgba(255,255,255,0.30)",
                            backdropFilter: "blur(8px)",
                            borderRadius: "18px 18px 4px 18px",
                          }
                        : {
                            background: "rgba(0,0,0,0.25)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: "18px 18px 18px 4px",
                          }
                    }
                  >
                    <p
                      className="text-sm leading-relaxed break-words"
                      style={{ color: "rgba(255,255,255,0.95)" }}
                    >
                      {msg.content}
                    </p>
                    <p
                      className="text-[10px] mt-1"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </button>

                  <AnimatePresence>
                    {isPickerOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 4 }}
                        className={`absolute z-20 bottom-full mb-2 rounded-2xl shadow-card-hover px-3 py-2 flex gap-1 ${
                          isMine ? "right-0" : "left-0"
                        }`}
                        style={{
                          background: "rgba(0,0,0,0.50)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      >
                        {REACTION_EMOJIS.map((emoji) => {
                          const key = reactionKey(msg.id, emoji);
                          const mine = myReactions.has(key);
                          return (
                            <button
                              type="button"
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className="text-xl p-1 rounded-xl transition-all hover:scale-125"
                              style={{
                                background: mine
                                  ? "rgba(255,255,255,0.20)"
                                  : "transparent",
                              }}
                            >
                              {emoji}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 px-1">
                    {msg.reactions.map((r) => {
                      const key = reactionKey(msg.id, r.emoji);
                      const mine = myReactions.has(key);
                      return (
                        <button
                          type="button"
                          key={r.emoji}
                          onClick={() => handleReaction(msg.id, r.emoji)}
                          className="text-xs rounded-full px-2 py-0.5 border transition-all"
                          style={{
                            background: mine
                              ? "rgba(255,255,255,0.20)"
                              : "rgba(0,0,0,0.20)",
                            borderColor: mine
                              ? "rgba(255,255,255,0.40)"
                              : "rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.90)",
                          }}
                        >
                          {r.emoji} {Number(r.count)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 border-t"
        style={{
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.15)",
        }}
      >
        <div className="flex gap-2 relative">
          <Input
            data-ocid="chat.input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message... 💕"
            className="flex-1 rounded-2xl text-sm"
            style={{
              background: "rgba(255,255,255,0.15)",
              borderColor: "rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.95)",
            }}
            disabled={!displayName || sendMessage.isPending}
          />
          <div className="relative">
            <Button
              data-ocid="chat.send_button"
              size="icon"
              onClick={handleSend}
              disabled={
                !message.trim() || !displayName || sendMessage.isPending
              }
              className="rounded-2xl shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
            {/* Sparkle burst on send */}
            <AnimatePresence>
              {showSparkle &&
                SPARKLE_PARTICLES.map((p) => {
                  const rad = (p.angle * Math.PI) / 180;
                  const tx = Math.cos(rad) * p.dist;
                  const ty = Math.sin(rad) * p.dist;
                  return (
                    <motion.span
                      key={p.angle}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      animate={{ opacity: 0, x: tx, y: ty, scale: 0.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        fontSize: "12px",
                        pointerEvents: "none",
                        zIndex: 50,
                        lineHeight: 1,
                      }}
                    >
                      {p.sym}
                    </motion.span>
                  );
                })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent className="max-w-[320px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              What's your name? 💕
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              placeholder="Your name..."
              className="rounded-2xl"
              autoFocus
            />
            <Button
              onClick={handleSaveName}
              disabled={!pendingName.trim()}
              className="w-full rounded-2xl"
            >
              Let's chat! 💬
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
