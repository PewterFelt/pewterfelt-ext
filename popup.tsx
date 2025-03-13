import { createClient, type Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { SaveUrl } from "~components/save-url"
import { Signin } from "~components/signin"

const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
)

function IndexPopup() {
  const [session, setSession] = useState<Session>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <div
      style={{
        padding: 8,
        width: 300,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff"
      }}>
      {session ? (
        <SaveUrl session={session} />
      ) : (
        <Signin loading={loading} setLoading={setLoading} onSignIn={() => {}} />
      )}

      {/* <div */}
      {/*   style={{ */}
      {/*     borderTop: "1px solid #e1e4e8", */}
      {/*     paddingTop: 16, */}
      {/*     marginTop: 16 */}
      {/*   }}> */}
      {/*   <a */}
      {/*     href="https://docs.plasmo.com" */}
      {/*     target="_blank" */}
      {/*     style={{ */}
      {/*       display: "block", */}
      {/*       textAlign: "center", */}
      {/*       fontSize: 12, */}
      {/*       color: "#0366d6", */}
      {/*       textDecoration: "none" */}
      {/*     }}> */}
      {/*     Extension Documentation */}
      {/*   </a> */}
      {/* </div> */}
    </div>
  )
}

export default IndexPopup
