import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import OffersSection from '@/components/home/OffersSection';
import CouponsSection from '@/components/home/CouponsSection';
import NewArrivals from '@/components/home/NewArrivals';
import PopularBrands from '@/components/home/PopularBrands';
import RepairSection from '@/components/home/RepairSection';
import Testimonials from '@/components/home/Testimonials';
import FAQSection from '@/components/home/FAQSection';
import ContactSection from '@/components/home/ContactSection';
import WelcomePopup from '@/components/home/WelcomePopup';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OptiVision — Premium Eyewear',
  description: 'Discover our collection of premium eyewear. Customize lenses and get a personalized quote via WhatsApp.',
};

export default function HomePage() {
  return (
    <>
      <WelcomePopup />
      <HeroSlider />
      <CategoryGrid />
      <FeaturedProducts />
      <OffersSection />
      <CouponsSection />
      <NewArrivals />
      <PopularBrands />
      <RepairSection />
      <Testimonials />
      <FAQSection />
      <div className="hidden md:block"><ContactSection /></div>
    </>
  );
}
