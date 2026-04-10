import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Leadership from './pages/Leadership';
import Gallery from './pages/Gallery';
import Donate from './pages/Donate';
import JoinUs from './pages/JoinUs';

// Admin Panel
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminHome from './admin/AdminHome';
import AdminProfile from './admin/AdminProfile';
import AdminChangePassword from './admin/AdminChangePassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - with Navbar/Footer */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/leadership" element={<Layout><Leadership /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/donate" element={<Layout><Donate /></Layout>} />
        <Route path="/join-us" element={<Layout><JoinUs /></Layout>} />

        {/* Admin Routes - standalone, no Navbar/Footer */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
        </Route>
        <Route path="/admin/profile" element={<AdminDashboard />}>
          <Route index element={<AdminProfile />} />
        </Route>
        <Route path="/admin/change-password" element={<AdminDashboard />}>
          <Route index element={<AdminChangePassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
