import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getInstanceByIdQuery } from '@/apollo/instances'

interface Props {
  // signedIn: string
  id: string | undefined
  userProfileId: string
  setInstance: any
  includeStats: boolean | undefined
}

export default function LoadInstanceById({
                          // signedIn,
                          id,
                          userProfileId,
                          setInstance,
                          includeStats
                        }: Props) {

  // GraphQL
  const [fetchGetInstanceByIdQuery] =
    useLazyQuery(getInstanceByIdQuery, {
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
  async function getInstance() {

    // Query
    const instanceByIdData =
      await fetchGetInstanceByIdQuery(
        {
          variables: {
            id: id,
            userProfileId: userProfileId,
            includeStats: includeStats ? includeStats : false
          }
        })

    setInstance(instanceByIdData.data.instanceById)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getInstance()
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [])

  // Render
  return (
    <></>
  )
}
