"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-center px-4 pt-2.5 pb-0.5">
      {/* Evrlink Logo */}
      <div className="flex items-center">
        <Link href="/">
        <Image
          src="/images/logo.png"
          alt="Evrlink"
          width={60}
          height={60}
          className="h-[50px] w-[50px] object-contain"
          priority
        />
        </Link>
      </div>
    </header>
  );
}
