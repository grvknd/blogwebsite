import { useEffect, useState } from "react";
import { getAllPosts, type Post } from "../api/posts";
import { Link, useNavigate } from "react-router-dom";

export default function Trending() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // ✅ Extract a WORKING YouTube thumbnail
  const getThumb = (url?: string) => {
    if (!url) return "";
    // Handles: youtu.be/VIDEOID or youtube.com/watch?v=VIDEOID
    const match = url.match(/(?:youtu\.be\/|v=)([^&?]+)/);
    if (!match) return "";
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  };

  useEffect(() => {
    (async () => {
      try {
        const all = await getAllPosts();
        setPosts(all.filter((p) => p.section === "trending"));
      } catch (e) {
        setErr((e as Error)?.message ?? "Failed to load posts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ 
        background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "24px",
        color: "white"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "8px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>Trending</h1>
        </div>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Popular posts and viral content trending across the platform
        </p>
      </div>

      {loading && <p style={{ color: "#94a3b8" }}>Loading…</p>}
      {err && <p style={{ color: "#ef4444" }}>{err}</p>}
      {!loading && posts.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <h3 style={{ color: "#94a3b8", marginBottom: "8px" }}>No trending posts yet</h3>
          <p style={{ color: "#64748b" }}>
            Be the first to create viral content that trends!
          </p>
        </div>
      )}

      {/* ✅ ENHANCED CARD GRID */}
      {posts.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {posts.map((p) => {
            const thumb = getThumb(p.youtubeUrl);

            return (
              <Link
                key={p.id}
                to={`/post/${p.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "12px",
                    padding: "20px",
                    background: "rgba(51, 65, 85, 0.8)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    transition: "all 0.3s",
                    cursor: "pointer"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                  }}
                >
                  {/* ✅ YOUTUBE THUMBNAIL */}
                  {thumb && (
                    <img
                      src={thumb}
                      alt="YouTube thumbnail"
                      style={{ 
                        width: "100%", 
                        borderRadius: "8px", 
                        marginBottom: "16px",
                        aspectRatio: "16/9",
                        objectFit: "cover"
                      }}
                    />
                  )}

                  {/* Section Badge */}
                  <div style={{ marginBottom: "12px" }}>
                    <span style={{
                      background: "#ec4899",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "capitalize"
                    }}>
                      Trending
                    </span>
                  </div>

                  <h3 style={{ 
                    margin: "0 0 12px 0", 
                    color: "#f1f5f9", 
                    fontSize: "18px",
                    fontWeight: "600",
                    lineHeight: "1.4"
                  }}>
                    {p.title}
                  </h3>

                  <p style={{ 
                    margin: "0 0 16px 0", 
                    color: "#94a3b8", 
                    fontSize: "14px",
                    lineHeight: "1.5"
                  }}>
                    {p.content.slice(0, 100)}
                    {p.content.length > 100 ? "..." : ""}
                  </p>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
                    paddingTop: "12px"
                  }}>
                    <small style={{ color: "#64748b", fontSize: "12px" }}>
                      Updated: {new Date(p.updatedAt).toLocaleDateString()}
                    </small>
                    <div style={{ color: "#3b82f6", fontSize: "14px" }}>
                      Read more →
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
