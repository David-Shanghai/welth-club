"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!memberId || !password) {
      setError("会員IDとパスワードを入力してください");
      return;
    }
    const ok = login(memberId, password);
    if (!ok) {
      setError("会員IDまたはパスワードが正しくありません");
    }
  }

  return (
    <div className="flex h-full w-full bg-[var(--bg-page)]">
      {/* Left — Branding */}
      <div className="w-[600px] h-full shrink-0 bg-[var(--bg-surface)] flex flex-col items-center justify-center gap-10 px-[60px]">
        <div className="flex items-center gap-4">
          <span className="font-heading text-[56px] font-semibold text-[var(--gold)]">W</span>
          <span className="font-body text-[18px] font-medium text-[var(--text-primary)] tracking-[5px]">
            WEALTH CLUB
          </span>
        </div>
        <span className="font-heading text-[24px] text-[var(--text-secondary)]">
          上質な体験を、あなただけに。
        </span>
        <div className="w-[60px] h-px bg-[var(--gold)]" />
        <span className="font-body text-[14px] text-[var(--text-tertiary)] text-center leading-[1.8]">
          レストラン・ラウンジのご予約から
          <br />
          限定イベントのご案内まで、
          <br />
          会員様専用のコンシェルジュサービス
        </span>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-[60px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-[380px]">
          <h1 className="font-heading text-[32px] font-medium text-[var(--text-primary)]">
            会員ログイン
          </h1>
          <span className="font-body text-[13px] text-[var(--text-secondary)]">
            会員IDとパスワードを入力してください
          </span>

          <div className="flex flex-col gap-5 w-full">
            {/* Member ID */}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-body text-[12px] text-[var(--text-secondary)]">会員ID</label>
              <input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="WC-XXXX-XXXXX"
                className="w-full h-12 bg-[var(--bg-input)] border border-[var(--border)] px-4 font-mono text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-body text-[12px] text-[var(--text-secondary)]">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                className="w-full h-12 bg-[var(--bg-input)] border border-[var(--border)] px-4 font-body text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <span className="font-body text-[13px] text-red-400">{error}</span>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-12 bg-[var(--gold)] flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <span className="font-body text-[14px] font-medium text-[var(--text-on-gold)]">
              ログイン
            </span>
          </button>

          <div className="flex justify-center w-full">
            <span className="font-body text-[12px] text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--text-secondary)] transition-colors">
              パスワードをお忘れの方はこちら
            </span>
          </div>
        </form>

        <span className="font-body text-[11px] text-[var(--text-tertiary)] mt-16">
          © 2026 WEALTH CLUB. All rights reserved.
        </span>
      </div>
    </div>
  );
}
