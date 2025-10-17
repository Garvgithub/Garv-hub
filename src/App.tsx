export default function App() {
  const figmaURL = "https://azalea-stony-69249214.figma.site/"; // your link

  return (
    <div style={{ height: "100vh", width: "100vw", margin: 0 }}>
      {/* Minimal header (you can remove if you want 100% clean) */}
      <div
        style={{
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderBottom: "1px solid #eee",
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        <strong>Garv Hub</strong>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={figmaURL} target="_blank" rel="noreferrer">Open in new tab</a>
        </div>
      </div>

      {/* Fullscreen iframe */}
      <iframe
        title="Garv Hub UI"
        src={figmaURL}
        style={{ border: "none", width: "100%", height: "calc(100vh - 48px)" }}
        allow="clipboard-write; fullscreen"
      />
    </div>
  );
}
