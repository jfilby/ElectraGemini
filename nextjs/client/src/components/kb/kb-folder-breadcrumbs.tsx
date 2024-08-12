import React from 'react'
import { Breadcrumbs, Link, Typography } from '@mui/material'

interface Props {
  instanceId: string
  currentKbFile: any
  kbFolderBreadcrumbs: any[]
}

export default function KbFolderBreadcrumbs({
                          instanceId,
                          currentKbFile,
                          kbFolderBreadcrumbs
                        }: Props) {

  // Consts
  const kbFileId = currentKbFile != null ? currentKbFile.id : undefined

  // Functions
  const renderSwitch = (kbFolderBreadcrumb: any) => {

    // Render switch in a function: https://stackoverflow.com/a/52618847
    switch (kbFolderBreadcrumb.id) {

      case '':
        return <Link
          href={`/projects`}>
          <Typography variant='body2'>
            {kbFolderBreadcrumb.name}
          </Typography>
        </Link>

      case kbFileId:
        return <Typography variant='body2'>
          {kbFolderBreadcrumb.name}
        </Typography>

      default:
        return <Link
          href={`/instance/${instanceId}/document/${kbFolderBreadcrumb.id}`}>
          <Typography variant='body2'>
            {kbFolderBreadcrumb.name}
          </Typography>
        </Link>
    }
  }

  // Render
  return (
    <>
      {/* <div style={{ display: 'inline-block' }}>
        <Typography variant='body1'>
          Path:&nbsp;
        </Typography>
      </div> */}

      <div style={{ display: 'inline-block' }}>
        <Breadcrumbs maxItems={4}>
          {kbFolderBreadcrumbs.map(kbFolderBreadcrumb => (
            <div key={kbFolderBreadcrumb.id}>
              {renderSwitch(kbFolderBreadcrumb)}
            </div>
        ))}
        </Breadcrumbs>
      </div>
    </>
  )
}
