import { ExternalBlob } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

const nanoToDate = (ns: bigint) => new Date(Number(ns / 1_000_000n));

export function useGetDaysTogether() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["daysTogether"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDaysTogether();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });
}

export function useGetStartDate() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["startDate"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStartDate();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTodaysPrompt() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["todaysPrompt"],
    queryFn: async () => {
      if (!actor) return "What's one thing you love most about today?";
      return actor.getTodaysPrompt();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useGetAllCheckIns() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["checkIns"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCheckIns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllMessages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMessages();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useGetAllMemories() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["memories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMemories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCheckIn() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      emotion,
      note,
    }: { emotion: string; note: string | null }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addCheckIn(emotion, note);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["checkIns"] }),
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      senderName,
      content,
    }: { senderName: string; content: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.sendMessage(senderName, content);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

export function useAddReaction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      messageId,
      emoji,
    }: { messageId: bigint; emoji: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addReaction(messageId, emoji);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

export function useRemoveReaction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      messageId,
      emoji,
    }: { messageId: bigint; emoji: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeReaction(messageId, emoji);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

export function useAddMemory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
      photoBytes,
    }: {
      title: string;
      content: string;
      photoBytes: Uint8Array | null;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const photo = photoBytes
        ? ExternalBlob.fromBytes(photoBytes as Uint8Array<ArrayBuffer>)
        : null;
      return actor.addMemory(title, content, photo);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
  });
}

export function useSetStartDate() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dateStr: string) => {
      if (!actor) throw new Error("Actor not ready");
      const ts = BigInt(new Date(dateStr).getTime()) * 1_000_000n;
      return actor.setStartDate(ts);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["daysTogether", "startDate"] }),
  });
}

export { nanoToDate };
