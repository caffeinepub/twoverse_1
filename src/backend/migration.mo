import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldChatMessage = {
    id : Nat;
    senderName : Text;
    content : Text;
    timestamp : Int;
    reactions : [OldEmojiReaction];
  };

  type OldEmojiReaction = {
    emoji : Text;
    count : Nat;
  };

  type OldActor = {
    messages : Map.Map<Nat, OldChatMessage>;
    // Other fields are not changed, so we can ignore them for migration
  };

  type NewChatMessage = {
    id : Nat;
    senderName : Text;
    content : Text;
    timestamp : Int;
    reactions : [OldEmojiReaction];
    voiceBlob : ?Storage.ExternalBlob;
  };

  type NewActor = {
    messages : Map.Map<Nat, NewChatMessage>;
    // Other fields remain unchanged
  };

  public func run(old : OldActor) : NewActor {
    let migratedMessages = old.messages.map<Nat, OldChatMessage, NewChatMessage>(
      func(_id, oldMessage) {
        { oldMessage with voiceBlob = null };
      }
    );
    { old with messages = migratedMessages };
  };
};
