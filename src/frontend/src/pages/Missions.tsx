import { Check, Loader2, Star } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  useCompleteMission,
  useGetAllMissions,
  useGetTotalXP,
} from "../hooks/useQueries";

interface Props {
  onBack: () => void;
}

const DEFAULT_MISSIONS = [
  {
    title: "Cook dinner together",
    description: "Prepare a meal side by side",
    xp: 50,
  },
  {
    title: "Watch a sunset",
    description: "Find the perfect spot to watch it together",
    xp: 75,
  },
  {
    title: "Write love letters",
    description: "Write heartfelt letters to each other",
    xp: 100,
  },
  {
    title: "Go on a surprise date",
    description: "Plan a surprise for your partner",
    xp: 150,
  },
  {
    title: "Create a playlist together",
    description: "Curate your couple playlist",
    xp: 50,
  },
];

export default function Missions({ onBack }: Props) {
  const { data: missions = [], isLoading } = useGetAllMissions();
  const { data: totalXP = 0n } = useGetTotalXP();
  const completeMission = useCompleteMission();

  const handleComplete = (id: bigint) => {
    completeMission.mutate(id, {
      onSuccess: () => toast.success("Mission complete! XP earned 🎉"),
      onError: () => toast.error("Couldn't complete mission"),
    });
  };

  const showDefault = !isLoading && missions.length === 0;

  return (
    <div className="relative z-10 px-5 pt-8 pb-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          type="button"
          data-ocid="missions.back_button"
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-primary transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Couple Missions 🎯
          </h1>
          <p className="text-xs text-muted-foreground">
            Complete together, grow together
          </p>
        </div>
      </motion.div>

      {/* XP Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-3 bg-primary/10 rounded-2xl p-4 border border-primary/20"
      >
        <Star className="w-6 h-6 text-primary fill-primary" />
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-primary">
            {Number(totalXP)} XP
          </p>
          <p className="text-xs text-muted-foreground">Total earned together</p>
        </div>
      </motion.div>

      {isLoading && (
        <div
          data-ocid="missions.loading_state"
          className="flex justify-center py-8"
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {showDefault && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <div
            data-ocid="missions.empty_state"
            className="bg-primary/5 rounded-2xl p-4 border border-primary/15 text-center"
          >
            <p className="text-sm text-muted-foreground">
              ✨ Suggested missions — add your own from Settings!
            </p>
          </div>
          {DEFAULT_MISSIONS.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              data-ocid={`missions.item.${i + 1}`}
              className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-card p-4 flex items-center gap-3"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">
                  {m.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {m.description}
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1">
                <Star className="w-3 h-3 text-primary" />
                <span className="text-xs font-bold text-primary">{m.xp}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && missions.length > 0 && (
        <div className="space-y-3">
          {missions.map((m, i) => (
            <motion.div
              key={String(m.id)}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              data-ocid={`missions.item.${i + 1}`}
              className={`bg-card/80 backdrop-blur-sm rounded-2xl border shadow-card p-4 flex items-center gap-3 ${
                m.isCompleted ? "border-border opacity-70" : "border-border"
              }`}
            >
              <div className="flex-1">
                <p
                  className={`font-semibold text-sm ${
                    m.isCompleted
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {m.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {m.description}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 bg-primary/10 rounded-full px-2.5 py-1">
                  <Star className="w-3 h-3 text-primary" />
                  <span className="text-xs font-bold text-primary">
                    {Number(m.xpReward)}
                  </span>
                </div>
                {m.isCompleted ? (
                  <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ocid={`missions.complete_button.${i + 1}`}
                    onClick={() => handleComplete(m.id)}
                    disabled={completeMission.isPending}
                    className="w-7 h-7 rounded-full border-2 border-primary/40 hover:border-primary hover:bg-primary/10 transition-all flex items-center justify-center"
                  >
                    {completeMission.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
