import {
  BookmarkSimpleIcon,
  CheckCircleIcon,
  SpinnerGapIcon,
  XCircleIcon
} from "@phosphor-icons/react"
import type PocketBase from "pocketbase"
import { type RecordModel } from "pocketbase"
import { useEffect, useState } from "react"

type SaveUrlProps = {
  pb: PocketBase
  session: RecordModel
}

export const SaveUrl = ({ pb, session }: SaveUrlProps) => {
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
        const linkRecords = await pb
          .collection("links")
          .getList(1, 1, { filter: `url = "${urlInput}"` })

        if (linkRecords.items.length === 0) {
          setIsBookmarked(false)
          setIsLoading(false)
          return
        }

        const bookmarkRecords = await pb.collection("bookmarks").getList(1, 1, {
          filter: `user_id = "${session.id}" && link_id = "${linkRecords.items[0].id}"`
        })

        setIsBookmarked(bookmarkRecords.items.length > 0)
        setIsLoading(false)
      } catch (error) {
        setIsBookmarked(false)
        setIsLoading(false)
      }
    })()
  }, [urlInput, session.id])

  const handleSaveCurrentUrl = async () => {
    setIsSaving(true)
    setSaveStatus("idle")

    try {
      const response = await fetch(
        `${process.env.PLASMO_PUBLIC_API_URL}/api/link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${pb.authStore.token}`
          },
          body: JSON.stringify({ url: urlInput })
        }
      ).then((res) => res.json())

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
          className="plasmo-flex-1 plasmo-rounded-md plasmo-bg-pewter-gray/10 plasmo-px-4 plasmo-py-2.5 plasmo-text-sm"
          placeholder="Enter URL to save"
        />
        <button
          onClick={handleSaveCurrentUrl}
          disabled={isSaving || isLoading}
          className={`plasmo-flex plasmo-items-center plasmo-justify-center plasmo-rounded-full plasmo-border plasmo-p-2 ${
            isSaving
              ? "plasmo-cursor-default plasmo-opacity-70"
              : "plasmo-cursor-pointer"
          } ${
            saveStatus === "success"
              ? "plasmo-border-[#2e7d32] plasmo-bg-[#2e7d32]/20 hover:plasmo-bg-[#2e7d32]/25"
              : saveStatus === "error"
                ? "plasmo-border-[#d32f2f] plasmo-bg-[#d32f2f]/20 hover:plasmo-bg-[#d32f2f]/25"
                : "plasmo-border-pewter-orange plasmo-bg-pewter-orange/20 hover:plasmo-bg-pewter-orange/25"
          }`}
          aria-label={isSaving ? "Saving URL" : "Save URL"}>
          {isSaving || isLoading ? (
            <SpinnerGapIcon
              weight="duotone"
              className="plasmo-animate-spin"
              size={20}
              color="#f4a261"
            />
          ) : saveStatus === "success" ? (
            <CheckCircleIcon weight="fill" size={20} color="#2e7d32" />
          ) : saveStatus === "error" ? (
            <XCircleIcon weight="fill" size={20} color="#d32f2f" />
          ) : (
            <BookmarkSimpleIcon
              weight={isBookmarked ? "fill" : "duotone"}
              size={20}
              color={"#f4a261"}
            />
          )}
        </button>
      </div>
    </div>
  )
}
