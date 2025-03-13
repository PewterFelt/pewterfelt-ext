import { type Session } from "@supabase/supabase-js"

import { Signin } from "~components/signin"

type OptionsProps = {
  session: Session | null
  onSignOut: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const Options = ({
  session,
  onSignOut,
  loading,
  setLoading
}: OptionsProps) => (
  <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-4">
    {session ? (
      <button
        onClick={onSignOut}
        className="plasmo-w-full plasmo-rounded-md plasmo-bg-pewter-orange/20 plasmo-px-4 plasmo-py-2.5 plasmo-text-sm plasmo-font-medium plasmo-text-pewter-orange plasmo-transition-colors hover:plasmo-bg-pewter-orange/25">
        Sign Out
      </button>
    ) : (
      <Signin loading={loading} setLoading={setLoading} />
    )}
  </div>
)
