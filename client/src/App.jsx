import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Leadership from './pages/Leadership';
import Gallery from './pages/Gallery';
import Donate from './pages/Donate';
import JoinUs from './pages/JoinUs';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/join-us" element={<JoinUs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
