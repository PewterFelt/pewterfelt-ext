import { GearSixIcon, HouseIcon } from "@phosphor-icons/react"
import arrowImage from "data-base64:~assets/arrow.png"
import PocketBase, { type RecordModel } from "pocketbase"
import { useEffect, useState } from "react"

import { Options } from "~components/options"
import { SaveUrl } from "~components/save-url"

import "~style.css"

const pb = new PocketBase(process.env.PLASMO_PUBLIC_POCKETBASE_URL)

function IndexPopup() {
  const [activeTab, setActiveTab] = useState<"main" | "options">("main")
  // PERF: this session state might not be needed
  const [session, setSession] = useState<RecordModel | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignOut = () => {
    pb.authStore.clear()
    setSession(null)
    setActiveTab("main")
  }

  useEffect(() => {
    setSession(pb.authStore.record)

    const removeListener = pb.authStore.onChange((_, record) => {
      setSession(record)
    })

    return () => {
      removeListener()
    }
  }, [])

  return (
    <div className="plasmo-flex plasmo-w-[300px] plasmo-flex-col">
      <div className="plasmo-flex-1 plasmo-p-2">
        {activeTab === "main" ? (
          session ? (
            <SaveUrl pb={pb} session={session} />
          ) : (
            <div className="plasmo-rounded-md plasmo-bg-pewter-gray/10 plasmo-px-4 plasmo-py-2.5 plasmo-text-center plasmo-text-sm">
              <span>Head over to the options tab to sign in</span>
            </div>
          )
        ) : (
          <Options
            pb={pb}
            session={session}
            onSignOut={handleSignOut}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>

      <div className="plasmo-flex plasmo-justify-around plasmo-pb-4 plasmo-pt-2">
        <button
          onClick={() => setActiveTab("main")}
          className={`plasmo-rounded-lg ${
            activeTab === "main"
              ? "plasmo-text-pewter-orange"
              : "plasmo-text-gray-400"
          }`}>
          <HouseIcon weight="duotone" size={20} />
        </button>

        <button
          onClick={() => setActiveTab("options")}
          className={`plasmo-relative ${
            activeTab === "options"
              ? "plasmo-text-pewter-orange"
              : "plasmo-text-gray-400"
          }`}>
          {!session && activeTab === "main" ? (
            <img
              src={arrowImage}
              alt="arrow"
              className="plasmo-absolute -plasmo-left-full plasmo-top-0 plasmo-w-[40px] -plasmo-translate-y-2/3 plasmo-translate-x-3 plasmo-scale-x-[-1]"
            />
          ) : null}
          <GearSixIcon weight="duotone" size={20} />
        </button>
      </div>
    </div>
  )
}

export default IndexPopup
