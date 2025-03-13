import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
)

export default function AuthCallback() {
  const [status, setStatus] = useState("Processing authentication...")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (window.location.hash) {
          const { data, error } = await supabase.auth.getUser()

          if (error) throw error

          if (data?.user) {
            setStatus("Authentication successful! You can close this tab.")
            setTimeout(() => {
              window.close()
            }, 2000)
          } else {
            setStatus("Authentication failed. Please try again.")
          }
        } else {
          setStatus("No authentication data found. Please try again.")
        }
      } catch (error) {
        console.error("Error in auth callback:", error)
        setStatus(`Authentication error: ${error.message || "Unknown error"}`)
      }
    }

    handleAuthCallback()
  }, [])

  return (
    <div className="plasmo-p-6 plasmo-max-w-[500px] plasmo-mx-auto plasmo-font-sans plasmo-text-center">
      <h2>Pewterfelt Authentication</h2>
      <div
        className={`plasmo-my-6 plasmo-p-4 plasmo-rounded-lg plasmo-bg-[#f0f2f5] ${
          status.includes("successful")
            ? "plasmo-text-[#2e7d32]"
            : status.includes("error")
              ? "plasmo-text-[#d32f2f]"
              : "plasmo-text-[#1976d2]"
        }`}>
        <p>{status}</p>
      </div>
    </div>
  )
}
