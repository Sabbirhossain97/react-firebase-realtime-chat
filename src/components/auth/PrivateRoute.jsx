import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import BlankPage from "../BlankPage";

export const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <BlankPage />;
    }

    return user ? <Outlet /> : <Navigate to="/" replace />
}