import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  nanoToDate,
  useGetAllCheckIns,
  useGetRelationshipDNA,
} from "../hooks/useQueries";

interface Props {
  onBack: () => void;
}

const EMOTION_EMOJIS: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  stressed: "😤",
  tired: "😴",
  excited: "🤩",
  sad: "😢",
};

export default function BondAnalytics({ onBack }: Props) {
  const { data: checkIns = [] } = useGetAllCheckIns();
  const { data: dna } = useGetRelationshipDNA();

  // Emotion frequency
  const emotionCounts: Record<string, number> = {};
  for (const ci of checkIns) {
    emotionCounts[ci.emotion] = (emotionCounts[ci.emotion] || 0) + 1;
  }
  const chartData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion: `${EMOTION_EMOJIS[emotion] ?? ""} ${emotion}`,
    count,
  }));

  // Mood streak: consecutive days with at least one check-in
  const uniqueDays = new Set(
    checkIns.map((ci) => {
      const d = nanoToDate(ci.timestamp);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (uniqueDays.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  // Bond strength
  const bondStrength = Math.min(100, Math.round((checkIns.length / 30) * 100));

  return (
    <div className="relative z-10 px-5 pt-8 pb-6 space-y-6">
      {/* Back + Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          type="button"
          data-ocid="analytics.back_button"
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-primary transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Bond Analytics 📊
          </h1>
          <p className="text-xs text-muted-foreground">
            Your emotional journey together
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-card p-4 text-center">
          <p className="font-display text-3xl font-bold text-primary">
            {streak}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Day streak 🔥
          </p>
        </div>
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-card p-4 text-center">
          <p className="font-display text-3xl font-bold text-primary">
            {bondStrength}%
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Bond strength 💕
          </p>
        </div>
      </motion.div>

      {/* Emotion chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-card p-5"
      >
        <h2 className="font-semibold text-sm text-foreground mb-4">
          Emotion Frequency
        </h2>
        {chartData.length === 0 ? (
          <div data-ocid="analytics.empty_state" className="text-center py-8">
            <p className="text-4xl mb-2">🌱</p>
            <p className="text-sm text-muted-foreground">
              Start checking in to see your patterns
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
              />
              <XAxis
                dataKey="emotion"
                tick={{ fontSize: 10, fill: "oklch(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="count"
                fill="oklch(var(--primary))"
                radius={[6, 6, 0, 0]}
                name="Check-ins"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Bond strength bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-card p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm text-foreground">
            Bond Strength
          </h2>
          <span className="text-primary font-bold text-sm">
            {bondStrength}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${bondStrength}%` }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(var(--btn-gradient-from)), oklch(var(--btn-gradient-to)))",
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Based on {checkIns.length} check-ins — keep going to reach 100%!
        </p>
      </motion.div>
      {/* Relationship DNA */}
      <motion.div
        data-ocid="analytics.relationship_dna_card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-card p-5 space-y-4"
      >
        {/* Heading */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🧬</span>
          <h2 className="font-semibold text-sm text-foreground">
            Relationship DNA
          </h2>
        </div>

        {/* DNA helix visual */}
        <div className="flex items-center justify-center py-2">
          <svg
            width="180"
            height="44"
            viewBox="0 0 180 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Relationship DNA double helix"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const x = 10 + i * 20;
              const y1 = 8 + Math.sin((i / 8) * Math.PI * 2) * 14;
              const y2 = 36 - Math.sin((i / 8) * Math.PI * 2) * 14;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y1}
                    r={5}
                    fill="oklch(var(--primary))"
                    opacity={0.7 + 0.3 * ((i % 3) / 2)}
                  />
                  <circle
                    cx={x}
                    cy={y2}
                    r={5}
                    fill="oklch(var(--accent))"
                    opacity={0.7 + 0.3 * ((i % 3) / 2)}
                  />
                  <line
                    x1={x}
                    y1={y1 + 5}
                    x2={x}
                    y2={y2 - 5}
                    stroke="oklch(var(--border))"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {dna ? (
          <>
            {/* Bond Personality */}
            <div className="text-center">
              <p
                className="font-display text-2xl font-bold text-primary"
                style={{ textShadow: "0 0 20px oklch(var(--primary) / 0.5)" }}
              >
                {dna.bondPersonality}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your couple personality
              </p>
            </div>

            {/* Top Emotions */}
            {dna.topEmotions.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">
                  Top Emotions
                </p>
                <div className="flex flex-wrap gap-2">
                  {dna.topEmotions.slice(0, 3).map((emotion) => {
                    const emojiMap: Record<string, string> = {
                      happy: "😊",
                      loving: "💕",
                      excited: "🎉",
                      calm: "🌸",
                      tired: "😴",
                      sad: "🥺",
                      stressed: "😰",
                      grateful: "🙏",
                    };
                    const emoji = emojiMap[emotion.toLowerCase()] ?? "💫";
                    return (
                      <span
                        key={emotion}
                        data-ocid="analytics.emotion_badge"
                        className="rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1"
                        style={{
                          background: "oklch(var(--primary) / 0.15)",
                          color: "oklch(var(--primary))",
                          border: "1px solid oklch(var(--primary) / 0.30)",
                        }}
                      >
                        {emoji} {emotion}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "Messages",
                  value: String(dna.totalMessages),
                  emoji: "💬",
                },
                {
                  label: "Memories",
                  value: String(dna.totalMemories),
                  emoji: "📸",
                },
                {
                  label: "Check-ins",
                  value: String(dna.totalCheckIns),
                  emoji: "🫶",
                },
                {
                  label: "Missions",
                  value: String(dna.completedMissions),
                  emoji: "🎯",
                },
                {
                  label: "Streak",
                  value: String(dna.currentStreak),
                  emoji: "🔥",
                },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  data-ocid={`analytics.dna_stat.${i + 1}`}
                  className="rounded-2xl border border-border bg-muted/30 p-3 text-center"
                >
                  <p className="text-lg mb-0.5">{stat.emoji}</p>
                  <p className="font-bold text-base text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div
            data-ocid="analytics.dna_loading_state"
            className="text-center py-6"
          >
            <p className="text-3xl mb-2">🧬</p>
            <p className="text-sm text-muted-foreground">
              Loading your DNA profile...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
