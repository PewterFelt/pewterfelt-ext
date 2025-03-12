import { type Session } from "@supabase/supabase-js"
import { useState } from "react"

type SaveUrlProps = {
  session: Session
}

export const SaveUrl = ({ session }: SaveUrlProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  )

  const handleSaveCurrentUrl = async () => {
    setIsSaving(true)
    setSaveStatus("idle")

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const url = tabs[0]?.url

      try {
        const response = await fetch("http://localhost:3000/api/link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ url })
        }).then((res) => res.json())

        console.log("API Response:", response)
        setSaveStatus("success")
      } catch (error) {
        console.error("Error sending URL:", error)
        setSaveStatus("error")
      } finally {
        setIsSaving(false)
      }
    })
  }

  return (
    <div>
      <button
        onClick={handleSaveCurrentUrl}
        disabled={isSaving}
        style={{
          width: "100%",
          padding: "8px 12px",
          background: "#f3f4f6",
          color: "#24292e",
          border: "1px solid #d1d5db",
          borderRadius: 6,
          cursor: isSaving ? "default" : "pointer",
          fontWeight: "bold",
          fontSize: 14,
          opacity: isSaving ? 0.7 : 1
        }}>
        {isSaving ? "Saving..." : "Save Current Tab URL"}
      </button>

      {saveStatus === "success" && (
        <p
          style={{
            color: "green",
            fontSize: 12,
            textAlign: "center",
            marginTop: 8
          }}>
          URL saved successfully!
        </p>
      )}

      {saveStatus === "error" && (
        <p
          style={{
            color: "red",
            fontSize: 12,
            textAlign: "center",
            marginTop: 8
          }}>
          Error saving URL. Please try again.
        </p>
      )}
    </div>
  )
}
