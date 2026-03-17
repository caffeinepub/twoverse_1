import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  nanoToDate,
  useAddPhotoOfDay,
  useDeletePhotoOfDay,
  useGetAllPhotosOfDay,
  useGetTodaysPhoto,
} from "../hooks/useQueries";

interface PhotoOfDayProps {
  onBack: () => void;
}

const CARD_STYLE = {
  background: "rgba(255,255,255,0.14)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  borderColor: "rgba(255,255,255,0.22)",
};

export default function PhotoOfDay({ onBack }: PhotoOfDayProps) {
  const { data: todaysPhoto, isLoading: loadingToday } = useGetTodaysPhoto();
  const { data: allPhotos = [] } = useGetAllPhotosOfDay();
  const addPhoto = useAddPhotoOfDay();
  const deletePhoto = useDeletePhotoOfDay();

  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoBytes, setPhotoBytes] = useState<Uint8Array | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const buf = ev.target?.result as ArrayBuffer;
      setPhotoBytes(new Uint8Array(buf));
      setPreviewUrl(URL.createObjectURL(file));
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = () => {
    if (!photoBytes) {
      toast.error("Please select a photo first 📸");
      return;
    }
    addPhoto.mutate(
      { caption: caption.trim(), photoBytes, date: todayStr },
      {
        onSuccess: () => {
          toast.success("Today's photo saved! 📸");
          setCaption("");
          setPreviewUrl(null);
          setPhotoBytes(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: () => toast.error("Couldn't save photo"),
      },
    );
  };

  const handleDelete = (id: bigint) => {
    deletePhoto.mutate(id, {
      onSuccess: () => {
        toast.success("Photo removed");
        setConfirmDeleteId(null);
      },
      onError: () => toast.error("Couldn't delete photo"),
    });
  };

  const pastPhotos = [...allPhotos]
    .filter((p) => p.date !== todayStr)
    .sort((a, b) => Number(b.createdAt - a.createdAt));

  return (
    <div className="relative z-10 px-4 pt-8 pb-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          type="button"
          data-ocid="photoofday.back_button"
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-95"
          style={CARD_STYLE}
        >
          <span style={{ color: "rgba(255,255,255,0.80)" }}>←</span>
        </button>
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "rgba(255,255,255,0.97)" }}
          >
            Photo of the Day 📸
          </h1>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
            One beautiful moment, every day
          </p>
        </div>
      </motion.div>

      {/* Today's Slot */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border overflow-hidden"
        style={CARD_STYLE}
      >
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌟</span>
            <h2
              className="font-display text-lg font-semibold"
              style={{ color: "rgba(255,255,255,0.97)" }}
            >
              Today
            </h2>
            <span
              className="text-xs ml-auto"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {todayStr}
            </span>
          </div>
        </div>

        {loadingToday ? (
          <div className="px-5 pb-5" data-ocid="photoofday.loading_state">
            <div
              className="h-48 rounded-2xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.10)" }}
            />
          </div>
        ) : todaysPhoto ? (
          <div className="px-5 pb-5">
            <img
              src={todaysPhoto.photo.getDirectURL()}
              alt={todaysPhoto.caption || "Today's photo"}
              className="w-full rounded-2xl object-cover"
              style={{ maxHeight: "280px" }}
            />
            {todaysPhoto.caption && (
              <p
                className="mt-3 text-sm font-medium text-center"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {todaysPhoto.caption}
              </p>
            )}
            <p
              className="text-xs text-center mt-1"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Today's memory is captured ✨
            </p>
          </div>
        ) : (
          <div className="px-5 pb-5 space-y-3">
            {/* Photo picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="photo-upload"
              data-ocid="photoofday.upload_button"
            />
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center gap-3 h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-all active:scale-[0.98]"
              data-ocid="photoofday.dropzone"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                background: previewUrl
                  ? "transparent"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <>
                  <span className="text-4xl">📷</span>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    Tap to add today's photo
                  </p>
                </>
              )}
            </label>

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption... (optional)"
              className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none border"
              data-ocid="photoofday.input"
              style={{
                background: "rgba(255,255,255,0.10)",
                borderColor: "rgba(255,255,255,0.20)",
                color: "rgba(255,255,255,0.92)",
              }}
            />

            <button
              type="button"
              data-ocid="photoofday.submit_button"
              onClick={handleUpload}
              disabled={!photoBytes || addPhoto.isPending}
              className="w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,160,80,0.80), rgba(255,100,60,0.90))",
                color: "#fff",
              }}
            >
              {addPhoto.isPending ? "Saving..." : "Save Today's Photo 📸"}
            </button>
          </div>
        )}
      </motion.div>

      {/* Past Photos Timeline */}
      {pastPhotos.length > 0 && (
        <div className="space-y-3">
          <p
            className="text-xs font-semibold uppercase tracking-widest px-1"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Past Memories
          </p>
          <AnimatePresence>
            {pastPhotos.map((photo, idx) => (
              <motion.div
                key={String(photo.id)}
                data-ocid={`photoofday.item.${idx + 1}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05, duration: 0.35 }}
                className="rounded-3xl border overflow-hidden"
                style={CARD_STYLE}
              >
                <img
                  src={photo.photo.getDirectURL()}
                  alt={photo.caption || `Photo from ${photo.date}`}
                  className="w-full object-cover"
                  style={{ maxHeight: "220px" }}
                />
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      {photo.caption && (
                        <p
                          className="text-sm font-medium"
                          style={{ color: "rgba(255,255,255,0.88)" }}
                        >
                          {photo.caption}
                        </p>
                      )}
                      <p
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {nanoToDate(photo.createdAt).toLocaleDateString(
                          undefined,
                          { month: "long", day: "numeric", year: "numeric" },
                        )}
                      </p>
                    </div>
                    {confirmDeleteId === photo.id ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          data-ocid={`photoofday.delete_button.${idx + 1}`}
                          onClick={() => handleDelete(photo.id)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: "rgba(255,80,80,0.30)",
                            color: "#FFB3B3",
                            border: "1px solid rgba(255,80,80,0.40)",
                          }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: "rgba(255,255,255,0.10)",
                            color: "rgba(255,255,255,0.70)",
                            border: "1px solid rgba(255,255,255,0.20)",
                          }}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        data-ocid={`photoofday.delete_button.${idx + 1}`}
                        onClick={() => setConfirmDeleteId(photo.id)}
                        className="text-xs px-3 py-1.5 rounded-full border"
                        style={{
                          borderColor: "rgba(255,80,80,0.35)",
                          color: "rgba(255,130,130,0.90)",
                          background: "rgba(255,80,80,0.10)",
                        }}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {allPhotos.length === 0 && !loadingToday && (
        <motion.div
          data-ocid="photoofday.empty_state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6"
        >
          <p className="text-3xl mb-2">📷</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            Start capturing your daily moments above!
          </p>
        </motion.div>
      )}
    </div>
  );
}
