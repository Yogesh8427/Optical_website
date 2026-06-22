import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import OffersSection from '@/components/home/OffersSection';
import CouponsSection from '@/components/home/CouponsSection';
import NewArrivals from '@/components/home/NewArrivals';
import PopularBrands from '@/components/home/PopularBrands';
import Testimonials from '@/components/home/Testimonials';
import FAQSection from '@/components/home/FAQSection';
import ContactSection from '@/components/home/ContactSection';
import WelcomePopup from '@/components/home/WelcomePopup';
import FadeIn from '@/components/ui/FadeIn';
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
      <FadeIn><CategoryGrid /></FadeIn>
      <FadeIn delay={0.05}><FeaturedProducts /></FadeIn>
      <FadeIn delay={0.05}><OffersSection /></FadeIn>
      <FadeIn delay={0.05}><CouponsSection /></FadeIn>
      <FadeIn delay={0.05}><NewArrivals /></FadeIn>
      <FadeIn delay={0.05}><PopularBrands /></FadeIn>
      <FadeIn delay={0.05}><Testimonials /></FadeIn>
      <FadeIn delay={0.05}><FAQSection /></FadeIn>
      <ContactSection />
    </>
  );
}
