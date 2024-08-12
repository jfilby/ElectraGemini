export class BaseDataTypes {

  // Text formatting
  static textDelimiter = '```'

  // Agent
  static agentName = 'Electra'
  static agentRole = 'Political analyst'

  // Statuses
  static activeStatus = 'A'
  static deletedStatus = 'D'
  static newStatus = 'N'

  // Access types
  static readAccessType = 'R'
  static writeAccessType = 'W'

  // Instance types
  static politicalPartyOrgType = 'P'
  static governmentOrgType = 'G'
  static businessOrgType = 'B'
  static nonProfitOrgType = 'N'

  // Org types
  static demoInstanceType = 'D'
  static realInstanceType = 'R'
  static templateInstanceType = 'T'

  // Instance names (base/templates)
  static electraAiPartyCityTemplate = 'Electra AI party (city template)'
  static electraAiPartyCountryTemplate = 'Electra AI party (country template)'

  // Instance names (demo only)
  static cityTemplateInstanceName = 'City template'
  static countryTemplateInstanceName = 'Country template'
  static electraAiPartyForSouthAfrica = 'Electra AI party (South Africa)'
  static electraAiPartyForUsa = 'Electra AI party (USA)'

  // Language data (some, for fast reference)
  static english = 'English'
  static english3LetterCode = 'eng'
  static english2LetterCode = 'en'

  // Country codes (2 letter)
  static southAfricaName = 'South Africa'
  static usaCountryName = 'United States'

  static southAfrica2LetterCountryCode = 'za'
  static usa2LetterCountryCode = 'us'

  // Legal geo types
  static countryLegalGeoType = 'Country'
  static stateLegalGeoType = 'State'
  static cityLegalGeoType = 'City'
  static districtLegalGeoType = 'District'

  static legalGeoTypes = [
    this.countryLegalGeoType,
    this.stateLegalGeoType,
    this.cityLegalGeoType,
    this.districtLegalGeoType
  ]

  // Template legal geo names
  static cityTemplateLegalGeoName = 'Starter for any city'
  static countryTemplateLegalGeoName = 'Starter for any country'

  // Sources in the system for RAG (abbreviated)
  static kbRagSource = 'KB'

  // KB file extract purposes
  static issueAndProposalGenerationPurpose = 'Issue and proposal generation'

  static kbFileExtractPurposes = [
    this.issueAndProposalGenerationPurpose
  ]

  // News article entry types
  static leadNewsArticleEntryType = 'L'
  static contentNewsArticleEntryType = 'C'

  // Voting systems
  static yesOrNoVotingSystem = 'Yes/No vote'

  // Relations for generic models
  static oneToManyRelation = '1:n'

  // Built-in models
  static issueModel = 'Issue'
  static proposalModel = 'Proposal'

  static builtInModels = [
    this.issueModel,
    this.proposalModel
  ]

  // Built-in features
  static votingFeature = 'Voting'
}
