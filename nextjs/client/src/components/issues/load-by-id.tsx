import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getIssueByIdQuery } from '../../apollo/issues'

interface Props {
  instanceId: string
  userProfileId: string
  issueId: string
  setIssue: any
  setKbFileContent: any
  setProposals: any
  refresh: boolean
  setRefresh: any
}

export default function LoadIssueById({
                          instanceId,
                          userProfileId,
                          issueId,
                          setIssue,
                          setKbFileContent,
                          setProposals,
                          refresh,
                          setRefresh
                        }: Props) {

  // GraphQL
  const [fetchIssueByIdQuery] =
    useLazyQuery(getIssueByIdQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('elementName: ' + elementName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function getIssueById() {

    // Debug
    const fnName = `getIssueById()`

    // console.log(`${fnName}: issueId: ${issueId}`)

    // Query
    const getIssueByIdData =
      await fetchIssueByIdQuery(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            id: issueId,
            includeContents: true
          }
        })

    // Set results
    const results = getIssueByIdData.data.issueById

    setIssue(results.issue)
    setKbFileContent(results.issue.kbFileContent)
    setProposals(results.issue.proposals)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getIssueById()
    }

    // Only proceed if refresh is true
    if (refresh === false) {
      return
    } else {
      setRefresh(false)
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [refresh])

  // Render
  return (
    <></>
  )
}
