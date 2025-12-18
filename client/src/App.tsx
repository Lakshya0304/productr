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

// import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import HomePage from "./pages/HomePage";
// import ProductsPage from "./pages/ProductsPage";
// import SignUp from "./pages/SignUp";
// import Login from "./pages/Login";
// import Otp from "./pages/Otp";

// const MainLayout = () => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 min-h-screen">
//         <BrowserRouter>
//             <Routes>
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/products" element={<ProductsPage />} />
//             </Routes>
//         </BrowserRouter>
//       </div>
//     </div>
//   );
// };

// function App() {
//   return (
//     <>
//     <BrowserRouter>
//       <Routes>
//         {/* Auth pages (NO sidebar) */}
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/otp" element={<Otp />} />
//         {/* App pages (WITH sidebar) */}
//         <Route path="/*" element={<MainLayout />} />
//       </Routes>
//     </BrowserRouter>
//     </>

//   );
// }

// export default App;
