import HomePage from "./pages/user/Homepage/HomePage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Intro from "./pages/user/MockTest/Intro";
import Test from "./pages/user/MockTest/Test";
import Login from "./pages/user/Auth/Login.jsx"
import Profile from "./pages/user/Profile/Profile.jsx";
import Signup from "./pages/user/Auth/Signup.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/mock-test" element={<Intro />} />
        <Route path="/mock-test/:type" element={<Test />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
