import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

interface IProtectedroute {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: IProtectedroute) {
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
