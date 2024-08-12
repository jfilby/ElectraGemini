// Serene Core imports
import { isAdminUser } from '@/serene-core-server/apollo/resolvers/queries/access'
// import { deleteTipGotIt, upsertTipGotIt } from '@/serene-core-server/apollo/resolvers/mutations/tips'
// import { getTipsByUserProfileIdAndTags, tipGotItExists } from '@/serene-core-server/apollo/resolvers/queries/tips'
import { createBlankUser, createUserByEmail, getOrCreateSignedOutUser, getOrCreateUserByEmail } from '@/serene-core-server/apollo/resolvers/mutations/users'
import { userById, verifySignedInUserProfileId } from '@/serene-core-server/apollo/resolvers/queries/users'
import { getUserPreferences } from '@/serene-core-server/apollo/resolvers/queries/user-preferences'
import { upsertUserPreference } from '@/serene-core-server/apollo/resolvers/mutations/user-preferences'
import { validateProfileCompleted } from '@/serene-core-server/apollo/resolvers/queries/profile'

// Serene AI query imports
import { getChatMessages } from '@/serene-ai-server/apollo/resolvers/queries/chats'

// Serene AI mutations imports
import { getOrCreateChatSession } from '@/serene-ai-server/apollo/resolvers/mutations/chats'

// Electra queries imports
import { filterInstances, instanceById, instanceOptions, instanceSharedGroups, instancesSharedPublicly } from './queries/instances'
import { getInstanceChatSessions } from './queries/instance-chats'
import { kbFileById, kbFileExistsByParentIdAndName, searchKbFiles } from './queries/kb'
import { filterIssues, issueById, searchIssues } from './queries/issues'
import { filterProposals, proposalById, searchProposals } from './queries/proposals'
import { searchNewsArticles } from './queries/news-articles'
import { votingByRefId } from './queries/voting'

// Electra mutations imports
import { runSetup } from './mutations/admin'
import { cloneInstance, deleteInstance, deleteInstanceSharedPublicly, upsertInstance, upsertInstanceSharedPublicly } from './mutations/instances'
import { deleteKbFiles, upsertKbFile, upsertKbFileContent } from './mutations/kb'
import { getOrCreateInstanceChatSession } from './mutations/instance-chats'
import { deleteIssues, upsertIssue } from './mutations/issues'
import { deleteProposals, upsertProposal } from './mutations/proposals'
import { upsertVote } from './mutations/voting'


// Code
const Query = {

  // Serene AI
  // ---

  // Chats
  getChatMessages,
  // getChatParticipants,
  // getChatSession,

  // Serene Core
  // ---

  // Profile
  validateProfileCompleted,

  // Tips
  // getTipsByUserProfileIdAndTags,
  // tipGotItExists,

  // Users
  isAdminUser,
  userById,
  verifySignedInUserProfileId,

  // User preferences
  getUserPreferences,

  // Serene AI
  // ---

  // Electra
  // ---

  // Chats
  getInstanceChatSessions,

  // Instances
  filterInstances,
  instanceById,
  instanceOptions,
  instanceSharedGroups,
  instancesSharedPublicly,

  // Issues
  filterIssues,
  issueById,
  searchIssues,

  // KB files
  kbFileExistsByParentIdAndName,
  kbFileById,
  searchKbFiles,

  // News articles
  searchNewsArticles,

  // Proposals
  filterProposals,
  proposalById,
  searchProposals,

  // Voting
  votingByRefId
}

const Mutation = {

  // Serene AI
  // ---

  // Chats
  // getOrCreateChatSession,

  // Serene Core
  // ---

  // Tips
  // deleteTipGotIt,
  // upsertTipGotIt,

  // Users
  createBlankUser,
  createUserByEmail,
  getOrCreateSignedOutUser,
  getOrCreateUserByEmail,

  // User preferences
  upsertUserPreference,

  // Serene AI
  // ---

  // Chats
  getOrCreateChatSession,

  // Electra
  // ---

  // Admin
  runSetup,

  // Instances
  cloneInstance,
  deleteInstance,
  deleteInstanceSharedPublicly,
  upsertInstance,
  upsertInstanceSharedPublicly,

  // Instance chats
  getOrCreateInstanceChatSession,

  // Issues
  deleteIssues,
  upsertIssue,

  // KB files
  deleteKbFiles,
  upsertKbFile,
  upsertKbFileContent,

  // Proposals
  deleteProposals,
  upsertProposal,

  // Voting
  upsertVote
}

const resolvers = { Query, Mutation }

export default resolvers
