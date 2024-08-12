import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getProposalByIdQuery } from '../../apollo/proposals'

interface Props {
  instanceId: string
  userProfileId: string
  proposalId: string
  setProposal: any
  setKbFileContent: any
  refresh: boolean
  setRefresh: any
}

export default function LoadProposalById({
                          instanceId,
                          userProfileId,
                          proposalId,
                          setProposal,
                          setKbFileContent,
                          refresh,
                          setRefresh
                        }: Props) {

  // GraphQL
  const [fetchProposalByIdQuery] =
    useLazyQuery(getProposalByIdQuery, {
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
  async function getProposalById() {

    // Debug
    const fnName = `getProposalById()`

    // Query
    const getProposalByIdData =
      await fetchProposalByIdQuery(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            id: proposalId,
            includeContents: true
          }
        })

    // Set results
    const results = getProposalByIdData.data.proposalById

    setProposal(results.proposal)
    setKbFileContent(results.proposal.kbFileContent)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getProposalById()
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
