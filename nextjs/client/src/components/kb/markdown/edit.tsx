import React, { useRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods
} from '@mdxeditor/editor'

interface Props {
  kbFile: any
  text: string
  setText: any
}

export default function EditMarkdownContent({
                          kbFile,
                          text,
                          setText
                        }: Props) {

  // State
  const ref = useRef<MDXEditorMethods>(null)

  // Render
  return (
    <>
      {kbFile != null ?
        <MDXEditor
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
          ]}
          autoFocus={true}
          markdown={text}
          onChange={(e) => {
            setText(ref.current?.getMarkdown())
          }}
          ref={ref} />
      :
        <>Loading file..</>
      }
    </>
  )
}
