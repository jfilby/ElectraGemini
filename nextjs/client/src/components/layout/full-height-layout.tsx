import PageHeader from './header'
import Footer from './footer'

interface Props {
  children: React.ReactNode
  projectName?: string | null
  ownerName?: string | null
  userProfileId: string | undefined
}

export const pageBodyWidthPlus = '60em'
export const pageBodyWidth = '54em'
export const columnBodyWidth = '40em'

export default function FullHeightLayout({
                          children,
                          projectName = null,
                          ownerName = null,
                          userProfileId
                        }: Props) {

  // Render
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '100%' }}>
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

      <div style={{ marginBottom: '1em' }} />
      <main>{children}</main>
      <Footer />
      </div>
    </div>
  )
}
