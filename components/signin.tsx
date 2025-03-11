import React from "react"

type SigninProps = {
  loading: boolean
  signInWithGitHub: () => void
}

export const Signin = ({ loading, signInWithGitHub }: SigninProps) => {
  return (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      <button
        onClick={signInWithGitHub}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px 16px",
          background: "#24292e",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontWeight: "bold",
          fontSize: 14,
          opacity: loading ? 0.7 : 1
        }}>
        {loading ? "Opening GitHub..." : "Sign in with GitHub"}
      </button>

      <p style={{ fontSize: 12, color: "#6a737d", marginTop: 8 }}>
        Authentication will open in a new tab
      </p>
    </div>
  )
}
