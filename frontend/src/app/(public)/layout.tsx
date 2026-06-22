import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import ScrollToTop from '@/components/ui/ScrollToTop';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0 bg-white">{children}</main>
      <Footer />
      <MobileBottomNav />
      <ScrollToTop />
    </>
  );
}
