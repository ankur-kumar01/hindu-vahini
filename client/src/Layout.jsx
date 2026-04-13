import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingDonateButton from './components/FloatingDonateButton';

export default function Layout({ children, hideFooter, hideFloatingDonate }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow w-full">{children}</main>
      {!hideFooter && <Footer />}
      {!hideFloatingDonate && <FloatingDonateButton />}
    </div>
  );
}
