import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getPostsByAuthor, type Post } from "../api/posts";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        if (!currentUser) return;
        const data = await getPostsByAuthor(String(currentUser.id));
        if (!ignore) setPosts(data);
      } catch (e) {
        if (!ignore) setErr((e as Error)?.message ?? "Failed to load posts");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  
  const getThumb = (url?: string) => {
    if (!url) return "";
    const match = url.match(/(?:youtu\.be\/|v=)([^&?]+)/);
    if (!match) return "";
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      
      <div
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          padding: "30px",
          borderRadius: "12px",
          marginBottom: "30px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          color: "white"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
          
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: "bold",
              border: "3px solid rgba(255,255,255,0.3)"
            }}
          >
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "bold" }}>
              {currentUser?.name}
            </h1>
            <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
              {currentUser?.email}
            </p>
          </div>
        </div>

        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
          gap: "15px",
          padding: "20px 0 0 0",
          borderTop: "1px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>
              {posts.length}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>Total Posts</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>
              {posts.filter(p => p.section === "news").length}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>News</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>
              {posts.filter(p => p.section === "tech").length}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>Tech</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>
              {posts.filter(p => p.section === "trending").length}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>Trending</div>
          </div>
        </div>
      </div>

      {/* Your Blogs Section */}
      <div
        style={{
          background: "rgba(51, 65, 85, 0.8)",
          padding: "25px",
          borderRadius: "12px",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          marginBottom: "20px"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "24px" }}>Your Blogs</h2>

          <Link
            to="/create"
            style={{
              background: "#3b82f6",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "14px",
              transition: "all 0.2s"
            }}
          >
            + Create New Blog
          </Link>
        </div>

        {loading && <p style={{ color: "#94a3b8" }}>Loading posts…</p>}
        {err && <p style={{ color: "#ef4444" }}>{err}</p>}
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <h3 style={{ color: "#94a3b8", marginBottom: "8px" }}>No posts yet</h3>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              Start your blogging journey by creating your first post!
            </p>
            <Link
              to="/create"
              style={{
                background: "#3b82f6",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: "500"
              }}
            >
              Create Your First Post
            </Link>
          </div>
        )}
      </div>

      
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
                      background: p.section === "news" ? "#f59e0b" : p.section === "tech" ? "#8b5cf6" : "#ec4899",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "capitalize"
                    }}>
                      {p.section}
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