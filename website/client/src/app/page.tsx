import { Feature } from "@/components/features";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-2";
import { allFeatures } from "@/lib/data";

export default function Home() {
  return (
    <>
      <HeroSection />
      <section id="features">
        {allFeatures.map((data, idx) => (
          <Feature {...data} idx={idx} key={idx} />
        ))}
      </section>
      <StatsSection />
      <FooterSection />
    </>
  );
}
