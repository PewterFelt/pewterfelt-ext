import { GearSix, House } from "@phosphor-icons/react"
import { createClient, type Session } from "@supabase/supabase-js"
import arrowImage from "data-base64:~assets/arrow.png"
import { useEffect, useState } from "react"

import { Options } from "~components/options"
import { SaveUrl } from "~components/save-url"

import "~style.css"

const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
)

function IndexPopup() {
  const [activeTab, setActiveTab] = useState<"main" | "options">("main")
  const [session, setSession] = useState<Session>(null)
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setSession(null)
      setActiveTab("main")
    }
  }

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <div className="plasmo-flex plasmo-w-[300px] plasmo-flex-col">
      <div className="plasmo-flex-1 plasmo-p-2">
        {activeTab === "main" ? (
          session ? (
            <SaveUrl supabase={supabase} session={session} />
          ) : (
            <div className="plasmo-bg-pewter-gray/10 plasmo-rounded-md plasmo-px-4 plasmo-py-2.5 plasmo-text-center plasmo-text-sm">
              <span>Head over to the options tab to sign in</span>
            </div>
          )
        ) : (
          <Options
            session={session}
            onSignOut={handleSignOut}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>

      <div className="plasmo-flex plasmo-justify-around plasmo-p-2">
        <button
          onClick={() => setActiveTab("main")}
          className={`plasmo-rounded-lg plasmo-p-2 ${
            activeTab === "main"
              ? "plasmo-text-pewter-orange"
              : "plasmo-text-gray-400"
          }`}>
          <House weight="duotone" size={20} />
        </button>

        <button
          onClick={() => setActiveTab("options")}
          className={`plasmo-relative plasmo-rounded-lg plasmo-p-2 ${
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
          <GearSix weight="duotone" size={20} />
        </button>
      </div>
    </div>
  )
}

export default IndexPopup
