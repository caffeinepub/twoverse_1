import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
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

  module PhotoOfDay {
    public func compareByDate(a : PhotoOfDay, b : PhotoOfDay) : Order.Order {
      Int.compare(b.date, a.date);
    };
  };

  module LoveLetter {
    public func compareByCreatedAt(a : LoveLetter, b : LoveLetter) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  module LovePulse {
    public func compareByTimestamp(a : LovePulse, b : LovePulse) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
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
    voiceBlob : ?Storage.ExternalBlob;
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

  type LoveLetter = {
    id : Nat;
    title : Text;
    content : Text;
    authorName : Text;
    createdAt : Int;
  };

  type PhotoOfDay = {
    id : Nat;
    caption : Text;
    photo : Storage.ExternalBlob;
    date : Int;
    createdAt : Int;
  };

  type CoupleChallenge = {
    id : Nat;
    title : Text;
    description : Text;
    targetCount : Nat;
    currentCount : Nat;
    weekStartTimestamp : Int;
    isCompleted : Bool;
  };

  type GalaxyCounts = {
    memories : Nat;
    completedMissions : Nat;
    loveLetters : Nat;
    anniversaries : Nat;
  };

  type LovePulse = {
    id : Nat;
    senderName : Text;
    timestamp : Int;
  };

  type RelationshipDNA = {
    topEmotions : [Text];
    bondPersonality : Text;
    totalMessages : Nat;
    totalMemories : Nat;
    totalCheckIns : Nat;
    completedMissions : Nat;
    currentStreak : Nat;
  };

  // --- Stable scalar variables ---
  stable var startDate : ?Int = null;
  stable var nextMessageId : Nat = 0;
  stable var nextMemoryId : Nat = 0;
  stable var nextMissionId : Nat = 0;
  stable var nextTimeCapsuleId : Nat = 0;
  stable var nextAnniversaryId : Nat = 0;
  stable var nextLoveLetterId : Nat = 0;
  stable var nextPhotoOfDayId : Nat = 0;
  stable var nextLovePulseId : Nat = 0;
  stable var sharedGoal : Text = "";
  stable var streakCount : Nat = 0;
  stable var lastStreakDay : Int = -1;
  stable var relationshipLevel : Nat = 1;
  stable var coachTipSeed : Nat = 0;
  stable var conversationStarterSeed : Nat = 0;
  stable var seasonalThemeEnabled : Bool = true;

  // --- Stable backup arrays for Maps/Lists ---
  stable var stableMessages : [(Nat, ChatMessage)] = [];
  stable var stableMemoryVault : [(Nat, MemoryVaultEntry)] = [];
  stable var stableCheckIns : [(Int, CheckIn)] = [];
  stable var stableMissions : [(Nat, CoupleMission)] = [];
  stable var stableTimeCapsules : [(Nat, TimeCapsuleMessage)] = [];
  stable var stableAnniversaries : [(Nat, Anniversary)] = [];
  stable var stableQuizAnswers : [QuizAnswer] = [];
  stable var stableLoveLetters : [(Nat, LoveLetter)] = [];
  stable var stablePhotosOfDay : [(Nat, PhotoOfDay)] = [];
  stable var stableChallenges : [(Nat, CoupleChallenge)] = [];
  stable var stableLovePulses : [(Nat, LovePulse)] = [];

  // --- In-memory working Maps ---
  let messages = Map.empty<Nat, ChatMessage>();
  let memoryVault = Map.empty<Nat, MemoryVaultEntry>();
  let checkIns = Map.empty<Int, CheckIn>();
  let missions = Map.empty<Nat, CoupleMission>();
  let timeCapsules = Map.empty<Nat, TimeCapsuleMessage>();
  let anniversaries = Map.empty<Nat, Anniversary>();
  let quizAnswers = List.empty<QuizAnswer>();
  let loveLetters = Map.empty<Nat, LoveLetter>();
  let photosOfDay = Map.empty<Nat, PhotoOfDay>();
  let challenges = Map.empty<Nat, CoupleChallenge>();
  let lovePulses = Map.empty<Nat, LovePulse>();

  // --- Upgrade hooks ---
  system func preupgrade() {
    stableMessages := messages.entries().toArray();
    stableMemoryVault := memoryVault.entries().toArray();
    stableCheckIns := checkIns.entries().toArray();
    stableMissions := missions.entries().toArray();
    stableTimeCapsules := timeCapsules.entries().toArray();
    stableAnniversaries := anniversaries.entries().toArray();
    stableQuizAnswers := quizAnswers.toArray();
    stableLoveLetters := loveLetters.entries().toArray();
    stablePhotosOfDay := photosOfDay.entries().toArray();
    stableChallenges := challenges.entries().toArray();
    stableLovePulses := lovePulses.entries().toArray();
  };

  system func postupgrade() {
    for ((k, v) in stableMessages.values()) { messages.add(k, v) };
    for ((k, v) in stableMemoryVault.values()) { memoryVault.add(k, v) };
    for ((k, v) in stableCheckIns.values()) { checkIns.add(k, v) };
    for ((k, v) in stableMissions.values()) { missions.add(k, v) };
    for ((k, v) in stableTimeCapsules.values()) { timeCapsules.add(k, v) };
    for ((k, v) in stableAnniversaries.values()) { anniversaries.add(k, v) };
    for (v in stableQuizAnswers.values()) { quizAnswers.add(v) };
    for ((k, v) in stableLoveLetters.values()) { loveLetters.add(k, v) };
    for ((k, v) in stablePhotosOfDay.values()) { photosOfDay.add(k, v) };
    for ((k, v) in stableChallenges.values()) { challenges.add(k, v) };
    for ((k, v) in stableLovePulses.values()) { lovePulses.add(k, v) };
    // Free stable memory after restore
    stableMessages := [];
    stableMemoryVault := [];
    stableCheckIns := [];
    stableMissions := [];
    stableTimeCapsules := [];
    stableAnniversaries := [];
    stableQuizAnswers := [];
    stableLoveLetters := [];
    stablePhotosOfDay := [];
    stableChallenges := [];
    stableLovePulses := [];
    // Re-init challenges if empty
    if (challenges.isEmpty()) {
      initChallenges();
    };
  };

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

  let coachTips : [Text] = [
    "Listen actively to your partner's needs.",
    "Make time for regular date nights.",
    "Express appreciation daily.",
    "Practice forgiveness and understanding.",
    "Communicate openly and honestly.",
    "Celebrate small victories together.",
    "Support each other's growth.",
    "Show affection in little ways.",
    "Respect each other's differences.",
    "Keep learning about each other.",
  ];

  let conversationStarters : [Text] = [
    "What's a dream you haven't shared with many people?",
    "What's something you'd like to learn together?",
    "What's the best advice you've ever received?",
    "What's your favorite memory from our relationship?",
    "If you could travel anywhere right now, where would you go?",
    "What's a goal you want to achieve this year?",
    "What's something you're grateful for today?",
    "What's a talent you wish you had?",
    "What's your favorite way to relax together?",
    "What's a challenge you want to overcome together?",
  ];

  let levelThresholds = [
    (1, 0),
    (2, 500),
    (3, 1500),
    (4, 3000),
    (5, 5000),
    (6, 7500),
    (7, 10500),
    (8, 14000),
    (9, 18000),
    (10, 22500),
    (11, 27500),
    (12, 33000),
    (13, 39000),
    (14, 45500),
    (15, 52500),
  ];

  func initChallenges() {
    if (challenges.isEmpty()) {
      let defaultChallenges : [(Nat, Text, Text, Nat)] = [
        (0, "Sweet Messages", "Send 5 sweet messages to each other this week", 5),
        (1, "Memory Makers", "Add 2 new memories to your vault this week", 2),
        (2, "Check-In Champions", "Complete 5 daily check-ins this week", 5),
        (3, "Mission Accomplished", "Complete 1 couple mission together", 1),
        (4, "Love Letters", "Write a love letter to your partner", 1),
      ];
      let weekStart = (Time.now() / (7 * 24 * 60 * 60 * 1000000000)) * (7 * 24 * 60 * 60 * 1000000000);
      for ((id, title, desc, target) in defaultChallenges.values()) {
        let c : CoupleChallenge = {
          id;
          title;
          description = desc;
          targetCount = target;
          currentCount = 0;
          weekStartTimestamp = weekStart;
          isCompleted = false;
        };
        challenges.add(id, c);
      };
    };
  };

  // Initialize challenges on first deploy
  do { initChallenges() };

  // 1. Core functionality
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

  public shared ({ caller }) func setSharedGoal(goal : Text) : async () {
    sharedGoal := goal;
  };

  public query ({ caller }) func getSharedGoal() : async Text {
    sharedGoal;
  };

  public shared ({ caller }) func sendMessage(senderName : Text, content : Text) : async () {
    let message : ChatMessage = {
      id = nextMessageId;
      senderName;
      content;
      timestamp = Time.now();
      reactions = [];
      voiceBlob = null;
    };
    messages.add(nextMessageId, message);
    nextMessageId += 1;
  };

  public shared ({ caller }) func sendVoiceNote(senderName : Text, voiceBlob : Storage.ExternalBlob) : async () {
    let message : ChatMessage = {
      id = nextMessageId;
      senderName;
      content = "";
      timestamp = Time.now();
      reactions = [];
      voiceBlob = ?voiceBlob;
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
          voiceBlob = message.voiceBlob;
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
          voiceBlob = message.voiceBlob;
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
      case (?_) {
        memoryVault.remove(memoryId);
        true;
      };
    };
  };

  public shared ({ caller }) func addCheckIn(emotion : Text, note : ?Text) : async () {
    let now = Time.now();
    let checkIn : CheckIn = {
      emotion;
      note;
      timestamp = now;
    };
    checkIns.add(now, checkIn);

    let todayDay = now / (24 * 60 * 60 * 1000000000);
    if (lastStreakDay == todayDay) {
      // same day, no change
    } else if (lastStreakDay == todayDay - 1) {
      streakCount += 1;
      lastStreakDay := todayDay;
    } else {
      streakCount := 1;
      lastStreakDay := todayDay;
    };
  };

  public query ({ caller }) func getAllCheckIns() : async [CheckIn] {
    checkIns.values().toArray();
  };

  public query ({ caller }) func getStreakCount() : async Nat {
    streakCount;
  };

  public query ({ caller }) func getTodaysPrompt() : async Text {
    let dayIndex = (Time.now() / (24 * 60 * 60 * 1000000000)) % 30;
    dailyPrompts[Int.abs(dayIndex)];
  };

  // Couple Missions
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
    missions.values().toArray();
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

  public query ({ caller }) func getRelationshipXP() : async Nat {
    var xp = 0;
    for (mission in missions.values()) {
      if (mission.isCompleted) {
        xp += mission.xpReward;
      };
    };
    xp += checkIns.size() * 10;
    xp += messages.size() * 2;
    xp += memoryVault.size() * 25;
    xp += streakCount * 5;
    xp;
  };

  // Time Capsule
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
    items.filter(func(msg) { msg.unlockAt <= now });
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
    timeCapsules.values().toArray().map(
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
  };

  // Anniversaries
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

  public query ({ caller }) func getAllGalaxyItems() : async GalaxyCounts {
    let memoriesCount = memoryVault.size();
    var completedMissions = 0;
    for (mission in missions.values()) {
      if (mission.isCompleted) {
        completedMissions += 1;
      };
    };
    let loveLetterCount = loveLetters.size();
    let anniversaryCount = anniversaries.size();
    {
      memories = memoriesCount;
      completedMissions;
      loveLetters = loveLetterCount;
      anniversaries = anniversaryCount;
    };
  };

  public shared ({ caller }) func removeAnniversary(id : Nat) : async () {
    anniversaries.remove(id);
  };

  // Quiz
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
    100;
  };

  // Chat delete
  public shared ({ caller }) func deleteMessage(id : Nat) : async Bool {
    let existed = messages.containsKey(id);
    messages.remove(id);
    existed;
  };

  // Love Letters
  public shared ({ caller }) func addLoveLetter(title : Text, authorName : Text, content : Text) : async () {
    let letter : LoveLetter = {
      id = nextLoveLetterId;
      title;
      content;
      authorName;
      createdAt = Time.now();
    };
    loveLetters.add(nextLoveLetterId, letter);
    nextLoveLetterId += 1;
  };

  public query ({ caller }) func getAllLoveLetters() : async [LoveLetter] {
    loveLetters.values().toArray();
  };

  public shared ({ caller }) func deleteLoveLetter(id : Nat) : async Bool {
    let existed = loveLetters.containsKey(id);
    loveLetters.remove(id);
    existed;
  };

  // Photo of the Day
  public shared ({ caller }) func addPhotoOfDay(caption : Text, photo : Storage.ExternalBlob, date : Int) : async () {
    let entry : PhotoOfDay = {
      id = nextPhotoOfDayId;
      caption;
      photo;
      date;
      createdAt = Time.now();
    };
    photosOfDay.add(nextPhotoOfDayId, entry);
    nextPhotoOfDayId += 1;
  };

  public query ({ caller }) func getAllPhotosOfDay() : async [PhotoOfDay] {
    photosOfDay.values().toArray();
  };

  public shared ({ caller }) func deletePhotoOfDay(id : Nat) : async Bool {
    let existed = photosOfDay.containsKey(id);
    photosOfDay.remove(id);
    existed;
  };

  public query ({ caller }) func getTodaysPhoto() : async ?PhotoOfDay {
    let todayDay = Time.now() / (24 * 60 * 60 * 1000000000);
    for (photo in photosOfDay.values()) {
      let photoDay = photo.date / (24 * 60 * 60 * 1000000000);
      if (photoDay == todayDay) {
        return ?photo;
      };
    };
    null;
  };

  // Couple Challenges
  public shared ({ caller }) func initWeeklyChallenges() : async () {
    initChallenges();
  };

  public query ({ caller }) func getCurrentWeekChallenges() : async [CoupleChallenge] {
    challenges.values().toArray();
  };

  public shared ({ caller }) func incrementChallengeProgress(id : Nat) : async () {
    switch (challenges.get(id)) {
      case (null) { Runtime.trap("Challenge not found") };
      case (?c) {
        if (c.isCompleted) { return };
        let newCount = c.currentCount + 1;
        let updated : CoupleChallenge = {
          id = c.id;
          title = c.title;
          description = c.description;
          targetCount = c.targetCount;
          currentCount = newCount;
          weekStartTimestamp = c.weekStartTimestamp;
          isCompleted = newCount >= c.targetCount;
        };
        challenges.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func resetWeeklyChallenges() : async () {
    let weekStart = (Time.now() / (7 * 24 * 60 * 60 * 1000000000)) * (7 * 24 * 60 * 60 * 1000000000);
    for ((id, c) in challenges.entries()) {
      let reset : CoupleChallenge = {
        id = c.id;
        title = c.title;
        description = c.description;
        targetCount = c.targetCount;
        currentCount = 0;
        weekStartTimestamp = weekStart;
        isCompleted = false;
      };
      challenges.add(id, reset);
    };
  };

  // Relationship Level
  public query ({ caller }) func getRelationshipLevel() : async Nat {
    relationshipLevel;
  };

  public shared ({ caller }) func updateRelationshipLevel(newLevel : Nat) : async () {
    relationshipLevel := newLevel;
  };

  public query ({ caller }) func getCoachTipSeed() : async Nat {
    coachTipSeed;
  };

  public shared ({ caller }) func setCoachTipSeed(seed : Nat) : async () {
    coachTipSeed := seed;
  };

  public query ({ caller }) func getConversationStarterSeed() : async Nat {
    conversationStarterSeed;
  };

  public shared ({ caller }) func setConversationStarterSeed(seed : Nat) : async () {
    conversationStarterSeed := seed;
  };

  // Mood Prediction
  public query ({ caller }) func getMoodPrediction() : async Bool {
    if (checkIns.isEmpty()) {
      return false;
    };

    let currentTime = Time.now();
    let sevenDaysInTicks : Int = 7 * 24 * 60 * 60 * 1000000000;

    let recentChecks = checkIns.values().toArray().reverse().filter(
      func(check) {
        currentTime - check.timestamp <= sevenDaysInTicks;
      }
    );

    let limitedChecks = recentChecks.sliceToArray(
      0,
      if (recentChecks.size() > 5) { 5 } else { recentChecks.size() },
    );

    let negativeMoods = ["sad", "tired", "stressed"];
    var negativeCount = 0;

    for (check in limitedChecks.values()) {
      if (negativeMoods.any(func(emotion) { check.emotion == emotion })) {
        negativeCount += 1;
      };
    };

    negativeCount >= 3;
  };

  public query ({ caller }) func getSeasonalThemeEnabled() : async Bool {
    seasonalThemeEnabled;
  };

  public shared ({ caller }) func setSeasonalThemeEnabled(enabled : Bool) : async () {
    seasonalThemeEnabled := enabled;
  };

  // Love Pulse
  public shared ({ caller }) func sendLovePulse(senderName : Text) : async () {
    let pulse : LovePulse = {
      id = nextLovePulseId;
      senderName;
      timestamp = Time.now();
    };
    lovePulses.add(nextLovePulseId, pulse);
    nextLovePulseId += 1;
  };

  public query ({ caller }) func getLovePulses() : async [LovePulse] {
    let all = lovePulses.values().toArray().sort(LovePulse.compareByTimestamp);
    if (all.size() > 20) {
      all.sliceToArray(0, 20);
    } else {
      all;
    };
  };

  // Relationship DNA
  public query ({ caller }) func getRelationshipDNA() : async RelationshipDNA {
    let allCheckIns = checkIns.values().toArray();
    let totalCheckIns = allCheckIns.size();

    var happyCount = 0;
    var lovingCount = 0;
    var excitedCount = 0;
    var calmCount = 0;
    var tiredCount = 0;
    var sadCount = 0;
    var stressedCount = 0;
    var gratefulCount = 0;

    for (c in allCheckIns.values()) {
      if (c.emotion == "happy") { happyCount += 1 }
      else if (c.emotion == "loving") { lovingCount += 1 }
      else if (c.emotion == "excited") { excitedCount += 1 }
      else if (c.emotion == "calm") { calmCount += 1 }
      else if (c.emotion == "tired") { tiredCount += 1 }
      else if (c.emotion == "sad") { sadCount += 1 }
      else if (c.emotion == "stressed") { stressedCount += 1 }
      else if (c.emotion == "grateful") { gratefulCount += 1 };
    };

    let emotionCounts : [(Text, Nat)] = [
      ("happy", happyCount),
      ("loving", lovingCount),
      ("excited", excitedCount),
      ("calm", calmCount),
      ("grateful", gratefulCount),
      ("tired", tiredCount),
      ("sad", sadCount),
      ("stressed", stressedCount),
    ];

    let sorted = emotionCounts.sort(func(a, b) { Nat.compare(b.1, a.1) });
    let top3 = sorted.sliceToArray(0, if (sorted.size() >= 3) { 3 } else { sorted.size() });
    let topEmotions = top3.map(func(e : (Text, Nat)) : Text { e.0 });

    let totalMemoriesCount = memoryVault.size();
    let totalMessagesCount = messages.size();
    var completedMissionsCount = 0;
    for (m in missions.values()) {
      if (m.isCompleted) { completedMissionsCount += 1 };
    };

    let bondPersonality = if (excitedCount + happyCount > totalCheckIns / 2 and totalMemoriesCount > 3) {
      "Adventurous Duo"
    } else if (lovingCount + gratefulCount > totalCheckIns / 3) {
      "Deeply Devoted"
    } else if (calmCount > totalCheckIns / 4 and totalMessagesCount > 10) {
      "Cozy Homebodies"
    } else if (completedMissionsCount > 2) {
      "Mission Masters"
    } else if (totalMessagesCount > 20) {
      "Deep Connectors"
    } else {
      "Growing Together"
    };

    {
      topEmotions;
      bondPersonality;
      totalMessages = totalMessagesCount;
      totalMemories = totalMemoriesCount;
      totalCheckIns;
      completedMissions = completedMissionsCount;
      currentStreak = streakCount;
    };
  };
};
