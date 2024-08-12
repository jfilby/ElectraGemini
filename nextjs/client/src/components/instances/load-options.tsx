import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getInstanceOptionsQuery } from '@/apollo/instances'

interface Props {
  userProfileId: string
  setOptions: any
}

export default function LoadInstanceOptions({
                          userProfileId,
                          setOptions
                        }: Props) {

  // GraphQL
  const [fetchGetInstanceOptionsQuery] =
    useLazyQuery(getInstanceOptionsQuery, {
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
    const instanceOptions =
      await fetchGetInstanceOptionsQuery(
        {
          variables: {
            userProfileId: userProfileId
          }
        })

    setOptions(instanceOptions.data.instanceOptions.options)
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
