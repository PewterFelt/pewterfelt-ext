import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
)

export default function AuthCallback() {
  const [status, setStatus] = useState("Processing authentication...")

  useEffect(() => {
    // Process the auth callback
    const handleAuthCallback = async () => {
      try {
        // The hash contains the token info
        if (window.location.hash) {
          // Process the hash - Supabase can extract the token from URL fragments
          const { data, error } = await supabase.auth.getUser()

          if (error) throw error

          if (data?.user) {
            setStatus("Authentication successful! You can close this tab.")
            // Wait a moment for the UI to update before closing
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
    <div
      style={{
        padding: 24,
        maxWidth: 500,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        textAlign: "center"
      }}>
      <h2>Pewterfelt Authentication</h2>
      <div
        style={{
          margin: "24px 0",
          padding: 16,
          borderRadius: 8,
          background: "#f0f2f5",
          color: status.includes("successful")
            ? "#2e7d32"
            : status.includes("error")
              ? "#d32f2f"
              : "#1976d2"
        }}>
        <p>{status}</p>
      </div>
    </div>
  )
}
