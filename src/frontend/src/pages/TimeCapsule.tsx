import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddTimeCapsuleMessage,
  useGetAllTimeCapsuleMessages,
  useGetUnlockedTimeCapsuleMessages,
} from "../hooks/useQueries";

interface Props {
  onBack: () => void;
}

const nanoToReadable = (ns: bigint) => {
  return new Date(Number(ns / 1_000_000n)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function TimeCapsule({ onBack }: Props) {
  const { data: allMessages = [] } = useGetAllTimeCapsuleMessages();
  const { data: unlocked = [] } = useGetUnlockedTimeCapsuleMessages();
  const addMessage = useAddTimeCapsuleMessage();

  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [unlockDate, setUnlockDate] = useState("");

  const lockedCount = allMessages.filter((m) => !m.isUnlocked).length;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const handleSubmit = () => {
    if (!author.trim() || !content.trim() || !unlockDate) {
      toast.error("Please fill in all fields");
      return;
    }
    const unlockTs = BigInt(new Date(unlockDate).getTime()) * 1_000_000n;
    addMessage.mutate(
      {
        content: content.trim(),
        authorName: author.trim(),
        unlockAt: unlockTs,
      },
      {
        onSuccess: () => {
          toast.success("Time capsule sealed! 💌");
          setAuthor("");
          setContent("");
          setUnlockDate("");
        },
        onError: () => toast.error("Couldn't seal the capsule"),
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
          data-ocid="timecapsule.back_button"
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-primary transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Time Capsule 💌
          </h1>
          <p className="text-xs text-muted-foreground">
            Seal messages for the future
          </p>
        </div>
      </motion.div>

      {lockedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-2 justify-center bg-primary/8 rounded-2xl p-3 border border-primary/15"
        >
          <Lock className="w-4 h-4 text-primary" />
          <p className="text-sm text-primary font-medium">
            {lockedCount} sealed {lockedCount === 1 ? "message" : "messages"}{" "}
            waiting to be opened
          </p>
        </motion.div>
      )}

      <Tabs defaultValue="write">
        <TabsList className="w-full rounded-2xl">
          <TabsTrigger
            value="write"
            data-ocid="timecapsule.write_tab"
            className="flex-1 rounded-xl"
          >
            ✍️ Write
          </TabsTrigger>
          <TabsTrigger
            value="unlocked"
            data-ocid="timecapsule.unlocked_tab"
            className="flex-1 rounded-xl"
          >
            📬 Unlocked ({unlocked.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-4 space-y-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-card p-5 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Your Name</Label>
              <Input
                data-ocid="timecapsule.author_input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Alex"
                className="mt-1 rounded-2xl"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Your Message
              </Label>
              <Textarea
                data-ocid="timecapsule.message_textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something beautiful for the future..."
                className="mt-1 rounded-2xl min-h-[120px]"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Unlock Date (must be future)
              </Label>
              <Input
                data-ocid="timecapsule.unlock_date_input"
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                min={minDateStr}
                className="mt-1 rounded-2xl"
              />
            </div>
            <button
              type="button"
              data-ocid="timecapsule.submit_button"
              onClick={handleSubmit}
              disabled={
                addMessage.isPending ||
                !author.trim() ||
                !content.trim() ||
                !unlockDate
              }
              className="btn-primary"
            >
              {addMessage.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sealing...
                </>
              ) : (
                "Seal Time Capsule 💌"
              )}
            </button>
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="mt-4">
          <AnimatePresence>
            {unlocked.length === 0 ? (
              <motion.div
                data-ocid="timecapsule.empty_state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-4xl mb-3">🔒</p>
                <p className="font-display text-lg font-semibold text-foreground">
                  Still sealed...
                </p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Your future messages are still sealed,
                  <br />
                  waiting patiently for their moment.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {unlocked.map((msg, i) => (
                  <motion.div
                    key={String(msg.id)}
                    data-ocid={`timecapsule.item.${i + 1}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-card p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary">
                        {msg.authorName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {nanoToReadable(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {msg.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
