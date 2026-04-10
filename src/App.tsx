
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";

import PostView from "./pages/PostView";    
import EditPost from "./pages/EditPost";     

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <Nav />

      <main style={{ minHeight: 0 }}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:section"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          {/* ⭐ NEW VIEW PAGE */}
          <Route
            path="/post/:slug"
            element={
              <ProtectedRoute>
                <PostView />
              </ProtectedRoute>
            }
          />

          {/* ⭐ NEW EDIT PAGE */}
          <Route
            path="/post/:slug/edit"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}

export default App;