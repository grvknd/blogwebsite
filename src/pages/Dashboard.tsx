/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";
import News from "./News";
import Tech from "./Tech";
import Trending from "./Trending";

export default function Dashboard() {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const { currentUser, logout } = useAuth();
  const activeTab = section || "dashboard";
  const [showConfirm, setShowConfirm] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, news: 0, tech: 0, trending: 0 });

  useEffect(() => {
    // Fetch posts for stats and recent posts
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5174";
    fetch(`${apiBase}/posts`)
      .then(res => res.json())
      .then(data => {
         
        const userPosts = data.filter((post: any) => post.authorId === currentUser?.id);
        setPosts(userPosts);
        
        // Calculate stats
        const newsCount = userPosts.filter((p: any) => p.section === "news").length;
        const techCount = userPosts.filter((p: any) => p.section === "tech").length;
        const trendingCount = userPosts.filter((p: any) => p.section === "trending").length;
        
        setStats({
          total: userPosts.length,
          news: newsCount,
          tech: techCount,
          trending: trendingCount
        });
      })
      .catch(err => console.log("Could not fetch posts:", err));
  }, [currentUser?.id]);

  const cancelLogout = () => setShowConfirm(false);

  const confirmLogout = () => {
    setShowConfirm(false);
    logout();
    navigate("/");
  };

  const sideNavStyle = {
    background: "#1e293b",
    borderRight: "1px solid rgba(148,163,184,0.15)",
    padding: "20px 0",
    minHeight: "100vh",
    width: "200px",
    flexShrink: 0
  };

  const tabStyle = (isActive: boolean) => ({
    display: "block",
    width: "100%",
    padding: "12px 20px",
    background: isActive ? "linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(29, 78, 216, 0.25) 100%)" : "transparent",
    border: "none",
    color: isActive ? "#ffffff" : "#e2e8f0",
    textAlign: "left" as const,
    cursor: "pointer",
    fontSize: isActive ? "15px" : "14px",
    fontWeight: isActive ? "600" : "normal",
    borderLeft: isActive ? "4px solid #3b82f6" : "3px solid transparent",
    borderRadius: isActive ? "0 8px 8px 0" : "0",
    boxShadow: isActive ? "0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)" : "none",
    transition: "all 0.3s ease",
    transform: isActive ? "translateX(2px)" : "translateX(0)"
  });

  const tabDescriptionStyle = {
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "4px",
    lineHeight: "1.3",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "8px"
  };

  const renderContent = () => {
    switch (activeTab) {
      case "news":
        return <News />;
      case "tech":
        return <Tech />;
      case "trending":
        return <Trending />;
      default:
        return (
          <div
            style={{
              padding: "30px",
              maxWidth: "1200px",
              margin: "0 auto",
              minHeight: "100vh",
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            }}
          >
            
            <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  padding: "30px",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  flex: "2",
                  minWidth: "300px"
                }}
              >
                <div>
                  <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", color: "white", fontWeight: "bold" }}>
                    Welcome back, {currentUser?.name}!
                  </h1>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
                    Ready to create amazing content today?
                  </p>
                </div>
              </div>

              <div style={{
                background: "rgba(51, 65, 85, 0.8)",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                backdropFilter: "blur(10px)",
                flex: "1",
                minWidth: "250px"
              }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#f1f5f9", fontSize: "20px" }}>Quick Actions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    onClick={() => navigate("/create")}
                    style={{
                      background: "#3b82f6",
                      border: "none",
                      padding: "12px 16px",
                      color: "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                  >
                    + Create New Blog
                  </button>
                  <button
                    onClick={() => navigate("/profile")}
                    style={{
                      background: "rgba(148, 163, 184, 0.2)", 
                      border: "1px solid rgba(148, 163, 184, 0.3)",
                      padding: "12px 16px",
                      color: "#e2e8f0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
              <div style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                padding: "25px",
                borderRadius: "12px",
                color: "white",
                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>Total Posts</h3>
                    <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{stats.total}</p>
                  </div>

                </div>
              </div>

              <div style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                padding: "25px",
                borderRadius: "12px",
                color: "white",
                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>News Posts</h3>
                    <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{stats.news}</p>
                  </div>

                </div>
              </div>

              <div style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                padding: "25px",
                borderRadius: "12px",
                color: "white",
                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>Tech Posts</h3>
                    <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{stats.tech}</p>
                  </div>

                </div>
              </div>

              <div style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                padding: "25px",
                borderRadius: "12px", 
                color: "white",
                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>Trending Posts</h3>
                    <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{stats.trending}</p>
                  </div>

                </div>
              </div>
            </div>

            {/* Recent Posts */}
            {posts.length > 0 && (
              <div style={{
                background: "rgba(51, 65, 85, 0.8)",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                backdropFilter: "blur(10px)"
              }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#f1f5f9", fontSize: "20px" }}>
                  Recent Posts ({posts.slice(0, 3).length} of {posts.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {posts.slice(0, 3).map((post, index) => (
                    <div
                      key={post.id || index}
                      style={{
                        background: "rgba(71, 85, 105, 0.5)",
                        padding: "20px",
                        borderRadius: "8px",
                        border: "1px solid rgba(148, 163, 184, 0.1)",
                        cursor: "pointer"
                      }}
                      onClick={() => navigate(`/post/${post.slug}`)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <h4 style={{ margin: 0, color: "#f1f5f9", fontSize: "16px", fontWeight: "600" }}>
                          {post.title}
                        </h4>
                        <span style={{
                          background: post.section === "news" ? "#f59e0b" : post.section === "tech" ? "#8b5cf6" : "#ec4899",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          textTransform: "capitalize"
                        }}>
                          {post.section}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>
                        {post.content?.substring(0, 120)}...
                      </p>
                      <p style={{ margin: "10px 0 0 0", color: "#64748b", fontSize: "12px" }}>
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
                {posts.length > 3 && (
                  <button
                    onClick={() => navigate("/profile")}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(148, 163, 184, 0.3)",
                      padding: "10px 16px",
                      color: "#94a3b8",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      marginTop: "15px",
                      width: "100%"
                    }}
                  >
                    View All {posts.length} Posts
                  </button>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Side Navigation */}
        <nav style={sideNavStyle}>
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            style={tabStyle(activeTab === "dashboard")}
          >
            Dashboard
          </button>
          <div style={tabDescriptionStyle}>
            Main overview with blog creation tools and account management
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate("/dashboard/news")}
            style={tabStyle(activeTab === "news")}
          >
            News
          </button>
          <div style={tabDescriptionStyle}>
            Latest news articles and current events from various sources
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate("/dashboard/tech")}
            style={tabStyle(activeTab === "tech")}
          >
            Tech
          </button>
          <div style={tabDescriptionStyle}>
            Technology trends, programming tutorials, and industry updates
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate("/dashboard/trending")}
            style={tabStyle(activeTab === "trending")}
          >
            Trending
          </button>
          <div style={tabDescriptionStyle}>
            Popular posts and viral content trending across the platform
          </div>
        </div>
      </nav>

        {/* Main Content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {renderContent()}
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}
