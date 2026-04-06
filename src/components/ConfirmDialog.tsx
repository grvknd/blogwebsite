
export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          width: 320,
          textAlign: "center",
        }}
      >
        <h3 style={{  color: "#060606", padding: "8px 0", borderRadius: 4, marginBottom: 12 }}>{title}</h3>
        <p style={{ color: "#060606", marginBottom: 20 }}>{message}</p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onConfirm}
            style={{ padding: "8px 16px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
          >
            Yes
          </button>

          <button
            onClick={onCancel}
            style={{ padding: "8px 16px", background: "#94a3b8", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}