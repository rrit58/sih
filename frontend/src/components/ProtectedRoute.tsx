import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check for JWT token from new auth system OR legacy OTP authentication
  const token = localStorage.getItem('authToken')
  const isAuthenticated = !!token

  if (!isAuthenticated) {
    return <Navigate to="/registration" replace />
  }

  return <>{children}</>
}
