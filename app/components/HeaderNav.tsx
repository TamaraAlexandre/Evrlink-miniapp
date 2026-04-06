"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// const homeIcon = "../public/icons/nav-home.png";
const sentIcon = "../public/icons/nav-sent.png";
const receivedIcon = "../public/icons/nav-received.png";
/**
 * Drop your Figma icon exports into /public/icons/ with these names:
 *   nav-home.png  |  nav-sent.png  |  nav-received.png
 * Icons should be ~48×48px or larger (they'll be rendered at 20×20).
 */
const tabs = [
  // { label: "Home",     href: "/",         icon: "/icons/nav-home.png"     },
  { label: "Sent",     href: "/sent",     icon: "/icons/nav-sent.png"     },
  { label: "Received", href: "/received", icon: "/icons/nav-received.png" },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full px-4 pb-2 pt-1">
      {/* Tab row */}
      <div className="flex items-center gap-1 justify-between">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex items-center gap-2 rounded-full px-4 py-2.5
                text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-primary/10 text-text-tertiary hover:bg-gray-50 hover:text-text-secondary"
                  : "font-semibold text-primary hover:bg-primary/10"
                }
              `}
            >
              {/* Icon – filled with Figma export; grayscale when inactive */}
              <div className="relative h-5 w-5 shrink-0">
                <Image
                  src={tab.icon}
                  alt=""
                  fill
                  className={`object-contain transition-all duration-200 ${
                    isActive ? "opacity-100" : "opacity-70"
                  }`}
                />
              </div>

              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
