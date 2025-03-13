import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
)

type SigninProps = {
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const Signin = ({ loading, setLoading }: SigninProps) => {
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

  return (
    <button
      onClick={signInWithGitHub}
      disabled={loading}
      className={`plasmo-text-white plasmo-flex plasmo-w-full plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-rounded-md plasmo-border-none plasmo-bg-[#24292e] plasmo-px-4 plasmo-py-2.5 plasmo-text-sm plasmo-font-bold ${
        loading
          ? "plasmo-cursor-default plasmo-opacity-70"
          : "plasmo-cursor-pointer"
      }`}>
      <span className="plasmo-text-white">
        {loading ? "Opening GitHub..." : "Sign in with GitHub"}
      </span>
    </button>
  )
}
