import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostBySlug, updatePost, type Post } from "../api/posts";
import { useAuth } from "../auth/AuthContext";

export default function EditPost() {
  const { slug } = useParams();
  useAuth();
  const navigate = useNavigate();

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    const updated = {
      ...post,
      updatedAt: new Date().toISOString(),
    };

    await updatePost(post.id!, updated);
    navigate(`/post/${updated.slug}`);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
  if (err) return <p style={{ padding: 20, color: "#ef4444" }}>{err}</p>;

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h1>Edit Blog</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          value={post!.title}
          onChange={(e) => setPost((p) => ({ ...p!, title: e.target.value }))}
          style={{ padding: 10 }}
        />

        <textarea
          value={post!.content}
          onChange={(e) =>
            setPost((p) => ({ ...p!, content: e.target.value }))
          }
          rows={10}
          style={{ padding: 10 }}
        />

        <button
          type="submit"
          style={{ padding: "10px 14px", cursor: "pointer" }}
        >
          Save
        </button>
      </form>
    </div>
  );
}