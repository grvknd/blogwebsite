
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { useAuth } from "../auth/AuthContext";


const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

export default function CreatePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [section, setSection] = useState<"news" | "tech" | "trending" | "">("");

  
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isValidYoutube = (url: string) => {
    if (!url.trim()) return true; 
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser?.id) {
      setError("Not authenticated.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    if (!section) {
      setError("Please choose a section.");
      return;
    }
    if (!isValidYoutube(youtubeUrl)) {
      setError("Please enter a valid YouTube link.");
      return;
    }

    try {
      setSaving(true);

      const post = {
        title: title.trim(),
        slug: slugify(title),
        content: content.trim(),
        authorId: String(currentUser.id),
        section,
        youtubeUrl: youtubeUrl.trim(), // ⭐ NEW FIELD SENT TO DB
      };

      await createPost(post);
      navigate("/profile");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Create Blog</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 10 }}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{ padding: 10, resize: "vertical" }}
        />

        {/* ⭐ NEW YOUTUBE INPUT */}
        <input
          placeholder="YouTube video link (optional)"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          style={{ padding: 10 }}
        />

        {/* SECTION SELECTOR */}
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 600 }}>Choose Section:</label>

          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="radio"
              name="section"
              value="news"
              checked={section === "news"}
              onChange={() => setSection("news")}
            />
            News
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="radio"
              name="section"
              value="tech"
              checked={section === "tech"}
              onChange={() => setSection("tech")}
            />
            Tech
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="radio"
              name="section"
              value="trending"
              checked={section === "trending"}
              onChange={() => setSection("trending")}
            />
            Trending
          </label>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: "10px 14px", cursor: "pointer" }}
          >
            {saving ? "Saving…" : "Create"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ padding: "10px 14px", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>

        {error && <p style={{ color: "#ef4444" }}>{error}</p>}
      </form>
    </div>
  );
}
