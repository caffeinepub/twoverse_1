import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  module ChatMessage {
    public func compareByTimestamp(a : ChatMessage, b : ChatMessage) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module MemoryVaultEntry {
    public func compareByTimestamp(a : MemoryVaultEntry, b : MemoryVaultEntry) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type EmojiReaction = {
    emoji : Text;
    count : Nat;
  };

  type ChatMessage = {
    id : Nat;
    senderName : Text;
    content : Text;
    timestamp : Int;
    reactions : [EmojiReaction];
  };

  type MemoryVaultEntry = {
    id : Nat;
    title : Text;
    content : Text;
    photo : ?Storage.ExternalBlob;
    timestamp : Int;
  };

  type CheckIn = {
    emotion : Text;
    note : ?Text;
    timestamp : Int;
  };

  var startDate : ?Int = null;
  var nextMessageId = 0;
  var nextMemoryId = 0;

  let messages = Map.empty<Nat, ChatMessage>();
  let memoryVault = Map.empty<Nat, MemoryVaultEntry>();
  let checkIns = Map.empty<Int, CheckIn>();

  let dailyPrompts : [Text] = [
    "Share a favorite memory from your relationship.",
    "Describe your perfect date together.",
    "What are three things you love most about your partner?",
    "Share a song that reminds you of each other.",
    "Write a love letter to your partner.",
    "Describe your dream vacation together.",
    "Share a funny story from your relationship.",
    "Write a poem about your love.",
    "Share a goal you want to achieve together.",
    "Describe your partner using only three words.",
    "Share your favorite photo together.",
    "Write a list of things you appreciate about your partner.",
    "Share your favorite tradition as a couple.",
    "Describe your first impression of each other.",
    "Share a challenge you've overcome together.",
    "Write a list of places you want to visit together.",
    "Share your favorite meal together.",
    "Describe a perfect day spent together.",
    "Share a movie that reminds you of your partner.",
    "Write a list of things you want to do for your partner.",
    "Share a time your partner made you feel special.",
    "Describe your partner's best qualities.",
    "Share a quote that represents your relationship.",
    "Write a list of surprises you want to do for your partner.",
    "Share your favorite way to spend time together.",
    "Describe a difficult moment you've overcome as a couple.",
    "Share a book or story you want to read together.",
    "Write a list of things you want to try together.",
    "Share a message to your future selves.",
    "Describe your vision for your relationship in 5 years.",
  ];

  public shared ({ caller }) func setStartDate(timestamp : Int) : async () {
    startDate := ?timestamp;
  };

  public query ({ caller }) func getStartDate() : async ?Int {
    startDate;
  };

  public query ({ caller }) func getDaysTogether() : async ?Int {
    switch (startDate) {
      case (null) { null };
      case (?date) {
        let now = Time.now();
        let days = (now - date) / (24 * 60 * 60 * 1000000000);
        ?days;
      };
    };
  };

  public shared ({ caller }) func sendMessage(senderName : Text, content : Text) : async () {
    let message : ChatMessage = {
      id = nextMessageId;
      senderName;
      content;
      timestamp = Time.now();
      reactions = [];
    };
    messages.add(nextMessageId, message);
    nextMessageId += 1;
  };

  public query ({ caller }) func getAllMessages() : async [ChatMessage] {
    messages.values().toArray().sort(ChatMessage.compareByTimestamp);
  };

  func updateReactions(message : ChatMessage, emoji : Text, add : Bool) : [EmojiReaction] {
    var found = false;
    let updatedReactions = List.empty<EmojiReaction>();

    for (reaction in message.reactions.values()) {
      if (reaction.emoji == emoji) {
        found := true;
        if (add) {
          updatedReactions.add({
            emoji = reaction.emoji;
            count = reaction.count + 1;
          });
        } else if (reaction.count > 0) {
          updatedReactions.add({
            emoji = reaction.emoji;
            count = reaction.count - 1;
          });
        };
      } else {
        updatedReactions.add(reaction);
      };
    };

    if (add and not found) {
      updatedReactions.add({ emoji; count = 1 });
    };

    updatedReactions.toArray();
  };

  public shared ({ caller }) func addReaction(messageId : Nat, emoji : Text) : async () {
    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?message) {
        let updatedReactions = updateReactions(message, emoji, true);
        let updatedMessage = {
          id = message.id;
          senderName = message.senderName;
          content = message.content;
          timestamp = message.timestamp;
          reactions = updatedReactions;
        };
        messages.add(messageId, updatedMessage);
      };
    };
  };

  public shared ({ caller }) func removeReaction(messageId : Nat, emoji : Text) : async () {
    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?message) {
        let updatedReactions = updateReactions(message, emoji, false);
        let updatedMessage = {
          id = message.id;
          senderName = message.senderName;
          content = message.content;
          timestamp = message.timestamp;
          reactions = updatedReactions;
        };
        messages.add(messageId, updatedMessage);
      };
    };
  };

  public shared ({ caller }) func addMemory(title : Text, content : Text, photo : ?Storage.ExternalBlob) : async () {
    let memory : MemoryVaultEntry = {
      id = nextMemoryId;
      title;
      content;
      photo;
      timestamp = Time.now();
    };
    memoryVault.add(nextMemoryId, memory);
    nextMemoryId += 1;
  };

  public query ({ caller }) func getAllMemories() : async [MemoryVaultEntry] {
    memoryVault.values().toArray().sort(MemoryVaultEntry.compareByTimestamp);
  };

  public shared ({ caller }) func addCheckIn(emotion : Text, note : ?Text) : async () {
    let checkIn : CheckIn = {
      emotion;
      note;
      timestamp = Time.now();
    };
    checkIns.add(Time.now(), checkIn);
  };

  public query ({ caller }) func getAllCheckIns() : async [CheckIn] {
    checkIns.values().toArray();
  };

  public query ({ caller }) func getTodaysPrompt() : async Text {
    let dayIndex = (Time.now() / (24 * 60 * 60 * 1000000000)) % 30;
    dailyPrompts[Int.abs(dayIndex)];
  };
};
