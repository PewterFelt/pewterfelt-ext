import { createClient, type Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { SaveUrl } from "~components/save-url"
import { Signin } from "~components/signin"

import "~style.css"

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
    </div>
  )
}

export default IndexPopup
