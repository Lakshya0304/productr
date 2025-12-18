import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import MainLayout from "./MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/signup"
          element={token ? <Navigate to="/" replace /> : <SignUp />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/otp"
          element={token ? <Navigate to="/" replace /> : <Otp />}
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
