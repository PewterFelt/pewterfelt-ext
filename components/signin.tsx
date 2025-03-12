import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
)

type SigninProps = {
  loading: boolean
  setLoading: (loading: boolean) => void
  onSignIn: () => void
}

export const Signin = ({ loading, setLoading, onSignIn }: SigninProps) => {
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
        onSignIn()
      } else {
        throw new Error("No authentication URL returned from Supabase")
      }
    } catch (error) {
      console.error("Error signing in with GitHub:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      <button
        onClick={signInWithGitHub}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px 16px",
          background: "#24292e",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontWeight: "bold",
          fontSize: 14,
          opacity: loading ? 0.7 : 1
        }}>
        {loading ? "Opening GitHub..." : "Sign in with GitHub"}
      </button>

      <p style={{ fontSize: 12, color: "#6a737d", marginTop: 8 }}>
        Authentication will open in a new tab
      </p>
    </div>
  )
}
