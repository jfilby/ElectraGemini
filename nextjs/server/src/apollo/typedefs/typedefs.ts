export const typeDefs = `#graphql

  # Serene Core (types)
  # ---

  type ExistsResults {
    status: Boolean!
    message: String
    exists: Boolean
  }

  type StatusAndMessage {
    status: Boolean!
    message: String
  }

  type StatusAndMessageAndId {
    status: Boolean!
    message: String
    id: String
  }

  type Tip {
    id: String!
    name: String!
    tags: [String]
  }

  type TipsResults {
    status: Boolean!
    message: String
    tips: [Tip]
  }

  type User {
    id: String!
    name: String
  }

  type UserPreference {
    category: String!
    key: String!
    value: String
    values: [String]
  }

  type UserProfile {
    id: String!
    userId: String
    user: User
    isAdmin: Boolean!
  }

  # Serene AI Types
  # ----

  type ChatMessage {
    id: String!
    name: String!
    message: String!
    created: String!
    updated: String
  }

  type ChatMessageResults {
    status: Boolean!
    message: String
    chatMessages: [ChatMessage]
  }

  type ChatParticipant {
    id: String!
    userProfileId: String!
    name: String!
  }

  type ChatParticipantResults {
    status: Boolean!
    message: String
    chatParticipants: [ChatParticipant]
  }

  type ChatSession {
    id: String!
    status: String!
    name: String
    updated: String!
    chatParticipants: [ChatParticipant]
    issue: IssueIdAndName
    proposal: ProposalIdAndName
  }

  type ChatSessionResults {
    status: Boolean!
    message: String
    chatSession: ChatSession
  }

  type Workbook {
    id: String!
    status: String!
  }

  type WorkbookResults {
    status: Boolean!
    message: String
    workbook: Workbook
  }

  # Electra (types)
  # ---

  type IdAndName {
    id: String!
    name: String!
  }

  type Instance {
    id: String!
    parentId: String
    instanceType: String!
    orgType: String!
    status: String!
    legalGeo: LegalGeo!
    defaultLangId: String!
    createdBy: UserProfile!
    name: String!
    stats: InstanceStats
    options: InstanceOptions
  }

  type InstanceOptions {
    countries: [IdAndName]!
  }

  type InstanceOptionsResults {
    status: Boolean!
    message: String
    options: InstanceOptions
  }

  type InstanceStats {
    issuesCount: Int!
    proposalsCount: Int!
  }

  type InstanceShared {
    id: String!
    title: String!
    sharedByName: String!
    clonable: Boolean!
    writable: Boolean!
  }

  type InstanceSharedGroups {
    publicly: InstanceSharedPublicly
    shared: [InstanceShared]
  }

  type InstanceSharedPublicly {
    id: String!
    title: String!
    sharedByName: String!
    pinned: Boolean!
    clonable: Boolean!
  }

  type Issue {
    id: String!
    parentId: String
    instanceId: String!
    kbFile: KbFile
    kbFileContent: KbFileContent
    tags: [IssueTag]
    proposalCount: Int
    proposals: [Proposal]
  }

  type IssueIdAndName {
    id: String!
    name: String!
  }

  type IssueResults {
    status: Boolean!
    message: String
    found: Boolean!
    issue: Issue
  }

  type IssuesResults {
    status: Boolean!
    message: String
    issues: [Issue]
    hasMore: Boolean
    tagOptions: [String]
  }

  type IssueTag {
    issueTagOption: IssueTagOption!
  }

  type IssueTagOption {
    id: String!
    name: String!
  }

  type KbBreadcrumb {
    id: String!
    name: String!
  }

  type KbFile {
    id: String!
    parentId: String
    instanceId: String!
    format: String!
    createdById: String!
    name: String!
    created: String!
    updated: String!
    snippet: String
    acl: KbFileAcl
  }

  type KbFileAcl {
    read: Boolean!
    write: Boolean!
  }

  type KbFileContent {
    text: String
    summary: String
  }

  type KbFileResults {
    status: Boolean!
    message: String
    found: Boolean!
    kbFile: KbFile
    kbFileContent: KbFileContent
    folderFiles: [KbFile]
    folderBreadcrumbs: [KbBreadcrumb]
  }

  type LegalGeo {
    id: String!
    name: String!
    emoji: String
    legalGeoType: LegalGeoType!
  }

  type LegalGeoType {
    name: String!
  }

  type NewsArticle {
    id: String!
    url: String!
    title: String!
    snippet: String
  }

  type NewsArticlesResults {
    status: Boolean!
    message: String
    newsArticles: [NewsArticle]
    hasMore: Boolean!
  }

  type Proposal {
    id: String!
    instanceId: String!
    votes: Int!
    issue: Issue
    tags: [ProposalTag]
    kbFile: KbFile
    kbFileContent: KbFileContent
  }

  type ProposalTag {
    proposalTagOption: ProposalTagOption!
  }

  type ProposalTagOption {
    id: String!
    name: String!
  }

  type ProposalIdAndName {
    id: String!
    name: String!
  }

  type ProposalResults {
    status: Boolean!
    message: String
    found: Boolean!
    proposal: Proposal
  }

  type ProposalsResults {
    status: Boolean!
    message: String
    proposals: [Proposal]
    hasMore: Boolean
  }

  type SearchIssuesResults {
    status: Boolean!
    message: String
    issues: [Issue]
    hasMore: Boolean
  }

  type KbFileResult {
    kbFile: KbFile!
  }

  type SearchKbFilesResults {
    status: Boolean!
    message: String
    results: [KbFileResult]
    hasMore: Boolean
  }

  type SearchProposalsResults {
    status: Boolean!
    message: String
    proposals: [Proposal]
    hasMore: Boolean
  }

  type StatusAndFoundAndMessage {
    status: Boolean!
    found: Boolean!
    message: String
  }

  type UpsertInstanceResults {
    status: Boolean!
    message: String
    instanceId: String
  }

  type VotingResults {
    status: Boolean!
    message: String
    voteOptions: [String]
    voted: String
  }

  # Queries
  # ---

  type Query {

    # Serene Core
    # ---

    # Profile
    validateProfileCompleted(
      forAction: String!,
      userProfileId: String!): StatusAndMessage!

    # Tips
    getTipsByUserProfileIdAndTags(
      userProfileId: String!,
      tags: [String]): TipsResults!

    tipGotItExists(
      name: String!,
      userProfileId: String!): ExistsResults!

    # Users
    isAdminUser(userProfileId: String!): StatusAndMessage!
    userById(userProfileId: String!): UserProfile
    verifySignedInUserProfileId(userProfileId: String!): Boolean

    # User preferences
    getUserPreferences(
      userProfileId: String!,
      category: String!,
      keys: [String]): [UserPreference]

    # Serene AI
    # ---

    # Chats
    getChatMessages(
      chatSessionId: String,
      userProfileId: String!,
      lastMessageId: String): ChatMessageResults!

    getChatParticipants(
      chatSessionId: String,
      userProfileId: String!): ChatParticipantResults!

    getChatSession(
      chatSessionId: String,
      userProfileId: String!): ChatSessionResults!

    getChatSessions(
      status: String,
      userProfileId: String!): [ChatSession]

    # Electra
    # ---

    # Instances
    filterInstances(
      orgType: String,
      instanceType: String,
      parentId: String,
      status: String,
      createdById: String,
      userProfileId: String!): [Instance]

    instanceById(
      id: String!,
      userProfileId: String!,
      includeStats: Boolean!): Instance

    instanceOptions(userProfileId: String!): InstanceOptionsResults

    instanceSharedGroups(
      id: String!,
      userProfileId: String!): [InstanceSharedGroups]

    instancesSharedPublicly: [InstanceSharedGroups]

    # Instance chats
    getInstanceChatSessions(
      instanceId: String!,
      userProfileId: String!,
      status: String): [ChatSession]

    # KB
    kbFileExistsByParentIdAndName(
      parentId: String!,
      name: String!,
      userProfileId: String!): StatusAndFoundAndMessage!

    kbFileById(
      id: String,
      instanceId: String!,
      userProfileId: String!,
      includeAcl: Boolean!,
      includeContents: Boolean!,
      includeFolderFiles: Boolean!,
      includeFolderBreadcrumbs: Boolean!): KbFileResults!

    searchKbFiles(
      instanceId: String!,
      userProfileId: String!,
      status: String!,
      input: String!,
      page: Int!): SearchKbFilesResults!

    # Issues
    filterIssues(
      status: String,
      tag: String,
      page: Int!,
      instanceId: String!,
      userProfileId: String!,
      includeContents: Boolean!): IssuesResults!

    issueById(
      id: String,
      instanceId: String!,
      userProfileId: String!,
      includeContents: Boolean!): IssueResults!

    searchIssues(
      instanceId: String!,
      userProfileId: String!,
      status: String!,
      input: String!,
      page: Int!): SearchIssuesResults!

    # News articles
    searchNewsArticles(
      instanceId: String!,
      userProfileId: String!,
      issueId: String,
      input: String!,
      status: String,
      page: Int!): NewsArticlesResults!

    # Proposals
    filterProposals(
      issueId: String,
      status: String,
      tag: String,
      page: Int!,
      instanceId: String!,
      userProfileId: String!,
      includeContents: Boolean!,
      includeIssues: Boolean!): ProposalsResults!

    proposalById(
      id: String,
      instanceId: String!,
      userProfileId: String!,
      includeContents: Boolean!): ProposalResults!

    searchProposals(
      instanceId: String!,
      userProfileId: String!,
      status: String!,
      input: String!,
      page: Int!): SearchProposalsResults!

    # Voting
    votingByRefId(
      instanceId: String!,
      refModel: String!,
      refId: String!,
      userProfileId: String!): VotingResults!
  }

  type Mutation {

    # Serene Core
    # ---
  
    # Users
    createBlankUser: UserProfile!
    createUserByEmail(email: String!): UserProfile!
    deactivateUserProfileCurrentIFile(id: String!): Boolean
    getOrCreateSignedOutUser(
      signedOutId: String,
      defaultUserPreferences: String): UserProfile!
    getOrCreateUserByEmail(
      email: String!,
      defaultUserPreferences: String): UserProfile!
  
    # Tips
    deleteTipGotIt(
      name: String,
      userProfileId: String!): StatusAndMessage!

    upsertTipGotIt(
      name: String!,
      userProfileId: String!): StatusAndMessage!

    # User preferences
    upsertUserPreference(
      userProfileId: String!,
      category: String!,
      key: String!,
      value: String,
      values: [String]): Boolean

    # Serene AI
    # ---

    # Chats
    getOrCreateChatSession(
      workbookId: String!,
      purpose: String!,
      historicalPurposes: [String],
      userProfileId: String!): ChatSessionResults!

    # Workbooks
    clearWorkbook(
      workbookId: String!,
      userProfileId: String!): StatusAndMessage!

    createWorkbook(
      name: String,
      userProfileId: String!): WorkbookResults!

    # Electra
    # ---

    # Admin
    runBaseDataSetup(userProfileId: String!): StatusAndMessage!
    runDemosSetup(userProfileId: String!): StatusAndMessage!
    runSetup(
      userProfileId: String!,
      createOrUpdateBaseAndDemoData: Boolean!,
      deployVotingSmartContract: Boolean!,
      deleteVotes: Boolean!,
      deleteIssuesAndProposals: Boolean!): StatusAndMessage!

    # Instances
    cloneInstance(
      instanceId: String!,
      userProfileId: String!,
      newName: String): StatusAndMessage!

    deleteInstance(
      instanceId: String!,
      userProfileId: String!): StatusAndMessage!

    deleteInstanceSharedPublicly(
      instanceId: String!,
      userProfileId: String!): StatusAndMessage!

    upsertInstance(
      id: String,
      parentId: String,
      status: String!,
      legalGeoId: String,
      userProfileId: String!,
      name: String): UpsertInstanceResults!

    upsertInstanceSharedPublicly(
      instanceId: String!,
      userProfileId: String!,
      pinned: Boolean,
      clonable: Boolean!): StatusAndMessage!

    # Instance chats
    getOrCreateInstanceChatSession(
      instanceId: String!,
      userProfileId: String!,
      issueId: String,
      proposalId: String,
      chatSessionId: String): ChatSessionResults!

    # KB
    deleteKbFiles(
      kbFileIds: [String]!,
      instanceId: String!,
      userProfileId: String!): StatusAndMessage!

    upsertKbFile(
      kbFileId: String,
      parentId: String,
      instanceId: String,
      publicAccess: String,
      refModel: String,
      format: String,
      name: String,
      userProfileId: String!): StatusAndMessage!

    upsertKbFileContent(
      kbFileId: String,
      instanceId: String,
      text: String,
      summary: String,
      userProfileId: String!): StatusAndMessage!

    # Issues
    deleteIssues(
      issueIds: [String]!,
      instanceId: String!,
      userProfileId: String!): StatusAndMessage!

    upsertIssue(
      issueId: String,
      parentId: String,
      instanceId: String,
      status: String,
      name: String,
      userProfileId: String!): StatusAndMessage!

    # Proposals
    deleteProposals(
      proposalIds: [String]!,
      instanceId: String!,
      userProfileId: String!): StatusAndMessage!

    upsertProposal(
      proposalId: String,
      issueId: String,
      instanceId: String,
      status: String,
      name: String,
      userProfileId: String!): StatusAndMessage!

    # Voting
    upsertVote(
      instanceId: String!,
      refModel: String!,
      refId: String!,
      userProfileId: String!,
      option: String!): StatusAndMessage!
    }
`
