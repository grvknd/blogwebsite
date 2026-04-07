import { useEffect, useState } from "react";
import { getAllPosts, type Post } from "../api/posts";
import { Link } from "react-router-dom";

export default function News() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  
  const getThumb = (url?: string) => {
    if (!url) return "";
    
    const match = url.match(/(?:youtu\.be\/|v=)([^&?]+)/);
    if (!match) return "";
    const baseUrl = import.meta.env.VITE_YOUTUBE_THUMBNAIL_BASE_URL || "https://img.youtube.com/vi";
    return `${baseUrl}/${match[1]}/hqdefault.jpg`;
  };

  useEffect(() => {
    (async () => {
      try {
        const all = await getAllPosts();
        setPosts(all.filter((p) => p.section === "news"));
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
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "24px",
        color: "white"
      }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>News</h1>
        <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>
          Latest news articles and current events from various sources
        </p>
      </div>

      {loading && <p style={{ color: "#94a3b8" }}>Loading…</p>}
      {err && <p style={{ color: "#ef4444" }}>{err}</p>}
      {!loading && posts.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <h3 style={{ color: "#94a3b8", marginBottom: "8px" }}>No news posts yet</h3>
          <p style={{ color: "#64748b" }}>
            Check back later for the latest news updates!
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
                      background: "#f59e0b",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "capitalize"
                    }}>
                      News
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