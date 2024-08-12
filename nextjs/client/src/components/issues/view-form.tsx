// Currently unused, may be useful as a delete confirm page
import { useState } from 'react'
import ViewTextField from '@/serene-core-client/components/basics/view-text-field'

interface Props {
  instanceId: string
  userProfileId: string
  issue: any
}

export default function ViewIssueForm({
                          instanceId,
                          userProfileId,
                          issue
                        }: Props) {

  // State
  const [name, setName] = useState('')

  // Render
  return (
    <>
      <ViewTextField
        label='Name'
        value={issue.kbFile.name} />

      <br/>
    </>
  )
}
