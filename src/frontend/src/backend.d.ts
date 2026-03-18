import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TimeCapsuleWithLockState {
    id: bigint;
    content: string;
    createdAt: bigint;
    authorName: string;
    unlockAt: bigint;
    isUnlocked: boolean;
}
export interface PhotoOfDay {
    id: bigint;
    date: bigint;
    createdAt: bigint;
    caption: string;
    photo: ExternalBlob;
}
export interface QuizAnswer {
    partnerName: string;
    answer: string;
    timestamp: bigint;
    questionId: bigint;
}
export interface CoupleMission {
    id: bigint;
    completedAt: bigint;
    title: string;
    isCompleted: boolean;
    xpReward: bigint;
    description: string;
}
export interface LoveLetter {
    id: bigint;
    title: string;
    content: string;
    createdAt: bigint;
    authorName: string;
}
export interface GalaxyCounts {
    loveLetters: bigint;
    anniversaries: bigint;
    completedMissions: bigint;
    memories: bigint;
}
export interface TimeCapsuleMessage {
    id: bigint;
    content: string;
    createdAt: bigint;
    authorName: string;
    unlockAt: bigint;
}
export interface EmojiReaction {
    count: bigint;
    emoji: string;
}
export interface MemoryVaultEntry {
    id: bigint;
    title: string;
    content: string;
    timestamp: bigint;
    photo?: ExternalBlob;
}
export interface CoupleChallenge {
    id: bigint;
    title: string;
    isCompleted: boolean;
    description: string;
    weekStartTimestamp: bigint;
    currentCount: bigint;
    targetCount: bigint;
}
export interface CheckIn {
    emotion: string;
    note?: string;
    timestamp: bigint;
}
export interface Anniversary {
    id: bigint;
    title: string;
    date: bigint;
    emoji: string;
}
export interface ChatMessage {
    id: bigint;
    content: string;
    timestamp: bigint;
    senderName: string;
    reactions: Array<EmojiReaction>;
    voiceBlob?: ExternalBlob;
}
export interface backendInterface {
    addAnniversary(title: string, date: bigint, emoji: string): Promise<void>;
    addCheckIn(emotion: string, note: string | null): Promise<void>;
    addLoveLetter(title: string, authorName: string, content: string): Promise<void>;
    addMemory(title: string, content: string, photo: ExternalBlob | null): Promise<void>;
    addMission(title: string, description: string, xpReward: bigint): Promise<void>;
    addPhotoOfDay(caption: string, photo: ExternalBlob, date: bigint): Promise<void>;
    addReaction(messageId: bigint, emoji: string): Promise<void>;
    addTimeCapsuleMessage(content: string, authorName: string, unlockAt: bigint): Promise<void>;
    completeMission(missionId: bigint): Promise<void>;
    deleteLoveLetter(id: bigint): Promise<boolean>;
    deleteMemory(memoryId: bigint): Promise<boolean>;
    deleteMessage(id: bigint): Promise<boolean>;
    deletePhotoOfDay(id: bigint): Promise<boolean>;
    getAllAnniversaries(): Promise<Array<Anniversary>>;
    getAllCheckIns(): Promise<Array<CheckIn>>;
    getAllGalaxyItems(): Promise<GalaxyCounts>;
    getAllLoveLetters(): Promise<Array<LoveLetter>>;
    getAllMemories(): Promise<Array<MemoryVaultEntry>>;
    getAllMessages(): Promise<Array<ChatMessage>>;
    getAllMissions(): Promise<Array<CoupleMission>>;
    getAllPhotosOfDay(): Promise<Array<PhotoOfDay>>;
    getAllTimeCapsuleMessages(): Promise<Array<TimeCapsuleWithLockState>>;
    getCoachTipSeed(): Promise<bigint>;
    getCompatibilityScore(): Promise<bigint>;
    getConversationStarterSeed(): Promise<bigint>;
    getCurrentWeekChallenges(): Promise<Array<CoupleChallenge>>;
    getDaysTogether(): Promise<bigint | null>;
    getMoodPrediction(): Promise<boolean>;
    getQuizAnswers(): Promise<Array<QuizAnswer>>;
    getRelationshipLevel(): Promise<bigint>;
    getRelationshipXP(): Promise<bigint>;
    getSeasonalThemeEnabled(): Promise<boolean>;
    getSharedGoal(): Promise<string>;
    getStartDate(): Promise<bigint | null>;
    getStreakCount(): Promise<bigint>;
    getTodaysPhoto(): Promise<PhotoOfDay | null>;
    getTodaysPrompt(): Promise<string>;
    getTotalXP(): Promise<bigint>;
    getUnlockedTimeCapsuleMessages(): Promise<Array<TimeCapsuleMessage>>;
    incrementChallengeProgress(id: bigint): Promise<void>;
    initWeeklyChallenges(): Promise<void>;
    removeAnniversary(id: bigint): Promise<void>;
    removeReaction(messageId: bigint, emoji: string): Promise<void>;
    resetWeeklyChallenges(): Promise<void>;
    sendMessage(senderName: string, content: string): Promise<void>;
    sendVoiceNote(senderName: string, voiceBlob: ExternalBlob): Promise<void>;
    setCoachTipSeed(seed: bigint): Promise<void>;
    setConversationStarterSeed(seed: bigint): Promise<void>;
    setSeasonalThemeEnabled(enabled: boolean): Promise<void>;
    setSharedGoal(goal: string): Promise<void>;
    setStartDate(timestamp: bigint): Promise<void>;
    submitQuizAnswer(questionId: bigint, partnerName: string, answer: string): Promise<void>;
    updateRelationshipLevel(newLevel: bigint): Promise<void>;
}
