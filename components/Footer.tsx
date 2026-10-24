import Image from "next/image";
import { img } from "@/lib/assets";
import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-foreground pb-20 text-white">
      <div className="mx-auto w-full max-w-[1320px] px-4 pt-16">
        <div className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <h4 className="max-w-sm text-xl font-bold leading-snug">
              Get the latest tips for social media growth and marketing straight
              to your inbox!
            </h4>
            <form action="#" className="mt-6 flex max-w-md gap-2 rounded-[5px] bg-white/10 p-1.5">
              <input
                type="email"
                required
                placeholder="jhon@examlpe.com"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/45"
                aria-label="Email"
              />
              <button
                type="submit"
                className="rounded-[5px] bg-accent px-4 py-2.5 text-sm font-semibold text-foreground"
              >
                Subcribe Now
              </button>
            </form>
          </div>

          <div>
            <h5 className="mb-4 text-base font-bold">Site Map</h5>
            <ul className="space-y-2 text-sm text-white/70">
              {["Home", "Services", "Pricing", "Blogs", "Projects"].map((l) => (
                <li key={l}>
                  <a href="#top" className="hover:text-accent">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-base font-bold">Support</h5>
            <ul className="space-y-2 text-sm text-white/70">
              {["Contact Us", "About Us", "Team Member", "Login Now", "Register Now"].map(
                (l) => (
                  <li key={l}>
                    <a href="#contact" className="hover:text-accent">
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-base font-bold">Contact Us</h5>
            <ul className="space-y-3 text-sm text-white/70">
              <li>+91 123 456789</li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-accent">
                  {site.email}
                </a>
              </li>
              <li className="max-w-[200px] leading-relaxed">{site.address}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <a href="#top" className="inline-flex items-center gap-2 text-white">
            <Image
              src={img.logo}
              alt=""
              width={28}
              height={28}
              className="brightness-0 invert"
            />
            <span className="font-bold">{site.name}</span>
          </a>
          <p>
            Designed by {site.name} · Powered by Webflow style template
          </p>
          <p>Follow Us</p>
        </div>
      </div>
    </footer>
  );
}
