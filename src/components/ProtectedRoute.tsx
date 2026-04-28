import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

export default function ProtectedRoute({ children, requireApproval = true }: { children: ReactNode, requireApproval?: boolean }) {
  const { currentUser, appUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not logged in at all
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but not approved
  if (requireApproval && appUser && !appUser.isApproved) {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
}
