import Image from "next/image";
import { img } from "@/lib/assets";

export function Sponsors() {
  const row = [...img.logos, ...img.logos];

  return (
    <section
      className="py-[60px]"
      style={{
        backgroundImage: `url('${img.sponsorsBg}')`,
        backgroundPosition: "50%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto max-w-[1320px] px-4">
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#17171733]" />
          <p className="shrink-0 rounded-full bg-surface px-5 py-1.5 text-sm font-medium text-foreground">
            Trusted Partners Worldwide for Success
          </p>
          <div className="h-px flex-1 bg-[#17171733]" />
        </div>
        <div className="overflow-hidden">
          <ul className="animate-marquee flex w-max items-center gap-16">
            {row.map((src, i) => (
              <li key={`${src}-${i}`} className="shrink-0">
                <Image
                  src={src}
                  alt=""
                  width={130}
                  height={40}
                  className="h-9 w-auto brightness-0 invert"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
