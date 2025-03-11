import React from "react"

export const Loader = () => {
  return (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 0"
        }}>
        <div
          style={{
            width: 24,
            height: 24,
            border: "3px solid #f3f4f6",
            borderTop: "3px solid #24292e",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}
        />
        <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
      </div>
    </div>
  )
}
