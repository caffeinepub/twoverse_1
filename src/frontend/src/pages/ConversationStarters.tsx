import { ArrowLeft, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  useGetConversationStarterSeed,
  useGetDaysTogether,
  useSetConversationStarterSeed,
} from "../hooks/useQueries";

interface ConversationStartersProps {
  onBack: () => void;
}

const QUESTIONS = {
  fun: [
    "If our relationship were a movie genre, what would it be and why? 🎬",
    "What's the silliest inside joke we have that outsiders would never understand? 😂",
    "If we could switch lives for a day, what's the first thing you'd do? 🔄",
    "What weird superpower would suit our relationship perfectly? 🦸",
    "If we had our own reality show, what would it be called? 📺",
    "What song would play every time you enter a room in our story? 🎵",
    "If a wizard turned us into animals, what would we be? 🐾",
    "What's the most embarrassing thing you've done around me that still makes you cringe? 😳",
    "If we could live anywhere in the world for a year, where and why? 🌍",
    "What fictional couple do we remind you of the most? 💑",
    "If you could invent a holiday for just us two, what would it celebrate? 🥳",
    "What would our couple nickname be if we were celebrities? ⭐",
    "If our relationship had a mascot, what would it be? 🐶",
    "What's something you thought about me when we first met that turned out to be totally wrong? 🤔",
    "If we wrote a book about us, what would the opening line be? 📚",
  ],
  deep: [
    "What's one thing about yourself that you hope I understand completely? 🪞",
    "When did you first realise you truly loved me? 💓",
    "What's a fear you haven't fully shared with me yet? 🌊",
    "What do you need from me during your hardest days that you rarely ask for? 🤝",
    "How have I changed you in ways you didn't expect? 🌱",
    "What part of yourself do you feel safest to show only with me? 🔓",
    "What's something you've learned about love that you wish you'd known earlier? 📖",
    "If you could relive one moment from our relationship, which would it be? ⏳",
    "What's a dream you've given up on that you wish we could revive together? 💫",
    "How do you feel loved in ways that words can't fully describe? 💞",
    "What's a wound from your past that our relationship has helped to heal? 🌸",
    "What does home mean to you, and how much of it lives in me? 🏡",
    "When do you feel most understood by me? 💬",
    "What legacy do you hope we leave on each other's lives? 🌟",
    "What's the bravest thing you've done for our love? ✨",
  ],
  romantic: [
    "What's the smallest thing I do that makes you feel the most loved? 💕",
    "Describe the moment you knew I was someone special, in vivid detail 🌹",
    "If you could write me a letter to open in 10 years, what would it say? 💌",
    "What's a secret way you show love that I might not always notice? 🤫",
    "If you could give me one gift that money can't buy, what would it be? 🎁",
    "What's a place that now means 'us' to you whenever you pass it? 🗺️",
    "How do you imagine us growing old together? 👴👵",
    "What's a romantic gesture you've always wanted to do but haven't yet? 🕯️",
    "Tell me your favourite version of a day with me — from morning to night ☀️🌙",
    "What do you love most about the way we say goodbye? 🫂",
    "What song lyric feels like it was written exactly about us? 🎼",
    "How has loving you made me a better person? 🌺",
    "What do you wish I knew about how much you love me? 💗",
    "What's the most romantic thing I've ever said without realising it? 😍",
    "If you could freeze one feeling we've shared forever, what would it be? 🧊💖",
  ],
  future: [
    "What's one tradition you hope we build in the next 5 years? 🎄",
    "Where do you see us living in 10 years, and what does that life look like? 🏡",
    "What kind of parents (or guardians) do you think we'd be? 👶",
    "What's one adventure you want to have with me before we're 70? 🌋",
    "If we started a business together, what would it be? 💼",
    "What's a habit you want us to build as a couple going forward? 🌿",
    "How do you want us to handle hard years that will inevitably come? 🌧️",
    "What do you hope we're still laughing about 20 years from now? 😄",
    "What milestone are you most excited to reach together next? 🏆",
    "How would you describe our ideal retirement life? 🌅",
    "If we could design our dream home from scratch, what's the one room you'd obsess over? 🎨",
    "What's one promise you want us to make and keep forever? 🤞",
    "How do you envision us celebrating our 25th anniversary? 🥂",
    "What values do you most want our life together to be built on? 🏗️",
    "What does your dream everyday life with me look like 5 years from now? ☀️",
  ],
};

