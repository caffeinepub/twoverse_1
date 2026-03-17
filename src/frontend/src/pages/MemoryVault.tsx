import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Image, Loader2, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  nanoToDate,
  useAddMemory,
  useDeleteMemory,
  useGetAllMemories,
} from "../hooks/useQueries";

export default function MemoryVault() {
  const { data: memories = [], isLoading } = useGetAllMemories();
  const addMemory = useAddMemory();
  const deleteMemory = useDeleteMemory();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photoBytes, setPhotoBytes] = useState<Uint8Array | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
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

  const handleDeleteConfirm = () => {
    if (deleteId == null) return;
    deleteMemory.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Memory deleted 🗑️");
        setDeleteId(null);
      },
      onError: () => toast.error("Couldn't delete memory"),
    });
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
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "rgba(255,255,255,0.97)" }}
          >
            Memory Vault 📸
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
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
          <Loader2
            className="h-6 w-6 animate-spin"
            style={{ color: "rgba(255,255,255,0.80)" }}
          />
        </div>
      )}

      {!isLoading && memories.length === 0 && (
        <motion.div
          data-ocid="memory.empty_state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-3"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            📷
          </div>
          <p
            className="font-medium"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            No memories yet
          </p>
          <p
            className="text-xs text-center max-w-[200px]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
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
              className="rounded-3xl shadow-card border overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(255,255,255,0.25)",
              }}
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
                  <h3
                    className="font-display font-semibold text-base leading-tight flex-1"
                    style={{ color: "rgba(255,255,255,0.97)" }}
                  >
                    {memory.title}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className="text-xs whitespace-nowrap"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {formatDate(memory.timestamp)}
                    </span>
                    <button
                      type="button"
                      data-ocid={`memory.delete_button.${idx + 1}`}
                      onClick={() => setDeleteId(memory.id)}
                      className="p-1.5 rounded-xl transition-colors"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                      title="Delete memory"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p
                  className="text-sm leading-relaxed line-clamp-3"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {memory.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Memory Dialog */}
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
                data-ocid="memory.title.input"
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
                data-ocid="memory.content.textarea"
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
                data-ocid="memory.submit_button"
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

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId != null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent
          data-ocid="memory.delete_dialog"
          className="rounded-3xl max-w-[340px]"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete this memory?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This memory will be permanently removed. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="memory.delete_cancel_button"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="memory.delete_confirm_button"
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteMemory.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
