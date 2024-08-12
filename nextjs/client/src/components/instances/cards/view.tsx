import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { Alert, Divider, Link, Typography } from '@mui/material'
import { BaseDataTypes } from '../../../types/base-data-types'
import DeleteInstanceDialog from '../delete-dialog'
import UndeleteInstanceDialog from '../undelete-dialog'
import SaveInstance from '../save'

interface Props {
  instance: any
  userProfileId: string
}

export default function ViewInstanceCard({
                          instance,
                          userProfileId
                        }: Props) {

  // Consts
  const url = `/instance/${instance.id}`

  // State
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [undeleteDialogOpen, setUndeleteDialogOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState(false)
  const [undeleteAction, setUndeleteAction] = useState(false)
  const [save, setSave] = useState(false)
  const [instanceStatus, setInstanceStatus] = useState(instance.status)

  // Effects
  useEffect(() => {

    if (status === true) {
      setInstanceStatus(instanceStatus)
    }

  }, [status])

  useEffect(() => {

    if (deleteAction === true) {
      setInstanceStatus(BaseDataTypes.deletedStatus)
      setSave(true)
      setDeleteAction(false)
    }

  }, [deleteAction])

  useEffect(() => {

    if (undeleteAction === true) {
      setInstanceStatus(BaseDataTypes.activeStatus)
      setSave(true)
      setUndeleteAction(false)
    }

  }, [undeleteAction])

  // Render
  return (
    <div style={{ marginTop: '2em', minWidth: 275 }}>

      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      <div style={{ marginBottom: '2em' }}>
        <div
          style={{ display: 'inline-block', width: '50%' }}>

          {instanceStatus === BaseDataTypes.activeStatus ?
            <Link href={url}>
              <Typography variant='h6'>
                {instance.name}
              </Typography>
            </Link>
          :
            <>
              <Typography
                style={{ color: 'gray' }}
                variant='h6'>
                {instance.name}
              </Typography>
              <Typography
                style={{ color: 'gray' }}
                variant='body2'>
                <i>Deleted</i>
              </Typography>
            </>
          }

          <Typography
            style={{ marginBottom: '1em' }}
            variant='body1'>
            {instance.legalGeo.emoji} {instance.legalGeo.name}
          </Typography>

          {instance.createdByName != null ?
            <>{instance.createdByName}</>
          :
            <></>}
        </div>

        <div style={{ display: 'inline-block', textAlign: 'right', width: '50%' }}>

          {instance.instanceType === BaseDataTypes.realInstanceType &&
           instance.createdBy.id === userProfileId ?

            <div>
              <EditIcon
                onClick={(e) => window.location.href = `/instance/${instance.id}/edit`}
                style={{ cursor: 'pointer', marginRight: '1em' }} />

              <>
                {instanceStatus === BaseDataTypes.activeStatus ?
                  <DeleteIcon
                    onClick={(e) => setDeleteDialogOpen(true)}
                    style={{ cursor: 'pointer' }} />
                :
                  <RestoreFromTrashIcon
                    onClick={(e) => setUndeleteDialogOpen(true)}
                    style={{ cursor: 'pointer' }} />
                }
              </>
            </div>
          :
            <></>
          }
        </div>
      </div>

      <Divider variant='fullWidth' />

      <SaveInstance
        instanceId={instance.id}
        userProfileId={userProfileId}
        status={instanceStatus}
        name={undefined}
        legalGeoId={undefined}
        save={save}
        setSave={setSave}
        setStatus={setStatus}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage} />

      <DeleteInstanceDialog
        open={deleteDialogOpen}
        name={instance.name}
        setOpen={setDeleteDialogOpen}
        setDeleteConfirmed={setDeleteAction} />

      <UndeleteInstanceDialog
        open={undeleteDialogOpen}
        name={instance.name}
        setOpen={setUndeleteDialogOpen}
        setUndeleteConfirmed={setUndeleteAction} />

    </div>
  )
}
