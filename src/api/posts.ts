// import { nextNumericId } from "../lib/id";

// export type Post = {
//   id?: number;
//   title: string;
//   slug: string;
//   content: string;
//   authorId: string;
//   section: "news" | "tech" | "trending";   // ⭐ NEW FIELD
//   createdAt: string;
//   updatedAt: string;
// };

// const API_BASE = "http://127.0.0.1:5175";

// /* ------------------ HTTP Helpers ------------------ */

// async function get<T>(path: string): Promise<T> {
//   const res = await fetch(`${API_BASE}${path}`);
//   if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
//   return res.json();
// }

// async function post<T>(path: string, body: unknown): Promise<T> {
//   const res = await fetch(`${API_BASE}${path}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });
//   if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
//   return res.json();
// }

// /* ------------------ Normalizer ------------------ */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// function normalizePost(p: any): Post {
//   return {
//     ...p,
//     id: Number(p.id),
//     authorId: String(p.authorId),
//     section: String(p.section),             // ⭐ NEW FIELD NORMALIZED
//     createdAt: String(p.createdAt),
//     updatedAt: String(p.updatedAt),
//   };
// }

// /* ------------------ API ------------------ */

// export async function getPostsByAuthor(authorId: string) {
//   console.log("getPostsByAuthor called with authorId:", authorId);
//   console.log("Requesting:", `${API_BASE}/posts`);

//   // Load ALL posts
//   const result = await get<Post[]>("/posts");

//   console.log("Raw posts from server:", result);

//   const normalized = result.map(normalizePost);

//   console.log("Normalized posts:", normalized);

//   // ⭐ Filter here — now it works correctly
//   return normalized.filter((p) => p.authorId === authorId);
// }

// export async function getAllPosts(): Promise<Post[]> {
//   const res = await get<Post[]>("/posts");
//   return res.map(normalizePost);
// }

// export async function createPost(
//   data: Omit<Post, "id" | "createdAt" | "updatedAt">
// ) {
//   const now = new Date().toISOString();
//   const newId = await nextNumericId(`${API_BASE}/posts`);

//   const created = await post<Post>("/posts", {
//     ...data,
//     id: newId,
//     authorId: String(data.authorId),
//     section: data.section,                   // ⭐ SEND SECTION TO DB
//     createdAt: now,
//     updatedAt: now,
//   });

//   return normalizePost(created);
// }

// export async function getPostBySlug(slug: string): Promise<Post> {
//   const posts = await getAllPosts();
//   const found = posts.find((p) => p.slug === slug);
//   if (!found) throw new Error("Post not found");
//   return found;
// }

// export async function updatePost(id: number, data: Post) {
//   const res = await fetch(`${API_BASE}/posts/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error("Update failed");
//   return normalizePost(await res.json());
// }

// export async function deletePost(id: number) {
//   const res = await fetch(`${API_BASE}/posts/${id}`, { method: "DELETE" });
//   if (!res.ok) throw new Error("Delete failed");
// }


import { nextNumericId } from "../lib/id";

export type Post = {
  id?: number;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  section: "news" | "tech" | "trending";
  youtubeUrl?: string;                          // ⭐ NEW FIELD
  createdAt: string;
  updatedAt: string;
};

const API_BASE = "http://127.0.0.1:5175";

/* ------------------ HTTP Helpers ------------------ */

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

/* ------------------ Normalizer ------------------ */
/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizePost(p: any): Post {
  return {
    ...p,
    id: Number(p.id),
    authorId: String(p.authorId),
    section: String(p.section),
    youtubeUrl: p.youtubeUrl ? String(p.youtubeUrl) : "",   // ⭐ NORMALIZE YT URL
    createdAt: String(p.createdAt),
    updatedAt: String(p.updatedAt),
  };
}

/* ------------------ API Functions ------------------ */

export async function getPostsByAuthor(authorId: string) {
  const result = await get<Post[]>("/posts");
  const normalized = result.map(normalizePost);
  return normalized.filter((p) => p.authorId === authorId);
}

export async function getAllPosts(): Promise<Post[]> {
  const res = await get<Post[]>("/posts");
  return res.map(normalizePost);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const all = await getAllPosts();
  const match = all.find((p) => p.slug === slug);
  if (!match) throw new Error("Post not found");
  return match;
}

export async function createPost(
  data: Omit<Post, "id" | "createdAt" | "updatedAt">
) {
  const now = new Date().toISOString();
  const newId = await nextNumericId(`${API_BASE}/posts`);

  const created = await post<Post>("/posts", {
    ...data,
    id: newId,
    authorId: String(data.authorId),
    youtubeUrl: data.youtubeUrl ?? "",        // ⭐ SAVE YT URL
    createdAt: now,
    updatedAt: now,
  });

  return normalizePost(created);
}

export async function updatePost(id: number, data: Partial<Post>) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "PATCH",                          // ⭐ PATCH for partial updates
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      updatedAt: new Date().toISOString(),
    }),
  });

  if (!res.ok) throw new Error("Update failed");
  return normalizePost(await res.json());
}

export async function deletePost(id: number) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Delete failed");
}