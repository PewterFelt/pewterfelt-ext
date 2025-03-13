import { BookmarkSimple, SpinnerGap } from "@phosphor-icons/react"
import { type Session, type SupabaseClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

type SaveUrlProps = {
  supabase: SupabaseClient
  session: Session
}

export const SaveUrl = ({ supabase, session }: SaveUrlProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  )
  const [urlInput, setUrlInput] = useState("")
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setUrlInput(tabs[0]?.url || "")
    })
  }, [])

  useEffect(() => {
    if (!urlInput) return

    setIsLoading(true)
    ;(async () => {
      try {
        const { data: linkData, error: linkError } = await supabase
          .from("links")
          .select()
          .eq("url", urlInput)

        if (linkError || !linkData) {
          setIsBookmarked(false)
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("user_link")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("link_id", linkData[0].id)

        setIsBookmarked(!!data && !error)
        setIsLoading(false)
      } catch (error) {
        setIsBookmarked(false)
        setIsLoading(false)
      }
    })()
  }, [urlInput, session.user.id])

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
      setIsBookmarked(true)
    } catch (error) {
      console.error("Error sending URL:", error)
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="plasmo-bg-pewter-gray/10 plasmo-flex-1 plasmo-rounded-md plasmo-px-4 plasmo-py-2.5 plasmo-text-sm"
          placeholder="Enter URL to save"
        />
        <button
          onClick={handleSaveCurrentUrl}
          disabled={isSaving || isLoading}
          className={`plasmo-flex plasmo-items-center plasmo-justify-center plasmo-rounded-full plasmo-border plasmo-border-pewter-orange plasmo-bg-pewter-orange/20 plasmo-p-2 hover:plasmo-bg-pewter-orange/25 ${
            isSaving
              ? "plasmo-cursor-default plasmo-opacity-70"
              : "plasmo-cursor-pointer"
          }`}
          aria-label={isSaving ? "Saving URL" : "Save URL"}>
          {isSaving || isLoading ? (
            <SpinnerGap
              weight="duotone"
              className="plasmo-animate-spin"
              size={20}
              color="#f4a261"
            />
          ) : (
            <BookmarkSimple
              weight={isBookmarked ? "fill" : "duotone"}
              size={20}
              color="#f4a261"
            />
          )}
        </button>
      </div>

      {saveStatus === "success" && (
        <p className="plasmo-text-green-600 plasmo-mt-2 plasmo-text-center plasmo-text-xs">
          URL saved successfully!
        </p>
      )}

      {saveStatus === "error" && (
        <p className="plasmo-text-red-600 plasmo-mt-2 plasmo-text-center plasmo-text-xs">
          Error saving URL. Please try again.
        </p>
      )}
    </div>
  )
}
