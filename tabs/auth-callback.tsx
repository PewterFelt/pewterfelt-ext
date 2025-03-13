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

  const getStatusColor = () => {
    if (status.includes("successful")) {
      return "#2e7d32"
    } else if (status.includes("error")) {
      return "#d32f2f"
    } else {
      return "#1976d2"
    }
  }

  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "500px",
        padding: "1.5rem",
        textAlign: "center",
        fontFamily: "sans-serif"
      }}>
      <h2>Pewterfelt Authentication</h2>
      <div
        style={{
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
          borderRadius: "0.5rem",
          backgroundColor: "#f0f2f5",
          padding: "1rem",
          color: getStatusColor()
        }}>
        <p>{status}</p>
      </div>
    </div>
  )
}
