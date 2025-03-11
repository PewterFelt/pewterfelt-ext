import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { Loader } from "~loader"
import { Signin } from "~signin"

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

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div
      style={{
        padding: 16,
        width: 300,
        fontFamily: "Arial, sans-serif"
      }}>
      {loading ? (
        <Loader />
      ) : user ? (
        <div
          style={{
            border: "1px solid #e1e4e8",
            borderRadius: 6,
            padding: 16,
            marginBottom: 16
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12
            }}>
            <img
              src={
                user.user_metadata?.avatar_url ||
                "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              }
              alt="Avatar"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                marginRight: 12
              }}
            />
            <div>
              <div style={{ fontWeight: "bold" }}>
                {user.user_metadata?.name ||
                  user.user_metadata?.user_name ||
                  user.email ||
                  "GitHub User"}
              </div>
              <div style={{ fontSize: 12, color: "#6a737d" }}>{user.email}</div>
            </div>
          </div>

          <button
            onClick={signOut}
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
            Sign Out
          </button>
        </div>
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
