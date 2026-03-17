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
export interface CoupleMission {
    id: bigint;
    completedAt: bigint;
    title: string;
    isCompleted: boolean;
    xpReward: bigint;
    description: string;
}
export interface QuizAnswer {
    partnerName: string;
    answer: string;
    timestamp: bigint;
    questionId: bigint;
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
export interface backendInterface {
    addAnniversary(title: string, date: bigint, emoji: string): Promise<void>;
    addCheckIn(emotion: string, note: string | null): Promise<void>;
    addMemory(title: string, content: string, photo: ExternalBlob | null): Promise<void>;
    addMission(title: string, description: string, xpReward: bigint): Promise<void>;
    addReaction(messageId: bigint, emoji: string): Promise<void>;
    addTimeCapsuleMessage(content: string, authorName: string, unlockAt: bigint): Promise<void>;
    completeMission(missionId: bigint): Promise<void>;
    getAllAnniversaries(): Promise<Array<Anniversary>>;
    getAllCheckIns(): Promise<Array<CheckIn>>;
    getAllMemories(): Promise<Array<MemoryVaultEntry>>;
    getAllMessages(): Promise<Array<ChatMessage>>;
    getAllMissions(): Promise<Array<CoupleMission>>;
    getAllTimeCapsuleMessages(): Promise<Array<TimeCapsuleWithLockState>>;
    getCompatibilityScore(): Promise<bigint>;
    getDaysTogether(): Promise<bigint | null>;
    getQuizAnswers(): Promise<Array<QuizAnswer>>;
    getStartDate(): Promise<bigint | null>;
    getTodaysPrompt(): Promise<string>;
    getTotalXP(): Promise<bigint>;
    getUnlockedTimeCapsuleMessages(): Promise<Array<TimeCapsuleMessage>>;
    removeAnniversary(id: bigint): Promise<void>;
    removeReaction(messageId: bigint, emoji: string): Promise<void>;
    sendMessage(senderName: string, content: string): Promise<void>;
    setStartDate(timestamp: bigint): Promise<void>;
    submitQuizAnswer(questionId: bigint, partnerName: string, answer: string): Promise<void>;
}
