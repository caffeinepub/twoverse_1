import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image, Loader2, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  nanoToDate,
  useAddMemory,
  useGetAllMemories,
} from "../hooks/useQueries";

export default function MemoryVault() {
  const { data: memories = [], isLoading } = useGetAllMemories();
  const addMemory = useAddMemory();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photoBytes, setPhotoBytes] = useState<Uint8Array | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ab = ev.target?.result as ArrayBuffer;
      setPhotoBytes(new Uint8Array(ab));
      setPhotoPreview(URL.createObjectURL(file));
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in title and memory");
      return;
    }
    addMemory.mutate(
      { title: title.trim(), content: content.trim(), photoBytes },
      {
        onSuccess: () => {
          toast.success("Memory saved! 📸");
          setOpen(false);
          setTitle("");
          setContent("");
          setPhotoBytes(null);
          setPhotoPreview(null);
        },
        onError: () => toast.error("Couldn't save memory"),
      },
    );
  };

  const formatDate = (ts: bigint) => {
    return nanoToDate(ts).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="relative z-10 px-5 pt-8 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Memory Vault 📸
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {memories.length} {memories.length === 1 ? "memory" : "memories"}{" "}
            saved
          </p>
        </div>
        <Button
          data-ocid="memory.add_button"
          size="sm"
          onClick={() => setOpen(true)}
          className="rounded-2xl gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {isLoading && (
        <div
          data-ocid="memory.loading_state"
          className="flex justify-center py-16"
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && memories.length === 0 && (
        <motion.div
          data-ocid="memory.empty_state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-3"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-4xl">
            📷
          </div>
          <p className="text-muted-foreground font-medium">No memories yet</p>
          <p className="text-muted-foreground text-xs text-center max-w-[200px]">
            Start capturing beautiful moments together
          </p>
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="rounded-2xl mt-2"
          >
            Add your first memory
          </Button>
        </motion.div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {memories.map((memory, idx) => (
            <motion.div
              key={memory.id.toString()}
              data-ocid={`memory.item.${idx + 1}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
              className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-card border border-border overflow-hidden"
            >
              {memory.photo && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={memory.photo.getDirectURL()}
                    alt={memory.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-semibold text-foreground text-base leading-tight">
                    {memory.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(memory.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {memory.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[380px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Add a Memory 💝
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div>
              <Label htmlFor="mem-title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="mem-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Our first picnic..."
                className="mt-1 rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="mem-content" className="text-sm font-medium">
                Memory
              </Label>
              <Textarea
                id="mem-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write about this beautiful moment..."
                className="mt-1 rounded-2xl resize-none"
                rows={4}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Photo (optional)</Label>
              <div className="mt-1">
                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoBytes(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ocid="memory.upload_button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-24 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors text-muted-foreground hover:text-primary"
                  >
                    <Image className="h-5 w-5" />
                    <span className="text-xs">Tap to add photo</span>
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-2xl"
                onClick={handleSubmit}
                disabled={
                  addMemory.isPending || !title.trim() || !content.trim()
                }
              >
                {addMemory.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Memory 💝"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
