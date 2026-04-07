// src/api/users.ts
import { nextNumericId } from "../lib/id"; // <-- add this import

export type User = {
  id?: number;   // we'll provide this at create time
  name: string;
  email: string;
  password: string;
};

const API_BASE = import.meta.env.VITE_API_USERS_BASE_URL || "http://localhost:5174";

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

export async function emailExists(email: string): Promise<boolean> {
  const data = await get<User[]>(`/users?email=${encodeURIComponent(email)}`);
  return data.length > 0;
}

export async function nameExists(name: string): Promise<boolean> {
  const data = await get<User[]>(`/users?name=${encodeURIComponent(name)}`);
  return data.length > 0;
}

/** Registration with client-controlled numeric id */
export async function registerUser(payload: User): Promise<User> {
  // 1) Uniqueness checks
  const [eExists, nExists] = await Promise.all([
    emailExists(payload.email),
    nameExists(payload.name),
  ]);
  if (eExists) throw new Error("Email already registered.");
  if (nExists) throw new Error("Username already taken.");

  // 2) Generate next numeric id for users
  const newId = await nextNumericId(`${API_BASE}/users`);


  return post<User>("/users", { ...payload, id: newId });
}


export async function loginUser(email: string, password: string): Promise<User> {
  const users = await get<User[]>(
    `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  );
  if (users.length === 0) throw new Error("Invalid email or password.");
  return users[0];
}