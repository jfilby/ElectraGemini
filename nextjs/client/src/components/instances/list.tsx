import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { filterInstancesQuery } from '@/apollo/instances'
import ViewInstanceCard from './cards/view'
import { Typography } from '@mui/material'

interface Props {
  orgType: string | undefined
  instanceType: string | undefined
  parentId: string | undefined
  status: string | undefined
  userProfileId: string
}

export default function ListInstances({
                          orgType,
                          instanceType,
                          parentId,
                          status,
                          userProfileId
                        }: Props) {

  // State
  const [instances, setInstances] = useState<any[] | undefined>(undefined)

  // GraphQL
  const [fetchFilterInstancesQuery] =
    useLazyQuery(filterInstancesQuery, {
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
  async function getInstances() {

    // Query
    const filterInstancesData =
      await fetchFilterInstancesQuery(
        {
          variables: {
            orgType: orgType,
            instanceType: instanceType,
            parentId: parentId,
            status: status,
            userProfileId: userProfileId
          }
        })

    setInstances(filterInstancesData.data.filterInstances)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getInstances()
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [])

  // Render
  return (
    <div>
      {instances != null ?
        <>
          {instances.length > 0 ?
            <>
              {instances.map(instance => (
                <ViewInstanceCard
                  key={instance.id}
                  instance={instance}
                  userProfileId={userProfileId} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No instances to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
