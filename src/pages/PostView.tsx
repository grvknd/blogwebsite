

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPostBySlug, deletePost, type Post } from "../api/posts";
import { useAuth } from "../auth/AuthContext";

export default function PostView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPostBySlug(slug!);
        setPost(data);
      } catch (e) {
        setErr((e as Error)?.message ?? "Failed to load post");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const extractVideoId = (url: string) => {
    if (!url) return "";
    const match =
      url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/) || [];
    return match[1] || "";
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!window.confirm("Delete this post?")) return;

    await deletePost(post.id!);
    navigate("/profile");
  };

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
  if (err) return <p style={{ padding: 20, color: "#ef4444" }}>{err}</p>;
  if (!post) return <p style={{ padding: 20 }}>Post not found.</p>;

  const videoId = extractVideoId(post.youtubeUrl ?? "");

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>{post.title}</h1>

      <p style={{ color: "#94a3b8" }}>
        Section: <strong>{post.section}</strong> • Updated:{" "}
        {new Date(post.updatedAt).toLocaleString()}
      </p>

      
      {videoId && (
        <div style={{ margin: "20px 0" }}>
          <iframe
            width="100%"
            height="380"
            src={`https://www.youtube.com/embed/${videoId}`}
            style={{ borderRadius: 12, border: "none" }}
            allowFullScreen
          ></iframe>
        </div>
      )}

      <p style={{ marginTop: 20, whiteSpace: "pre-wrap", color: "#e2e8f0" }}>
        {post.content}
      </p>

      
      {String(currentUser?.id) === String(post.authorId) && (
        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <Link
            to={`/post/${post.slug}/edit`}
            style={{
              padding: "10px 14px",
              background: "#2563eb",
              color: "white",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            Edit
          </Link>

          <button
            onClick={handleDelete}
            style={{
              padding: "10px 14px",
              background: "#dc2626",
              color: "white",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}