import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Sponsors } from "@/components/Sponsors";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Work } from "@/components/Work";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";
import { Blog } from "@/components/Blog";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Sponsors />
        <About />
        <Services />
        <Work />
        <Process />
        <Testimonials />
        <CtaBand />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
