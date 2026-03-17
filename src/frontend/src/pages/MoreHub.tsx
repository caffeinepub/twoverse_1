import type { Variants } from "motion/react";
import { motion } from "motion/react";

type Page =
  | "dashboard"
  | "chat"
  | "memories"
  | "settings"
  | "more"
  | "analytics"
  | "missions"
  | "timecapsule"
  | "anniversaries"
  | "quiz";

interface MoreHubProps {
  onNavigate: (page: Page) => void;
}

const features: {
  page: Page;
  emoji: string;
  name: string;
  description: string;
  ocid: string;
}[] = [
  {
    page: "analytics",
    emoji: "\ud83d\udcca",
    name: "Bond Analytics",
    description: "Mood streaks & emotion charts",
    ocid: "more.analytics_card",
  },
  {
    page: "missions",
    emoji: "\ud83c\udfaf",
    name: "Couple Missions",
    description: "Earn XP together",
    ocid: "more.missions_card",
  },
  {
    page: "anniversaries",
    emoji: "\ud83c\udf82",
    name: "Anniversaries",
    description: "Track special dates",
    ocid: "more.anniversaries_card",
  },
  {
    page: "timecapsule",
    emoji: "\ud83d\udc8c",
    name: "Time Capsule",
    description: "Messages from the future",
    ocid: "more.timecapsule_card",
  },
  {
    page: "quiz",
    emoji: "\ud83d\udc9d",
    name: "Couple Quiz",
    description: "Discover compatibility",
    ocid: "more.quiz_card",
  },
  {
    page: "settings",
    emoji: "\u2699\ufe0f",
    name: "Settings",
    description: "Theme & start date",
    ocid: "more.settings_card",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.3 },
  },
};

export default function MoreHub({ onNavigate }: MoreHubProps) {
  return (
    <div className="relative z-10 px-5 pt-8 pb-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          More \u2728
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Explore all TwoVerse features
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        {features.map((f) => (
          <motion.button
            key={f.page}
            variants={item}
            data-ocid={f.ocid}
            onClick={() => onNavigate(f.page)}
            whileTap={{ scale: 0.93 }}
            className="flex flex-col items-start gap-2 p-4 bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-card text-left hover:border-primary/40 hover:shadow-card-hover transition-all"
          >
            <span className="text-3xl">{f.emoji}</span>
            <div>
              <p className="font-semibold text-sm text-foreground leading-tight">
                {f.name}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                {f.description}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          \u00a9 {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
