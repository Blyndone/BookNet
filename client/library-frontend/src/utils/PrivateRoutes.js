import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = ({ isLoggedIn, role }) => {
    const allowedRoles = ['admin', 'employee'];
    const isAuthenticated = isLoggedIn && allowedRoles.includes(role);

    return(
        isAuthenticated ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes