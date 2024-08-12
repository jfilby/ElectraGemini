import React from 'react'
import KbFolderBreadcrumbs from './kb-folder-breadcrumbs'

interface Props {
  instanceId: string
  kbFile: any
  folderBreadcrumbs: any[]
  userProfileId: string
}

export default function KbTopBar({
                          instanceId,
                          kbFile,
                          folderBreadcrumbs,
                          userProfileId
                        }: Props) {

  // Render
  return (
    <div>
      {kbFile != null && folderBreadcrumbs != null ?
        <div style={{ display: 'inline-block', width: '70%' }}>
          <KbFolderBreadcrumbs
            instanceId={instanceId}
            currentKbFile={kbFile}
            kbFolderBreadcrumbs={folderBreadcrumbs} />
        </div>
      :
        <></>
      }
    </div>
  )
}
