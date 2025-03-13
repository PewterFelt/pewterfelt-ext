import { BookmarkSimple, SpinnerGap } from "@phosphor-icons/react"
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
      <div className="plasmo-flex plasmo-gap-2 plasmo-items-center">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="plasmo-flex-1 plasmo-px-3 plasmo-py-2 plasmo-bg-[#909EAE]/10 plasmo-rounded-md plasmo-text-sm"
          placeholder="Enter URL to save"
        />
        <button
          onClick={handleSaveCurrentUrl}
          disabled={isSaving}
          className={`plasmo-p-2 plasmo-bg-[#f4a261]/20 plasmo-border plasmo-border-[#f4a261] hover:plasmo-bg-[#f4a261]/25 plasmo-rounded-full plasmo-flex plasmo-items-center plasmo-justify-center ${
            isSaving
              ? "plasmo-opacity-70 plasmo-cursor-default"
              : "plasmo-cursor-pointer"
          }`}
          aria-label={isSaving ? "Saving URL" : "Save URL"}>
          {isSaving ? (
            <SpinnerGap
              weight="duotone"
              className="plasmo-animate-spin"
              size={20}
              color="#f4a261"
            />
          ) : (
            <BookmarkSimple weight="duotone" size={20} color="#f4a261" />
          )}
        </button>
      </div>

      {saveStatus === "success" && (
        <p className="plasmo-text-green-600 plasmo-text-xs plasmo-text-center plasmo-mt-2">
          URL saved successfully!
        </p>
      )}

      {saveStatus === "error" && (
        <p className="plasmo-text-red-600 plasmo-text-xs plasmo-text-center plasmo-mt-2">
          Error saving URL. Please try again.
        </p>
      )}
    </div>
  )
}
