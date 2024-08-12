import PageHeader from './header'
import Footer from './footer'

interface Props {
  children: React.ReactNode
  projectName?: string | null
  ownerName?: string | null
  userProfileId: string | undefined
}

export const pageBodyWidth = '54em'
export const columnBodyWidth = '40em'

export default function Layout({
                          children,
                          projectName = null,
                          ownerName = null,
                          userProfileId
                        }: Props) {

  // Render
  return (
    <>
      <PageHeader userProfileId={userProfileId} />

      {projectName != null ?
        <div style={{ textAlign: 'center' }}>
          <h3>
            {projectName}
            {ownerName != null ?
              <>
                &nbsp;
                <span style={{ fontWeight: '400' }}>(owner: {ownerName})</span>
              </>
            :
              <></>
            }
          </h3>
        </div>
      :
        <></>
      }

      <div style={{ marginBottom: '2.5em' }} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
