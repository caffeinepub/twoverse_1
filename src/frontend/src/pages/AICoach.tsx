import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  useGetAllCheckIns,
  useGetCoachTipSeed,
  useGetDaysTogether,
  useSetCoachTipSeed,
} from "../hooks/useQueries";

interface AICoachProps {
  onBack: () => void;
}

const TIPS_STRESSED = [
  "Plan a cozy movie night with blankets, hot cocoa, and your favourite film 🎥",
  "A gentle walk together in fresh air can reset both your moods beautifully 🌿",
  "Cook a simple meal together — it's therapy in a pan 🍳",
  "Send a sweet 'thinking of you' text right now, just because 💌",
  "Try a 5-minute breathing exercise side by side — stress melts faster together 🧘",
  "Plan a digital detox evening: phones off, candles on ✨",
  "Write each other one thing you're grateful for today 📝",
  "Take a long bath or shower, then snuggle and share how you feel 🛁",
  "Order your favourite takeout and eat together without screens 🍜",
  "Give each other a shoulder massage — touch is healing 💆",
  "Create a calm playlist together and just listen, no talking needed 🎶",
  "Build a blanket fort and hide from the world together 🏕️",
  "Draw each other silly portraits — laughter is the best medicine 🎨",
  "Visit a café or park — a change of scenery lifts the mood ☕",
  "Make a list of small joys together: sunsets, warm socks, good coffee 🌅",
  "Read aloud to each other for 15 minutes — incredibly calming 📖",
  "Do something creative together: journalling, doodling, or collaging 🖍️",
  "Send a voice note of you humming their favourite song 🎵",
  "Slow dance in the kitchen to a random song — no occasion needed 💃",
  "Tell each other three things that make the other person wonderful ❤️",
];

const TIPS_HAPPY = [
  "Celebrate your good vibes — plan a spontaneous date night this week 🎉",
  "Channel this energy into a shared adventure: a hike, day trip, or new restaurant 🌍",
  "Try a fun challenge together: cooking a new cuisine, a workout, or a puzzle 🧩",
  "Capture this moment — take photos, start a memory in your vault 📸",
  "Write a love letter to each other while feeling this joy 💌",
  "Start a new shared hobby today — pottery, painting, gaming, anything 🎮",
  "Make a bucket list of 10 things to do this year together ✈️",
  "Plan a movie marathon of your all-time favourites 🎬",
  "Send a 'just because I love you' gift — flowers, snacks, or a card 🌸",
  "Make a favourite memories scrapbook together 📒",
  "Recreate your first date — same food, same vibe 🥂",
  "Try a new workout or dance class together 💪",
  "Host a game night — board games, card games, video games 🎲",
  "Learn three phrases in a language you both want to visit 🗣️",
  "Stargaze tonight — lay outside or find a dark spot 🌟",
  "Challenge each other to a fun trivia night 🧠",
  "Create a couple playlist of songs that define your relationship 🎵",
  "Volunteer together for a cause you both care about 🤝",
  "Make a 'things we love about each other' jar and fill it with notes 💛",
  "Plan your dream vacation together — even if it's just a dream for now 🌴",
];

const TIPS_NEUTRAL = [
  "Check in daily — a small 'how are you really?' goes a long way 💬",
  "Relationships grow when you water them daily with small acts of kindness 🌱",
  "Put your phones down for one hour tonight and just be present together 📵",
  "Ask each other: 'What would make today feel special?' and do it 🌟",
  "Share three highlights from your week every Sunday night 📅",
  "Set a monthly date night and protect that time fiercely 🗓️",
  "Learn something new about each other — there's always more to discover 🔍",
  "Express appreciation openly — say 'I love how you...' more often 💕",
  "Try a 7-day kindness challenge: one kind act each day 🎯",
  "Create a shared vision board for your future together 🖼️",
  "Have a 'dream session' — share your wildest hopes and biggest wishes 💭",
  "Celebrate your small wins together — they matter just as much 🥳",
  "Listen to understand, not just to reply — it transforms conversations 👂",
  "Surprise each other with a compliment you've never given before ✨",
  "Revisit your favourite shared memory this week and relive it 🎞️",
  "Take turns planning surprise micro-adventures: a scenic drive, a picnic 🧺",
  "Hug for 6 seconds — science says it releases oxytocin 🤗",
  "Teach each other one skill you each have 🛠️",
  "Write down your couple values: trust, adventure, laughter — display them 📌",
  "Start a couples journal: one page per week, written together 📓",
];

