import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { Loader } from "~components/loader"
import { Signin } from "~components/signin"

const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
)

function IndexPopup() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signInWithGitHub = async () => {
    setLoading(true)

    try {
      const extensionCallbackUrl = chrome.runtime.getURL(
        "tabs/auth-callback.html"
      )

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          skipBrowserRedirect: true,
          redirectTo: extensionCallbackUrl
        }
      })

      if (error) throw error

      if (data?.url) {
        chrome.tabs.create({ url: data.url })
      } else {
        throw new Error("No authentication URL returned from Supabase")
      }
    } catch (error) {
      console.error("Error signing in with GitHub:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleShowCurrentTabUrl = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const url = tabs[0]?.url || "Unable to get URL"

      try {
        const {
          data: { session }
        } = await supabase.auth.getSession()
        if (!session) {
          console.error("No active session")
          return
        }

        const response = await fetch("http://localhost:3000/api/link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ url })
        }).then((res) => res.json())

        console.log("API Response:", response)
      } catch (error) {
        console.error("Error sending URL:", error)
      }
    })
  }

  return (
    <div
      style={{
        padding: 0,
        width: 300,
        fontFamily: "Arial, sans-serif"
      }}>
      {loading ? (
        <Loader />
      ) : user ? (
        <button
          onClick={handleShowCurrentTabUrl}
          style={{
            width: "100%",
            padding: "8px 12px",
            background: "#f3f4f6",
            color: "#24292e",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 14
          }}>
          Show Current Tab URL
        </button>
      ) : (
        <Signin loading={loading} signInWithGitHub={signInWithGitHub} />
      )}

      <div style={{ borderTop: "1px solid #e1e4e8", paddingTop: 16 }}>
        <a
          href="https://docs.plasmo.com"
          target="_blank"
          style={{
            display: "block",
            textAlign: "center",
            fontSize: 12,
            color: "#0366d6",
            textDecoration: "none"
          }}>
          Extension Documentation
        </a>
      </div>
    </div>
  )
}

export default IndexPopup
