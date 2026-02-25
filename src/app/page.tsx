import Sidebar from "@/components/Sidebar";
import { Bell } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full bg-[var(--bg-page)]">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-10 px-14 py-10 overflow-auto">
        {/* Header */}
        <div className="flex items-end justify-between w-full">
          <div className="flex flex-col gap-2">
            <span className="font-body text-[14px] text-[var(--text-secondary)]">Welcome back,</span>
            <h1 className="font-heading text-[36px] font-medium text-[var(--text-primary)]">
              田中 雄一 様
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={22} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
            <span className="font-body text-[13px] text-[var(--text-secondary)]">2026年2月25日</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-5 w-full">
          {/* Stat Card 1 */}
          <div className="flex-1 flex flex-col gap-4 border border-[var(--border)] p-6">
            <span className="font-body text-[12px] text-[var(--text-secondary)]">会員ステータス</span>
            <span className="font-heading text-[32px] font-medium text-[var(--gold)]">Platinum</span>
            <span className="font-body text-[12px] text-[var(--text-tertiary)]">2015年より継続</span>
          </div>
          {/* Stat Card 2 */}
          <div className="flex-1 flex flex-col gap-4 border border-[var(--border)] p-6">
            <span className="font-body text-[12px] text-[var(--text-secondary)]">今月のご予約</span>
            <span className="font-heading text-[32px] font-medium text-[var(--text-primary)]">3</span>
            <span className="font-body text-[12px] text-[var(--text-tertiary)]">レストラン 2 / ラウンジ 1</span>
          </div>
          {/* Stat Card 3 */}
          <div className="flex-1 flex flex-col gap-4 border border-[var(--border)] p-6">
            <span className="font-body text-[12px] text-[var(--text-secondary)]">ポイント残高</span>
            <span className="font-mono text-[32px] font-medium text-[var(--text-primary)]">24,800</span>
            <span className="font-body text-[12px] text-[var(--text-tertiary)]">pt　有効期限 2026/12/31</span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex gap-6 flex-1 w-full min-h-0">
          {/* Upcoming Reservations */}
          <div className="flex-1 flex flex-col gap-5 min-h-0">
            <h2 className="font-heading text-[22px] font-medium text-[var(--text-primary)]">直近のご予約</h2>

            {/* Reservation Item 1 */}
            <div className="flex items-center gap-4 border border-[var(--border)] p-5 w-full">
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-body text-[11px] font-medium text-[var(--text-secondary)]">2月</span>
                <span className="font-heading text-[28px] font-medium text-[var(--gold)]">28</span>
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                  GINZA KANZE — ディナー
                </span>
                <span className="font-body text-[12px] text-[var(--text-secondary)]">
                  19:00　|　2名様　|　個室
                </span>
              </div>
              <div className="bg-[var(--gold-subtle)] px-3 py-1.5">
                <span className="font-body text-[11px] font-medium text-[var(--gold)]">確定</span>
              </div>
            </div>

            {/* Reservation Item 2 */}
            <div className="flex items-center gap-4 border border-[var(--border)] p-5 w-full">
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-body text-[11px] font-medium text-[var(--text-secondary)]">3月</span>
                <span className="font-heading text-[28px] font-medium text-[var(--gold)]">05</span>
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                  Members Lounge — 丸の内
                </span>
                <span className="font-body text-[12px] text-[var(--text-secondary)]">
                  14:00 – 16:00　|　1名様
                </span>
              </div>
              <div className="bg-[var(--gold-subtle)] px-3 py-1.5">
                <span className="font-body text-[11px] font-medium text-[var(--gold)]">確定</span>
              </div>
            </div>
          </div>

          {/* Recommended Events */}
          <div className="flex-1 flex flex-col gap-5 min-h-0">
            <h2 className="font-heading text-[22px] font-medium text-[var(--text-primary)]">おすすめイベント</h2>

            {/* Event Card 1 */}
            <div className="flex flex-col border border-[var(--border)] w-full">
              <div className="relative w-full h-[120px] overflow-hidden">
                <Image
                  src="/images/generated-1771986192738.png"
                  alt="ブルゴーニュワイン テイスティング会"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <span className="font-body text-[10px] font-medium text-[var(--gold)]">ワイン</span>
                <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                  ブルゴーニュワイン テイスティング会
                </span>
                <span className="font-body text-[12px] text-[var(--text-secondary)]">
                  2026年3月15日　|　18:00 –
                </span>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="flex flex-col border border-[var(--border)] w-full">
              <div className="relative w-full h-[120px] overflow-hidden">
                <Image
                  src="/images/generated-1771986199339.png"
                  alt="資産運用セミナー 2026 Spring"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <span className="font-body text-[10px] font-medium text-[var(--gold)]">セミナー</span>
                <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                  資産運用セミナー 2026 Spring
                </span>
                <span className="font-body text-[12px] text-[var(--text-secondary)]">
                  2026年3月22日　|　15:00 –
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