type Category = keyof typeof QUESTIONS;

const CATEGORY_META: Record<
  Category,
  { label: string; emoji: string; color: string }
> = {
  fun: { label: "Fun", emoji: "😄", color: "#FFB347" },
  deep: { label: "Deep", emoji: "🌊", color: "#60A5FA" },
  romantic: { label: "Romantic", emoji: "🌹", color: "#F472B6" },
  future: { label: "Future", emoji: "🌟", color: "#A78BFA" },
};

const CARD_STYLE = {
  background: "rgba(255,255,255,0.13)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  borderColor: "rgba(255,255,255,0.22)",
};

export default function ConversationStarters({
  onBack,
}: ConversationStartersProps) {
  const { themeData } = useTheme();
  const { data: days } = useGetDaysTogether();
  const { data: seedData } = useGetConversationStarterSeed();
  const setSeed = useSetConversationStarterSeed();
  const [category, setCategory] = useState<Category>("fun");
  const [offset, setOffset] = useState(0);

  const daysNum = days != null ? Number(days) : 0;
  const baseSeed = seedData !== undefined ? Number(seedData) : 0;
  const questions = QUESTIONS[category];
  const qIndex = (baseSeed + offset) % questions.length;
  const question = questions[qIndex];

  const meta = CATEGORY_META[category];
  const heartAccent = themeData.heartFill;

  const handleNext = () => {
    const nextOffset = offset + 1;
    setOffset(nextOffset);
    setSeed.mutate(BigInt(baseSeed + nextOffset));
  };

  return (
    <div className="relative z-10 px-5 pt-8 pb-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <button
          type="button"
          data-ocid="starters.back_button"
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center border"
          style={CARD_STYLE}
        >
          <ArrowLeft size={18} color="rgba(255,255,255,0.9)" />
        </button>
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "rgba(255,255,255,0.97)" }}
          >
            Conversation Starters 💬
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            {daysNum > 0
              ? `Tailored for ${daysNum} days together`
              : "Deep questions for two"}
          </p>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-4 gap-2"
      >
        {(Object.keys(QUESTIONS) as Category[]).map((cat) => {
          const m = CATEGORY_META[cat];
          const isActive = category === cat;
          return (
            <button
              key={cat}
              type="button"
              data-ocid={`starters.${cat}_tab`}
              onClick={() => {
                setCategory(cat);
                setOffset(0);
              }}
              className="flex flex-col items-center gap-1 py-2.5 rounded-2xl border text-xs font-semibold transition-all"
              style={{
                borderColor: isActive ? m.color : "rgba(255,255,255,0.20)",
                background: isActive
                  ? `${m.color}22`
                  : "rgba(255,255,255,0.08)",
                color: isActive ? m.color : "rgba(255,255,255,0.65)",
              }}
            >
              <span className="text-lg">{m.emoji}</span>
              {m.label}
            </button>
          );
        })}
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${category}-${qIndex}`}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
          data-ocid="starters.question_card"
          className="rounded-3xl border p-7 min-h-48 flex flex-col justify-between gap-6"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.14) 0%, ${meta.color}18 100%)`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderColor: `${meta.color}44`,
            boxShadow: `0 8px 32px ${meta.color}20`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              style={{ background: `${meta.color}28` }}
            >
              <span className="text-xl">{meta.emoji}</span>
            </div>
            <p
              className="font-display text-lg font-semibold leading-relaxed flex-1"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              {question}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{ background: `${meta.color}22`, color: meta.color }}
            >
              {meta.label} {meta.emoji}
            </span>
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              {qIndex + 1} / {questions.length}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <motion.button
        type="button"
        data-ocid="starters.next_button"
        whileTap={{ scale: 0.93 }}
        onClick={handleNext}
        className="w-full rounded-3xl py-3.5 flex items-center justify-center gap-2 border font-semibold text-sm"
        style={{
          background: `linear-gradient(135deg, ${heartAccent}cc, ${heartAccent}88)`,
          borderColor: `${heartAccent}66`,
          color: "#ffffff",
          boxShadow: `0 4px 16px ${heartAccent}44`,
        }}
      >
        <RefreshCw size={16} />
        Next Question
      </motion.button>

      {/* Tip */}
      <p
        className="text-center text-xs italic"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        Take turns answering — no right or wrong answers 💕
      </p>
    </div>
  );
}
