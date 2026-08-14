import Image from "next/image";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="PlanetMC"
      width={128}
      height={128}
      priority
      className={`${className} object-contain`}
    />
  );
}
