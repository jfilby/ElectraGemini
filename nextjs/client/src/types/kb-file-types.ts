export class KbFileTypes {

  // File types by extension/short description

  // Formats
  static directoryFormat = '<DIR>'
  static markdownFormat = 'md'
  static textFormat = 'txt'

  // Text files
  static textFileTypes = [
    this.markdownFormat,
    this.textFormat
  ]

  // File formats by filename ext
  static zipFileFormat = 'zip'
  static tarGzFileFormat = 'tar.gz'

  // Search
  static searchPageSize = 10
}

export class KbFileVersionPropertyData {
  static nameProperty = 'NA'
  static tagsProperty = 'TA'
  static descriptionProperty = 'DE'

  static htmlPromptProperty = 'HP'
  static textPromptProperty = 'TP'

  static audioThumbnail = 'AT'
  static imageThumbnail = 'IT'
  static textThumnnail = 'TX'
  static videoThumbnail = 'VT'
}
