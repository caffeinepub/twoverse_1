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
export interface CheckIn {
    emotion: string;
    note?: string;
    timestamp: bigint;
}
export interface ChatMessage {
    id: bigint;
    content: string;
    timestamp: bigint;
    senderName: string;
    reactions: Array<EmojiReaction>;
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
    addCheckIn(emotion: string, note: string | null): Promise<void>;
    addMemory(title: string, content: string, photo: ExternalBlob | null): Promise<void>;
    addReaction(messageId: bigint, emoji: string): Promise<void>;
    getAllCheckIns(): Promise<Array<CheckIn>>;
    getAllMemories(): Promise<Array<MemoryVaultEntry>>;
    getAllMessages(): Promise<Array<ChatMessage>>;
    getDaysTogether(): Promise<bigint | null>;
    getStartDate(): Promise<bigint | null>;
    getTodaysPrompt(): Promise<string>;
    removeReaction(messageId: bigint, emoji: string): Promise<void>;
    sendMessage(senderName: string, content: string): Promise<void>;
    setStartDate(timestamp: bigint): Promise<void>;
}
