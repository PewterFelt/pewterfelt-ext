/**
 * @see https://github.com/pocketbase/js-sdk#auth-handlers
 * @see https://developer.chrome.com/docs/extensions/reference/api/identity#method-launchWebAuthFlow
 * @see https://developer.chrome.com/docs/extensions/how-to/integrate/oauth
 */

import type PocketBase from "pocketbase"

type SigninProps = {
  pb: PocketBase
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const Signin = ({ pb, loading, setLoading }: SigninProps) => {
  const signInWithGitHub = async () => {
    setLoading(true)

    try {
      const authMethods = await pb.collection("users").listAuthMethods()
      const githubProvider = authMethods.oauth2?.providers?.find(
        (p) => p.name === "github"
      )

      if (!githubProvider)
        throw new Error("GitHub OAuth provider not configured in PocketBase")

      const redirectUrl = chrome.identity.getRedirectURL()

      const responseUrl = await new Promise<string>((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
          {
            url: `${githubProvider.authURL}${encodeURIComponent(redirectUrl)}`,
            interactive: true
          },
          (callbackUrl) => {
            if (chrome.runtime.lastError)
              reject(new Error(chrome.runtime.lastError.message))
            else if (callbackUrl) resolve(callbackUrl)
            else reject(new Error("No callback URL received"))
          }
        )
      })

      const url = new URL(responseUrl)
      const code = url.searchParams.get("code")
      const state = url.searchParams.get("state")

      if (!code) throw new Error("No authorization code received")

      if (state !== githubProvider.state)
        throw new Error("State mismatch - possible CSRF attack")

      await pb
        .collection("users")
        .authWithOAuth2Code(
          "github",
          code,
          githubProvider.codeVerifier,
          redirectUrl
        )
    } catch (error) {
      // TODO: Handle error appropriately
      console.error("Error signing in with GitHub:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={signInWithGitHub}
      disabled={loading}
      className={`plasmo-flex plasmo-w-full plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-rounded-md plasmo-border-none plasmo-bg-[#24292e] plasmo-px-4 plasmo-py-2.5 plasmo-text-sm plasmo-font-bold plasmo-text-white ${
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
