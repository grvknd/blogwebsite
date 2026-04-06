
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/" replace />;
  return <>{children}</>;
}