import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import Grid from '@mui/material/Grid'
import { HeaderBrowser } from './header-browser'
import { HeaderMobile } from './header-mobile'
// import SystemAlert from '../alerts/system-alert'

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
interface Props {
  userProfileId: string | undefined
}

export default function PageHeader({ userProfileId }: Props) {
  /* const { data: session, status } = useSession()
  const loading = status === "loading" */

  // Consts
  const index = 'index'

  // isMobile can't be used directly, see: https://stackoverflow.com/a/66421155
  const [_isMobile, setMobile] = useState<boolean|undefined>(undefined)
  const [highLevelLink, setHighLevelLink] = useState<string|undefined>(undefined)

  function setMenuLink() {

    const paths = window.location.pathname.split('/')

    // console.log(paths)

    if (paths.length >= 2) {
      var highLevelPaths: string[] = []

      for (var i = paths.length - 1; i > 0; i--) {
        highLevelPaths.unshift(paths[i])
      }

      const thisHighLevelLink = highLevelPaths.join('/')

      setHighLevelLink(thisHighLevelLink)
    } else {
      setHighLevelLink(index)
    }
  }

  useEffect(() => {

    // Set isMobile
    setMobile(isMobile)

    // Set current menu link
    setMenuLink()
  }, [setMobile])

  return (
    <>
      <Grid container style={{ background: '#f6f6f6', borderBottom: '1px solid #aaa', paddingLeft: '1em', paddingRight: '1em' }}>
        <header style={{ textAlign: 'center', width: '100%' }}>
          {/* <noscript>
            <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
          </noscript> */}

        {_isMobile == null ||
         highLevelLink == null ?
          <></>
        :
          <>
            {_isMobile === false ?
              <HeaderBrowser highLevelLink={highLevelLink} />
            :
              <HeaderMobile highLevelLink={highLevelLink} />
            }
          </>
        }

        </header>
      </Grid>
      {/* <SystemAlert userProfileId={userProfileId} /> */}
    </>
  )
}
