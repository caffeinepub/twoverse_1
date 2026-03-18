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
    refetchOnWindowFocus: true,
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
    staleTime: 1000 * 60 * 60,
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

export function useDeleteMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteMessage(id);
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
    }: { title: string; content: string; photoBytes: Uint8Array | null }) => {
      if (!actor) throw new Error("Actor not ready");
      const photo = photoBytes
        ? ExternalBlob.fromBytes(photoBytes as Uint8Array<ArrayBuffer>)
        : null;
      return actor.addMemory(title, content, photo);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
  });
}

export function useDeleteMemory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteMemory(id);
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

// ---- Phase 2 ----

export function useGetAllMissions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTotalXP() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["totalXP"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getTotalXP();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMission() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      xpReward,
    }: { title: string; description: string; xpReward: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addMission(title, description, xpReward);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["missions"] }),
  });
}

export function useCompleteMission() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (missionId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.completeMission(missionId);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["missions", "totalXP"] }),
  });
}

export function useGetAllTimeCapsuleMessages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["timeCapsules"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTimeCapsuleMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUnlockedTimeCapsuleMessages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["unlockedTimeCapsules"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUnlockedTimeCapsuleMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTimeCapsuleMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      content,
      authorName,
      unlockAt,
    }: { content: string; authorName: string; unlockAt: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addTimeCapsuleMessage(content, authorName, unlockAt);
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["timeCapsules", "unlockedTimeCapsules"],
      }),
  });
}

export function useGetAllAnniversaries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["anniversaries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAnniversaries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAnniversary() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      date,
      emoji,
    }: { title: string; date: bigint; emoji: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addAnniversary(title, date, emoji);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["anniversaries"] }),
  });
}

export function useRemoveAnniversary() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeAnniversary(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["anniversaries"] }),
  });
}

export function useGetQuizAnswers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["quizAnswers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuizAnswers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCompatibilityScore() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["compatibilityScore"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getCompatibilityScore();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitQuizAnswer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      questionId,
      partnerName,
      answer,
    }: { questionId: bigint; partnerName: string; answer: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitQuizAnswer(questionId, partnerName, answer);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["quizAnswers", "compatibilityScore"] }),
  });
}

// ---- Version 9A ----

export function useGetStreakCount() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["streakCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return (actor as any).getStreakCount() as Promise<bigint>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRelationshipXP() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["relationshipXP"],
    queryFn: async () => {
      if (!actor) return 0n;
      return (actor as any).getRelationshipXP() as Promise<bigint>;
    },
    enabled: !!actor && !isFetching,
  });
}

// Love Letters
export function useGetAllLoveLetters() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["loveLetters"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllLoveLetters() as Promise<
        Array<{
          id: bigint;
          title: string;
          content: string;
          authorName: string;
          createdAt: bigint;
        }>
      >;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLoveLetter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      authorName,
      content,
    }: { title: string; authorName: string; content: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).addLoveLetter(title, authorName, content);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loveLetters"] }),
  });
}

export function useDeleteLoveLetter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).deleteLoveLetter(id) as Promise<boolean>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loveLetters"] }),
  });
}

// Photo of the Day
export function useGetAllPhotosOfDay() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["photosOfDay"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllPhotosOfDay() as Promise<
        Array<{
          id: bigint;
          caption: string;
          photo: import("@/backend").ExternalBlob;
          date: string;
          createdAt: bigint;
        }>
      >;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTodaysPhoto() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["todaysPhoto"],
    queryFn: async () => {
      if (!actor) return null;
      const result = (await (actor as any).getTodaysPhoto()) as Array<{
        id: bigint;
        caption: string;
        photo: import("@/backend").ExternalBlob;
        date: string;
        createdAt: bigint;
      }>;
      return result.length > 0 ? result[0] : null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPhotoOfDay() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      caption,
      photoBytes,
      date,
    }: { caption: string; photoBytes: Uint8Array; date: string }) => {
      if (!actor) throw new Error("Actor not ready");
      const photo = ExternalBlob.fromBytes(
        photoBytes as Uint8Array<ArrayBuffer>,
      );
      return (actor as any).addPhotoOfDay(caption, photo, date);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["photosOfDay", "todaysPhoto"] }),
  });
}

export function useDeletePhotoOfDay() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).deletePhotoOfDay(id) as Promise<boolean>;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["photosOfDay", "todaysPhoto"] }),
  });
}

// Couple Challenges
export function useGetCurrentWeekChallenges() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["weeklyChallenges"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getCurrentWeekChallenges() as Promise<
        Array<{
          id: bigint;
          title: string;
          description: string;
          targetCount: bigint;
          currentCount: bigint;
          weekStartTimestamp: bigint;
          isCompleted: boolean;
        }>
      >;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIncrementChallengeProgress() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).incrementChallengeProgress(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeklyChallenges"] }),
  });
}

export function useInitWeeklyChallenges() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).initWeeklyChallenges();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeklyChallenges"] }),
  });
}

export function useResetWeeklyChallenges() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).resetWeeklyChallenges();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeklyChallenges"] }),
  });
}

export { nanoToDate };

export function useGetMoodPrediction() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["moodPrediction"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.getMoodPrediction();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSeasonalThemeEnabled() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["seasonalThemeEnabled"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.getSeasonalThemeEnabled();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetSeasonalThemeEnabled() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setSeasonalThemeEnabled(enabled);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["seasonalThemeEnabled"] }),
  });
}

export function useGetCoachTipSeed() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["coachTipSeed"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCoachTipSeed();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetCoachTipSeed() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (seed: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setCoachTipSeed(seed);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coachTipSeed"] }),
  });
}

export function useGetConversationStarterSeed() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["conversationStarterSeed"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getConversationStarterSeed();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetConversationStarterSeed() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (seed: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setConversationStarterSeed(seed);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["conversationStarterSeed"] }),
  });
}
