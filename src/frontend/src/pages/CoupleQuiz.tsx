import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetCompatibilityScore,
  useGetQuizAnswers,
  useSubmitQuizAnswer,
} from "../hooks/useQueries";

interface Props {
  onBack: () => void;
}

const QUESTIONS = [
  "What's your ideal date night?",
  "Your love language is?",
  "Dream vacation together?",
  "Favorite thing about your partner?",
  "Morning person or night owl?",
  "Your relationship superpower is?",
  "How do you handle disagreements?",
  "Your couple song would be?",
];

export default function CoupleQuiz({ onBack }: Props) {
  const { data: score = 0n } = useGetCompatibilityScore();
  const { data: answers = [] } = useGetQuizAnswers();
  const submitAnswer = useSubmitQuizAnswer();

  const [activeQ, setActiveQ] = useState<number | null>(null);
  const [partnerName, setPartnerName] = useState("");
  const [answerText, setAnswerText] = useState("");

  const scoreNum = Number(score);

  const getAnswer = (qIdx: number) =>
    answers.find((a) => Number(a.questionId) === qIdx);

  const handleSubmit = (qIdx: number) => {
    if (!partnerName.trim() || !answerText.trim()) {
      toast.error("Please fill both fields");
      return;
    }
    submitAnswer.mutate(
      {
        questionId: BigInt(qIdx),
        partnerName: partnerName.trim(),
        answer: answerText.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Answer saved! \ud83d\udc9d");
          setActiveQ(null);
          setPartnerName("");
          setAnswerText("");
        },
        onError: () => toast.error("Couldn't save answer"),
      },
    );
  };

  const circumference = 2 * Math.PI * 42;

  return (
    <div className="relative z-10 px-5 pt-8 pb-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          type="button"
          data-ocid="quiz.back_button"
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-primary transition-colors"
        >
          \u2190
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Couple Quiz \ud83d\udc9d
          </h1>
          <p className="text-xs text-muted-foreground">
            How well do you know each other?
          </p>
        </div>
      </motion.div>

      {/* Compatibility score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center py-6 bg-primary/10 rounded-3xl border border-primary/20"
      >
        <div className="relative w-28 h-28">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full -rotate-90"
            aria-label={`Compatibility score: ${scoreNum}%`}
          >
            <title>Compatibility Score</title>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="oklch(var(--border))"
              strokeWidth="10"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="oklch(var(--primary))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: circumference * (1 - scoreNum / 100),
              }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-2xl font-bold text-primary">
              {scoreNum}%
            </span>
          </div>
        </div>
        <p className="text-sm font-semibold text-foreground mt-3">
          Compatibility Score
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Answer more questions to improve!
        </p>
      </motion.div>

      {/* Questions */}
      <div className="space-y-3">
        {QUESTIONS.map((q, i) => {
          const saved = getAnswer(i);
          const isOpen = activeQ === i;
          return (
            <motion.div
              key={q}
              data-ocid={`quiz.item.${i + 1}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-card overflow-hidden"
            >
              <button
                type="button"
                data-ocid={`quiz.toggle.${i + 1}`}
                onClick={() => {
                  setActiveQ(isOpen ? null : i);
                  setPartnerName(saved?.partnerName ?? "");
                  setAnswerText(saved?.answer ?? "");
                }}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {i + 1}
                </span>
                <p className="font-medium text-sm text-foreground flex-1 leading-snug">
                  {q}
                </p>
                {saved && (
                  <span className="text-xs bg-green-500/15 text-green-600 rounded-full px-2 py-0.5 font-medium flex-shrink-0">
                    \u2713
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Your Partner's Name
                        </Label>
                        <Input
                          data-ocid={`quiz.partner_input.${i + 1}`}
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          placeholder="e.g. Jordan"
                          className="mt-1 rounded-xl h-9 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Your Answer
                        </Label>
                        <Input
                          data-ocid={`quiz.answer_input.${i + 1}`}
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Type your answer..."
                          className="mt-1 rounded-xl h-9 text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        data-ocid={`quiz.submit_button.${i + 1}`}
                        onClick={() => handleSubmit(i)}
                        disabled={submitAnswer.isPending}
                        className="btn-primary"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                      >
                        {submitAnswer.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          "Save Answer \ud83d\udc9d"
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
