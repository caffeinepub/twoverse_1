import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  nanoToDate,
  useAddLoveLetter,
  useDeleteLoveLetter,
  useGetAllLoveLetters,
} from "../hooks/useQueries";

interface LoveLettersProps {
  onBack: () => void;
}

const CARD_STYLE = {
  background: "rgba(255,255,255,0.14)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  borderColor: "rgba(255,255,255,0.22)",
};

export default function LoveLetters({ onBack }: LoveLettersProps) {
  const { data: letters = [], isLoading } = useGetAllLoveLetters();
  const addLetter = useAddLoveLetter();
  const deleteLetter = useDeleteLoveLetter();

  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expandedId, setExpandedId] = useState<bigint | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);

  const handleSubmit = () => {
    if (!authorName.trim() || !title.trim() || !content.trim()) {
      toast.error("Please fill in all fields 💌");
      return;
    }
    addLetter.mutate(
      {
        title: title.trim(),
        authorName: authorName.trim(),
        content: content.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Letter sent with love 💌");
          setAuthorName("");
          setTitle("");
          setContent("");
        },
        onError: () => toast.error("Couldn't save your letter"),
      },
    );
  };

  const handleDelete = (id: bigint) => {
    deleteLetter.mutate(id, {
      onSuccess: () => {
        toast.success("Letter removed");
        setConfirmDeleteId(null);
        if (expandedId === id) setExpandedId(null);
      },
      onError: () => toast.error("Couldn't delete letter"),
    });
  };

  const sortedLetters = [...letters].sort((a, b) =>
    Number(b.createdAt - a.createdAt),
  );

  return (
    <div className="relative z-10 px-4 pt-8 pb-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          type="button"
          data-ocid="loveletters.back_button"
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-95"
          style={CARD_STYLE}
        >
          <span style={{ color: "rgba(255,255,255,0.80)" }}>←</span>
        </button>
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "rgba(255,255,255,0.97)" }}
          >
            Love Letters 💌
          </h1>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
            Pour your heart into words
          </p>
        </div>
      </motion.div>

      {/* Write a Letter */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border p-5 space-y-3"
        style={CARD_STYLE}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">✍️</span>
          <h2
            className="font-display text-lg font-semibold"
            style={{ color: "rgba(255,255,255,0.97)" }}
          >
            Write a Letter
          </h2>
        </div>

        <input
          data-ocid="loveletters.author_input"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your name..."
          className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none border"
          style={{
            background: "rgba(255,255,255,0.10)",
            borderColor: "rgba(255,255,255,0.20)",
            color: "rgba(255,255,255,0.92)",
          }}
        />

        <input
          data-ocid="loveletters.title_input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Letter title..."
          className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none border"
          style={{
            background: "rgba(255,255,255,0.10)",
            borderColor: "rgba(255,255,255,0.20)",
            color: "rgba(255,255,255,0.92)",
          }}
        />

        <Textarea
          data-ocid="loveletters.content_textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Dear love, I wanted to tell you..."
          rows={5}
          className="rounded-2xl text-sm resize-none border"
          style={{
            background: "rgba(255,255,255,0.10)",
            borderColor: "rgba(255,255,255,0.20)",
            color: "rgba(255,255,255,0.92)",
          }}
        />

        <Button
          data-ocid="loveletters.submit_button"
          onClick={handleSubmit}
          disabled={addLetter.isPending}
          className="w-full rounded-2xl font-semibold py-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,110,140,0.8), rgba(255,80,110,0.9))",
            border: "none",
            color: "#fff",
          }}
        >
          {addLetter.isPending ? "Sending..." : "Send with Love 💌"}
        </Button>
      </motion.div>

      {/* Letters List */}
      <div className="space-y-3">
        <p
          className="text-xs font-semibold uppercase tracking-widest px-1"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {isLoading
            ? "Loading letters..."
            : sortedLetters.length === 0
              ? "No letters yet — write the first one! 💌"
              : `${sortedLetters.length} letter${sortedLetters.length !== 1 ? "s" : ""}`}
        </p>

        <AnimatePresence>
          {sortedLetters.map((letter, idx) => {
            const isExpanded = expandedId === letter.id;
            const isConfirmDelete = confirmDeleteId === letter.id;
            return (
              <motion.div
                key={String(letter.id)}
                data-ocid={`loveletters.item.${idx + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05, duration: 0.35 }}
                className="rounded-3xl border overflow-hidden"
                style={CARD_STYLE}
              >
                {/* Letter header */}
                <div className="px-5 pt-5 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-display text-base font-bold truncate"
                        style={{ color: "rgba(255,255,255,0.97)" }}
                      >
                        {letter.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        From {letter.authorName} ·{" "}
                        {nanoToDate(letter.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        data-ocid={`loveletters.item.${idx + 1}`}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : letter.id)
                        }
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all active:scale-95"
                        style={{
                          borderColor: "rgba(255,255,255,0.30)",
                          color: "rgba(255,255,255,0.80)",
                          background: isExpanded
                            ? "rgba(255,255,255,0.15)"
                            : "rgba(255,255,255,0.06)",
                        }}
                      >
                        {isExpanded ? "Close" : "Read"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-4 pt-4 border-t"
                          style={{ borderColor: "rgba(255,255,255,0.12)" }}
                        >
                          <p
                            className="text-sm leading-relaxed whitespace-pre-wrap font-display"
                            style={{ color: "rgba(255,255,255,0.88)" }}
                          >
                            {letter.content}
                          </p>

                          {/* Delete section */}
                          <div className="mt-4">
                            {isConfirmDelete ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  data-ocid={`loveletters.item.${idx + 1}`}
                                  onClick={() => handleDelete(letter.id)}
                                  className="flex-1 py-2 rounded-2xl text-xs font-semibold transition-all active:scale-95"
                                  style={{
                                    background: "rgba(255,80,80,0.30)",
                                    color: "#FFB3B3",
                                    border: "1px solid rgba(255,80,80,0.40)",
                                  }}
                                >
                                  Yes, delete
                                </button>
                                <button
                                  type="button"
                                  data-ocid={`loveletters.item.${idx + 1}`}
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="flex-1 py-2 rounded-2xl text-xs font-semibold transition-all active:scale-95"
                                  style={{
                                    background: "rgba(255,255,255,0.10)",
                                    color: "rgba(255,255,255,0.70)",
                                    border: "1px solid rgba(255,255,255,0.20)",
                                  }}
                                >
                                  Keep it
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                data-ocid={`loveletters.delete_button.${idx + 1}`}
                                onClick={() => setConfirmDeleteId(letter.id)}
                                className="text-xs px-3 py-1.5 rounded-full border transition-all active:scale-95"
                                style={{
                                  borderColor: "rgba(255,80,80,0.35)",
                                  color: "rgba(255,130,130,0.90)",
                                  background: "rgba(255,80,80,0.10)",
                                }}
                              >
                                🗑 Delete letter
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {sortedLetters.length === 0 && !isLoading && (
          <motion.div
            data-ocid="loveletters.empty_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-4xl mb-3">💌</p>
            <p
              className="font-display text-lg"
              style={{ color: "rgba(255,255,255,0.70)" }}
            >
              No letters yet
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Write your first love letter above
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
