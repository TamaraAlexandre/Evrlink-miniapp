"use client";

import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center h-14 px-4 border-b border-border-light bg-white sticky top-0 z-40">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center justify-center h-10 w-10 -ml-2 rounded-full hover:bg-gray-50 transition-colors"
        aria-label="Go back"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      </button>

      {/* Title */}
      <h1 className="flex-1 text-center text-base font-semibold text-foreground pr-10">
        {title}
      </h1>
    </header>
  );
}