function getTipCategory(
  checkIns: Array<{ emotion: string; timestamp: bigint }> | undefined,
) {
  if (!checkIns || checkIns.length === 0) return "neutral";
  const recent = [...checkIns]
    .sort((a, b) => Number(b.timestamp - a.timestamp))
    .slice(0, 5);
  const negativeEmotions = ["stressed", "tired", "sad"];
  const positiveEmotions = ["happy", "excited"];
  const negCount = recent.filter((c) =>
    negativeEmotions.includes(c.emotion),
  ).length;
  const posCount = recent.filter((c) =>
    positiveEmotions.includes(c.emotion),
  ).length;
  if (negCount >= 3) return "stressed";
  if (posCount >= 3) return "happy";
  return "neutral";
}

const CARD_STYLE = {
  background: "rgba(255,255,255,0.13)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  borderColor: "rgba(255,255,255,0.22)",
};

export default function AICoach({ onBack }: AICoachProps) {
  const { themeData } = useTheme();
  const { data: checkIns } = useGetAllCheckIns();
  const { data: days } = useGetDaysTogether();
  const { data: seedData } = useGetCoachTipSeed();
  const setSeed = useSetCoachTipSeed();
  const [offset, setOffset] = useState(0);

  const category = getTipCategory(checkIns);
  const tips =
    category === "stressed"
      ? TIPS_STRESSED
      : category === "happy"
        ? TIPS_HAPPY
        : TIPS_NEUTRAL;

  const todaySeed = Number(
    BigInt(new Date().toISOString().slice(0, 10).replace(/-/g, "")),
  );
  const baseSeed = seedData !== undefined ? Number(seedData) : todaySeed;
  const tipIndex = (baseSeed + offset) % tips.length;
  const tip = tips[tipIndex];

  const daysNum = days != null ? Number(days) : 0;

  const categoryLabel =
    category === "stressed"
      ? "Self-Care & Comfort 💙"
      : category === "happy"
        ? "Fun & Adventure 🎉"
        : "Relationship Wisdom 💡";

  const categoryEmoji =
    category === "stressed" ? "💙" : category === "happy" ? "🎉" : "✨";

  const heartAccent = themeData.heartFill;

  const handleRefresh = () => {
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
          data-ocid="aicoach.back_button"
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
            AI Coach 🤖💕
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            Personalised tips based on your mood
          </p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="rounded-2xl border p-4 text-center" style={CARD_STYLE}>
          <p
            className="font-display text-2xl font-bold"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            {daysNum}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            days together
          </p>
        </div>
        <div className="rounded-2xl border p-4 text-center" style={CARD_STYLE}>
          <p
            className="font-display text-2xl font-bold"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            {categoryEmoji}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            {category} vibes
          </p>
        </div>
      </motion.div>

      {/* Category label */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-full px-4 py-2 inline-flex items-center gap-2 border"
        style={{
          background: `${heartAccent}25`,
          borderColor: `${heartAccent}55`,
        }}
      >
        <Sparkles size={14} color={heartAccent} />
        <span
          className="text-xs font-semibold"
          style={{ color: "rgba(255,255,255,0.90)" }}
        >
          {categoryLabel}
        </span>
      </motion.div>

      {/* Tip Card */}
      <motion.div
        key={tipIndex}
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ type: "spring", bounce: 0.3 }}
        data-ocid="aicoach.tip_card"
        className="rounded-3xl border p-6 space-y-4"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.16) 0%, ${heartAccent}18 100%)`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: `${heartAccent}44`,
          boxShadow: `0 8px 32px ${heartAccent}22`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${heartAccent}33` }}
          >
            <span className="text-xl">💡</span>
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: `${heartAccent}cc` }}
            >
              Today's Coach Tip
            </p>
            <p
              className="font-display text-base font-semibold leading-relaxed"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              {tip}
            </p>
          </div>
        </div>
        <div
          className="h-px w-full"
          style={{ background: `${heartAccent}30` }}
        />
        <p
          className="text-xs italic"
          style={{ color: "rgba(255,255,255,0.50)" }}
        >
          Based on your recent check-ins and {daysNum} days together
        </p>
      </motion.div>

      {/* Refresh */}
      <motion.button
        type="button"
        data-ocid="aicoach.refresh_button"
        whileTap={{ scale: 0.93 }}
        onClick={handleRefresh}
        className="w-full rounded-3xl py-3.5 flex items-center justify-center gap-2 border font-semibold text-sm"
        style={{
          background: `linear-gradient(135deg, ${heartAccent}cc, ${heartAccent}88)`,
          borderColor: `${heartAccent}66`,
          color: "#ffffff",
          boxShadow: `0 4px 16px ${heartAccent}44`,
        }}
      >
        <RefreshCw size={16} />
        Next Tip
      </motion.button>

      {/* Tip count */}
      <p
        className="text-center text-xs"
        style={{ color: "rgba(255,255,255,0.40)" }}
      >
        Tip {(tipIndex % tips.length) + 1} of {tips.length} in this category
      </p>
    </div>
  );
}
