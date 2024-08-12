import React from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor
} from '@mdxeditor/editor'
import { Typography } from '@mui/material'

interface Props {
  text: string
}

export default function ViewMarkdownContent({
                          text
                        }: Props) {

  // Render
  return (
    <>
      {text === '' ?
        <Typography variant='body1'>
          Empty file
        </Typography>
      :
        <></>
      }

      {text != null ?
        <MDXEditor
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
          ]}
          markdown={text}
          readOnly={true} />
      :
        <>Loading file..</>
      }
    </>
  )
}
