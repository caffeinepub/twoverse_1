import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddAnniversary,
  useGetAllAnniversaries,
  useGetStartDate,
  useRemoveAnniversary,
} from "../hooks/useQueries";

interface Props {
  onBack: () => void;
}

const EMOJI_PRESETS = [
  "\ud83c\udf82",
  "\ud83c\udf8a",
  "\ud83d\udc8d",
  "\ud83c\udf39",
  "\u2708\ufe0f",
  "\ud83d\udc91",
];

const daysUntil = (dateTs: bigint) => {
  const target = new Date(Number(dateTs / 1_000_000n));
  const now = new Date();
  const thisYear = new Date(
    now.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );
  if (thisYear < now) thisYear.setFullYear(now.getFullYear() + 1);
  return Math.ceil(
    (thisYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
};

export default function AnniversaryTracker({ onBack }: Props) {
  const { data: anniversaries = [] } = useGetAllAnniversaries();
  const { data: startDate } = useGetStartDate();
  const addAnniversary = useAddAnniversary();
  const removeAnniversary = useRemoveAnniversary();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("\ud83c\udf82");

  const daysUntilAnniversary = startDate
    ? (() => {
        const d = new Date(Number(startDate / 1_000_000n));
        const now = new Date();
        const next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
        if (next < now) next.setFullYear(now.getFullYear() + 1);
        return Math.ceil(
          (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
      })()
    : null;

  const handleAdd = () => {
    if (!title.trim() || !date) {
      toast.error("Please fill title and date");
      return;
    }
    const ts = BigInt(new Date(date).getTime()) * 1_000_000n;
    addAnniversary.mutate(
      { title: title.trim(), date: ts, emoji },
      {
        onSuccess: () => {
          toast.success("Anniversary added! \ud83c\udf82");
          setTitle("");
          setDate("");
          setEmoji("\ud83c\udf82");
        },
        onError: () => toast.error("Couldn't add anniversary"),
      },
    );
  };

  return (
    <div className="relative z-10 px-5 pt-8 pb-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          type="button"
          data-ocid="anniversaries.back_button"
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-primary transition-colors"
        >
          \u2190
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Anniversaries \ud83c\udf82
          </h1>
          <p className="text-xs text-muted-foreground">Your love milestones</p>
        </div>
      </motion.div>

      {daysUntilAnniversary !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/10 rounded-3xl p-5 text-center border border-primary/20"
        >
          <p className="font-display text-4xl font-bold text-primary">
            {daysUntilAnniversary}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            days until your next anniversary \ud83d\udc95
          </p>
        </motion.div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {anniversaries.length === 0 ? (
            <motion.div
              data-ocid="anniversaries.empty_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-3xl mb-2">\ud83c\udf38</p>
              <p className="text-sm text-muted-foreground">
                Add your first anniversary below
              </p>
            </motion.div>
          ) : (
            anniversaries.map((a, i) => (
              <motion.div
                key={String(a.id)}
                data-ocid={`anniversaries.item.${i + 1}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-card p-4 flex items-center gap-3"
              >
                <span className="text-2xl">{a.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">
                    {a.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    in {daysUntil(a.date)}{" "}
                    {daysUntil(a.date) === 1 ? "day" : "days"}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`anniversaries.delete_button.${i + 1}`}
                  onClick={() =>
                    removeAnniversary.mutate(a.id, {
                      onSuccess: () => toast.success("Removed"),
                    })
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-card p-5 space-y-4"
      >
        <h2 className="font-semibold text-sm text-foreground">
          Add Anniversary
        </h2>
        <div>
          <Label className="text-xs text-muted-foreground">Title</Label>
          <Input
            data-ocid="anniversaries.title_input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Our first trip together"
            className="mt-1 rounded-2xl"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Date</Label>
          <Input
            data-ocid="anniversaries.date_input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 rounded-2xl"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Emoji</Label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {EMOJI_PRESETS.map((e) => (
              <button
                key={e}
                type="button"
                data-ocid="anniversaries.emoji_toggle"
                onClick={() => setEmoji(e)}
                className={`w-10 h-10 rounded-full border-2 text-xl flex items-center justify-center transition-all ${
                  emoji === e
                    ? "border-primary bg-primary/10 scale-110"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          data-ocid="anniversaries.add_button"
          onClick={handleAdd}
          disabled={addAnniversary.isPending || !title.trim() || !date}
          className="btn-primary"
        >
          {addAnniversary.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Adding...
            </>
          ) : (
            "Add Anniversary \ud83c\udf82"
          )}
        </button>
      </motion.div>
    </div>
  );
}
