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
import { nanoToDate, useGetAllCheckIns } from "../hooks/useQueries";

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
    </div>
  );
}
