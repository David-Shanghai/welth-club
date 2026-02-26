"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Utensils,
  Armchair,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/restaurant", label: "レストラン予約", icon: Utensils },
  { href: "/lounge", label: "ラウンジ予約", icon: Armchair },
  { href: "/events", label: "イベント予約", icon: Calendar },
  { href: "/profile", label: "会員情報", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside
      className="w-[280px] h-full flex flex-col justify-between bg-[var(--bg-page)] border-r border-[var(--border)] shrink-0"
    >
      {/* Top Section */}
      <div className="flex flex-col gap-8 px-6 pt-7">
        {/* Logo */}
        <div className="flex items-center gap-3 w-full">
          <span className="font-heading text-[28px] font-semibold text-[var(--gold)]">W</span>
          <span className="font-body text-[13px] font-medium text-[var(--text-primary)] tracking-[3px]">
            WEALTH CLUB
          </span>
        </div>

        {/* Member Card */}
        <div
          className="flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border)] p-4 w-full"
        >
          <div
            className="w-11 h-11 bg-[var(--gold-40)] flex items-center justify-center shrink-0"
          >
            <span className="font-body text-[14px] font-semibold text-[var(--gold)] text-center leading-none">
              TY
            </span>
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
              田中 雄一
            </span>
            <span className="font-body text-[12px] text-[var(--gold)]">
              Platinum Member
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 w-full">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-[14px] px-[14px] py-[10px] w-full transition-colors ${
                  isActive
                    ? "bg-[var(--gold-subtle)] text-[var(--gold)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-[var(--gold)]" : "text-[var(--text-secondary)]"}
                  strokeWidth={isActive ? 1.5 : 1.5}
                />
                <span
                  className={`font-body text-[14px] ${
                    isActive ? "font-medium text-[var(--gold)]" : "font-normal text-[var(--text-secondary)]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4 px-6 pb-5">
        <div className="h-px bg-[var(--border)] w-full" />
        <button
          onClick={logout}
          className="flex items-center gap-[14px] px-[14px] py-[10px] w-full text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <LogOut size={20} strokeWidth={1.5} />
          <span className="font-body text-[14px] font-normal">ログアウト</span>
        </button>
      </div>
    </aside>
  );
}
