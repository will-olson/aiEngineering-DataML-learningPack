"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const areas = [
  { href: "/ask", label: "Ask", enabled: true },
  { href: "/learn", label: "Learn", enabled: true },
  { href: "/build", label: "Build", enabled: true },
  { href: "/discover", label: "Discover", enabled: true },
  { href: "#", label: "Read", enabled: false },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="app-nav">
      <div className="app-nav-inner">
        <Link href="/" className="brand">
          DataML Learning Pack
        </Link>
        <nav aria-label="Product areas">
          <ul className="nav-areas">
            {areas.map((area) => {
              const active =
                area.enabled &&
                (pathname === area.href || pathname.startsWith(`${area.href}/`));
              return (
                <li key={area.label}>
                  {area.enabled ? (
                    <Link
                      href={area.href}
                      aria-current={active ? "page" : undefined}
                    >
                      {area.label}
                    </Link>
                  ) : (
                    <span className="nav-disabled" title="Coming soon">
                      {area.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
