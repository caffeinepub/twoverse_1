import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
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

  module CoupleMission {
    public func compareByCompletedAt(a : CoupleMission, b : CoupleMission) : Order.Order {
      Int.compare(a.completedAt, b.completedAt);
    };
  };

  type CoupleMission = {
    id : Nat;
    title : Text;
    description : Text;
    xpReward : Nat;
    isCompleted : Bool;
    completedAt : Int;
  };

  type TimeCapsuleMessage = {
    id : Nat;
    content : Text;
    authorName : Text;
    createdAt : Int;
    unlockAt : Int;
  };

  type Anniversary = {
    id : Nat;
    title : Text;
    date : Int;
    emoji : Text;
  };

  type QuizAnswer = {
    questionId : Nat;
    partnerName : Text;
    answer : Text;
    timestamp : Int;
  };

  // Stable variables
  var startDate : ?Int = null;
  var nextMessageId = 0;
  var nextMemoryId = 0;
  var nextMissionId = 0;
  var nextTimeCapsuleId = 0;
  var nextAnniversaryId = 0;

  // Data Stores
  let messages = Map.empty<Nat, ChatMessage>();
  let memoryVault = Map.empty<Nat, MemoryVaultEntry>();
  let checkIns = Map.empty<Int, CheckIn>();
  let missions = Map.empty<Nat, CoupleMission>();
  let timeCapsules = Map.empty<Nat, TimeCapsuleMessage>();
  let anniversaries = Map.empty<Nat, Anniversary>();
  let quizAnswers = List.empty<QuizAnswer>();

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
    "Share a challenge you''ve overcome together.",
    "Write a list of places you want to visit together.",
    "Share your favorite meal together.",
    "Describe a perfect day spent together.",
    "Share a movie that reminds you of your partner.",
    "Write a list of things you want to do for your partner.",
    "Share a time your partner made you feel special.",
    "Describe your partner''s best qualities.",
    "Share a quote that represents your relationship.",
    "Write a list of surprises you want to do for your partner.",
    "Share your favorite way to spend time together.",
    "Describe a difficult moment you''ve overcome as a couple.",
    "Share a book or story you want to read together.",
    "Write a list of things you want to try together.",
    "Share a message to your future selves.",
    "Describe your vision for your relationship in 5 years.",
  ];

  // 1. Existing functionality
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
        if (add and reaction.count < 4294967295) {
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

  public shared ({ caller }) func deleteMemory(memoryId : Nat) : async Bool {
    switch (memoryVault.get(memoryId)) {
      case (null) { false };
      case (?memory) {
        memoryVault.remove(memoryId);
        true;
      };
    };
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

  // New features

  // 2. Couple Missions (Each mission is with a status, not repeating, tracks xp)
  public shared ({ caller }) func addMission(title : Text, description : Text, xpReward : Nat) : async () {
    let mission : CoupleMission = {
      id = nextMissionId;
      title;
      description;
      xpReward;
      isCompleted = false;
      completedAt = 0;
    };
    missions.add(nextMissionId, mission);
    nextMissionId += 1;
  };

  public shared ({ caller }) func completeMission(missionId : Nat) : async () {
    switch (missions.get(missionId)) {
      case (null) { Runtime.trap("Mission not found") };
      case (?mission) {
        if (mission.isCompleted) { Runtime.trap("Mission already completed") };
        let updatedMission = {
          id = mission.id;
          title = mission.title;
          description = mission.description;
          xpReward = mission.xpReward;
          isCompleted = true;
          completedAt = Time.now();
        };
        missions.add(missionId, updatedMission);
      };
    };
  };

  public query ({ caller }) func getAllMissions() : async [CoupleMission] {
    // Return sorted by completedAt, nulls first
    let ordered = missions.values().toArray().sort(CoupleMission.compareByCompletedAt);
    ordered;
  };

  public query ({ caller }) func getTotalXP() : async Nat {
    var totalXP = 0;
    for (mission in missions.values()) {
      if (mission.isCompleted) {
        totalXP += mission.xpReward;
      };
    };
    totalXP;
  };

  // 3. Time Capsule Messages (future unlock date)
  public shared ({ caller }) func addTimeCapsuleMessage(content : Text, authorName : Text, unlockAt : Int) : async () {
    let message : TimeCapsuleMessage = {
      id = nextTimeCapsuleId;
      content;
      authorName;
      createdAt = Time.now();
      unlockAt;
    };
    timeCapsules.add(nextTimeCapsuleId, message);
    nextTimeCapsuleId += 1;
  };

  public query ({ caller }) func getUnlockedTimeCapsuleMessages() : async [TimeCapsuleMessage] {
    let now = Time.now();
    let items = timeCapsules.values().toArray();
    let unlocked = items.filter(
      func(msg) {
        msg.unlockAt <= now;
      }
    );
    unlocked;
  };

  type TimeCapsuleWithLockState = {
    id : Nat;
    content : Text;
    authorName : Text;
    createdAt : Int;
    unlockAt : Int;
    isUnlocked : Bool;
  };

  public query ({ caller }) func getAllTimeCapsuleMessages() : async [TimeCapsuleWithLockState] {
    let now = Time.now();
    let items = timeCapsules.values().toArray();
    let mapped = items.map(
      func(msg) {
        {
          id = msg.id;
          content = msg.content;
          authorName = msg.authorName;
          createdAt = msg.createdAt;
          unlockAt = msg.unlockAt;
          isUnlocked = msg.unlockAt <= now;
        };
      }
    );
    mapped;
  };

  // 4. Custom Anniversaries
  public shared ({ caller }) func addAnniversary(title : Text, date : Int, emoji : Text) : async () {
    let anniversary : Anniversary = {
      id = nextAnniversaryId;
      title;
      date;
      emoji;
    };
    anniversaries.add(nextAnniversaryId, anniversary);
    nextAnniversaryId += 1;
  };

  public query ({ caller }) func getAllAnniversaries() : async [Anniversary] {
    anniversaries.values().toArray();
  };

  public shared ({ caller }) func removeAnniversary(id : Nat) : async () {
    anniversaries.remove(id);
  };

  // 5. Couple Quiz
  public shared ({ caller }) func submitQuizAnswer(questionId : Nat, partnerName : Text, answer : Text) : async () {
    let quizAnswer : QuizAnswer = {
      questionId;
      partnerName;
      answer;
      timestamp = Time.now();
    };
    quizAnswers.add(quizAnswer);
  };

  public query ({ caller }) func getQuizAnswers() : async [QuizAnswer] {
    quizAnswers.toArray();
  };

  public query ({ caller }) func getCompatibilityScore() : async Nat {
    var score = 100; // Start at 100%
    score;
  };
};
