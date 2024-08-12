// Assume markdown files only for now

import { useEffect, useState } from 'react'
import ViewMarkdownContent from './markdown/view'
import EditMarkdownContent from './markdown/edit'

interface Props {
  kbFile: string
  kbFileContent: any
  setKbFileContent: any
  editing: boolean
}

export default function ViewFile({
                          kbFile,
                          kbFileContent,
                          setKbFileContent,
                          editing
                        }: Props) {

  // State
  const [text, setText] = useState(kbFileContent != null ? kbFileContent.text : '')

  // Effects
  useEffect(() => {

    // Text lost?
    if (text == null) {
      setText(kbFileContent.text)
      return
    }

    // Update KB file content
    setKbFileContent({
      text: text
    })
  }, [text])

  // Render
  return (
    <>
      {editing === false ?
        <ViewMarkdownContent
          text={text} />
      :
        <EditMarkdownContent
          kbFile={kbFile}
          text={text}
          setText={setText} />
      }
    </>
  )
}
