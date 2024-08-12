import { Link } from '@mui/material'

interface Props {
  name: string | undefined
  linkName: string
  highLevelLink: string
}

export function HeaderBrowserLink({
                  name,
                  linkName,
                  highLevelLink
                }: Props) {

  return (
    <>
      {highLevelLink === linkName ?
        <Link href={`/${linkName}`} style={{ fontWeight: '600' }} underline='hover'>{name}</Link>
      :
        <Link href={`/${linkName}`} underline='hover'>{name}</Link>
      }
    </>
  )
}
