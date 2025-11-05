import HomePage from "./pages/user/Homepage/HomePage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Intro from "./pages/user/MockTest/Intro";
import Test from "./pages/user/MockTest/Test";
import Login from "./pages/user/Auth/Login.jsx"
import Profile from "./pages/user/Profile/Profile.jsx";
import Signup from "./pages/user/Auth/Signup.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import AdminLayout from "./layouts/admin/AdminLayout.jsx";
import RequireAdmin from "./components/common/RequireAdmin.jsx";
import RequireAuth from "./components/common/RequireAuth.jsx";
import PracticeAdmin from "./pages/admin/PracticeAdmin.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes yêu cầu đăng nhập */}
          <Route element={<RequireAuth />}>
            <Route path="/mock-test" element={<Intro />} />
            <Route path="/mock-test/:type/:quizId" element={<Test />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin routes */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin/exams" element={<AdminLayout />}>
              <Route index element={<PracticeAdmin />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
