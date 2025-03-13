import { type Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

type SaveUrlProps = {
  session: Session
}

export const SaveUrl = ({ session }: SaveUrlProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  )
  const [urlInput, setUrlInput] = useState("")

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setUrlInput(tabs[0]?.url || "")
    })
  }, [])

  const handleSaveCurrentUrl = async () => {
    setIsSaving(true)
    setSaveStatus("idle")

    try {
      const response = await fetch("http://localhost:3000/api/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ url: urlInput })
      }).then((res) => res.json())

      console.log("API Response:", response)
      setSaveStatus("success")
    } catch (error) {
      console.error("Error sending URL:", error)
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14
          }}
          placeholder="Enter URL to save"
        />
        <button
          onClick={handleSaveCurrentUrl}
          disabled={isSaving}
          style={{
            padding: "8px",
            background: "#f3f4f6",
            color: "#24292e",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            cursor: isSaving ? "default" : "pointer",
            fontWeight: "bold",
            fontSize: 14,
            opacity: isSaving ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label={isSaving ? "Saving URL" : "Save URL"}>
          {isSaving ? (
            // Loading spinner
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                opacity="0.25"
              />
              <path
                fill="currentColor"
                d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                <animateTransform
                  attributeName="transform"
                  dur="0.75s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </path>
            </svg>
          ) : (
            // Bookmark icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          )}
        </button>
      </div>

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
