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
    <div className="plasmo-text-center plasmo-mb-4">
      <button
        onClick={signInWithGitHub}
        disabled={loading}
        className={`plasmo-w-full plasmo-py-2.5 plasmo-px-4 plasmo-bg-[#24292e] plasmo-text-white plasmo-border-none plasmo-rounded-md plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-font-bold plasmo-text-sm ${
          loading
            ? "plasmo-opacity-70 plasmo-cursor-default"
            : "plasmo-cursor-pointer"
        }`}>
        {loading ? "Opening GitHub..." : "Sign in with GitHub"}
      </button>

      <p className="plasmo-text-xs plasmo-text-[#6a737d] plasmo-mt-2">
        Authentication will open in a new tab
      </p>
    </div>
  )
}
