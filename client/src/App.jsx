import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Leadership from './pages/Leadership';
import Gallery from './pages/Gallery';
import Donate from './pages/Donate';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';
import DeveloperProfile from './pages/DeveloperProfile';

// Admin Panel
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminHome from './admin/AdminHome';
import AdminQueries from './admin/AdminQueries';
import AdminLeaders from './admin/AdminLeaders';
import AdminGallery from './admin/AdminGallery';
import AdminDevRequests from './admin/AdminDevRequests';
import MembershipRequests from './admin/MembershipRequests';
import AdminCampaigns from './admin/AdminCampaigns';
import AdminDonations from './admin/AdminDonations';
import AdminProfile from './admin/AdminProfile';
import AdminChangePassword from './admin/AdminChangePassword';

// Mini Dashboard
import DashboardPanel from './admin/DashboardPanel';
import MiniGallery from './admin/MiniGallery';

// Public Campaign Pages
import CampaignList from './pages/CampaignList';
import CampaignDetail from './pages/CampaignDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - with Navbar/Footer */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/leadership" element={<Layout><Leadership /></Layout>} />
        <Route path="/gallery" element={<Layout hideFooter={true}><Gallery /></Layout>} />
        <Route path="/donate" element={<Layout><Donate /></Layout>} />
        <Route path="/campaigns" element={<Layout><CampaignList /></Layout>} />
        <Route path="/campaigns/:id" element={<Layout><CampaignDetail /></Layout>} />
        <Route path="/join-us" element={<Layout><JoinUs /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/developer" element={<Layout><DeveloperProfile /></Layout>} />

        {/* Admin Routes - standalone, no Navbar/Footer */}
        <Route path="/dashboard-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
        </Route>
        <Route path="/admin/queries" element={<AdminDashboard />}>
          <Route index element={<AdminQueries />} />
        </Route>
        <Route path="/admin/development-requests" element={<AdminDashboard />}>
          <Route index element={<AdminDevRequests />} />
        </Route>
        <Route path="/admin/leaders" element={<AdminDashboard />}>
          <Route index element={<AdminLeaders />} />
        </Route>
        <Route path="/admin/gallery" element={<AdminDashboard />}>
          <Route index element={<AdminGallery />} />
        </Route>
        <Route path="/admin/campaigns" element={<AdminDashboard />}>
          <Route index element={<AdminCampaigns />} />
        </Route>
        <Route path="/admin/donations" element={<AdminDashboard />}>
          <Route index element={<AdminDonations />} />
        </Route>
        <Route path="/admin/members" element={<AdminDashboard />}>
          <Route index element={<MembershipRequests />} />
        </Route>
        <Route path="/admin/profile" element={<AdminDashboard />}>
          <Route index element={<AdminProfile />} />
        </Route>
        <Route path="/admin/change-password" element={<AdminDashboard />}>
          <Route index element={<AdminChangePassword />} />
        </Route>

        {/* Mini Management Dashboard */}
        <Route path="/dashboard" element={<DashboardPanel />}>
          <Route index element={<MiniGallery />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
