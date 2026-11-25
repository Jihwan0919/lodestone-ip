"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isVerifyingBot, setIsVerifyingBot] = useState(true);
  const [nicknameInput, setNicknameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userIp, setUserIp] = useState<string>("확인 중...");
  const [mcProfile, setMcProfile] = useState<{ nickname: string; uuid: string; ip: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVerifyingBot(false), 1500);
    fetch("/api/ip").then((res) => res.json()).then((data) => setUserIp(data.ip)).catch(() => setUserIp("조회 실패"));
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nicknameInput.trim();
    if (!cleanName) { setErrorMsg("마인크래프트 닉네임을 입력해 주세요."); return; }
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: cleanName, ip: userIp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "인증에 실패했습니다.");
      } else {
        setMcProfile(data);
        setStep(2);
      }
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] text-slate-100 flex items-center justify-center p-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
      <div className="w-full max-w-md bg-[#111622] border border-slate-700/80 rounded-lg shadow-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-white tracking-tight">자동 인증 시스템</h1>
          <p className="text-xs text-slate-400 mt-1">정품 계정 확인 · IP 화이트리스트 자동 승인</p>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            Minecraft 정품 닉네임을 확인하면 <span className="text-sky-400 font-semibold">@정품인증</span> 완료 처리와 함께 현재 접속 IP가 관리자에게 전달됩니다.
          </p>
        </div>
        <div className="flex items-center justify-between px-8">
          <div className={`w-8 h-8 flex items-center justify-center rounded border font-bold text-sm ${step === 1 ? "bg-amber-500/20 border-amber-400 text-amber-300" : "bg-emerald-500/20 border-emerald-400 text-emerald-300"}`}>1</div>
          <div className="flex-1 h-[1px] bg-slate-700 mx-3" />
          <div className={`w-8 h-8 flex items-center justify-center rounded border font-bold text-sm ${step === 2 ? "bg-amber-500/20 border-amber-400 text-amber-300" : "bg-slate-800/80 border-slate-700 text-slate-400"}`}>2</div>
        </div>
        {errorMsg && <div className="bg-rose-500/15 border border-rose-500/50 rounded-lg p-3 text-xs text-rose-300">{errorMsg}</div>}
        {step === 1 && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Minecraft 정품 닉네임 인증</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Minecraft: Java Edition 정품 닉네임을 입력하세요. Mojang 공식 계정 여부와 현재 공인 IP를 자동으로 확인합니다.</p>
            </div>
            <input type="text" value={nicknameInput} onChange={(e) => setNicknameInput(e.target.value)} placeholder="마인크래프트 닉네임 입력 (예: Notch)" className="w-full px-3.5 py-2.5 rounded bg-[#0a0d14] border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white placeholder-slate-500" />
            <div className="mx-auto max-w-[300px] bg-[#232323] border border-[#444444] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isVerifyingBot ? <div className="w-7 h-7 border-2 border-[#00a651] border-t-transparent rounded-full animate-spin" /> : <div className="w-7 h-7 rounded-full bg-[#00a651] text-white flex items-center justify-center text-base font-bold">✓</div>}
                <span className="text-sm font-medium text-white">{isVerifyingBot ? "확인 중..." : "성공!"}</span>
              </div>
              <div className="text-right leading-tight">
                <div className="flex items-center justify-end gap-1"><span className="inline-block w-4 h-2.5 rounded-t-full bg-[#f38020]" /><span className="text-[10px] font-extrabold tracking-wider text-white">CLOUDFLARE</span></div>
                <div className="text-[9px] text-slate-400 underline mt-0.5">개인 정보 · 도움말</div>
              </div>
            </div>
            <button type="submit" disabled={isVerifyingBot || isLoading} className={`w-full py-3.5 px-4 border-b-4 font-bold text-sm flex items-center justify-center gap-2.5 transition ${isVerifyingBot || isLoading ? "bg-[#9e9e9e] border-[#757575] text-black/80 cursor-not-allowed" : "bg-[#f3f3f3] hover:bg-white active:translate-y-[1px] border-[#b5b5b5] text-black cursor-pointer"}`}>
              {isLoading ? "정품 및 IP 확인 중..." : "정품 계정 및 IP 인증하기"}
            </button>
          </form>
        )}
        {step === 2 && mcProfile && (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-emerald-400">● 정품 확인 및 관리자 전송 완료</span><span className="text-xs text-slate-400">Java Edition</span></div>
              <div className="flex items-center gap-3 pt-1">
                <img src={`https://mc-heads.net{mcProfile.uuid}/64`} alt={mcProfile.nickname} className="w-12 h-12 rounded border border-slate-600" />
                <div className="space-y-1 text-sm overflow-hidden">
                  <p className="text-slate-300">닉네임: <span className="font-bold text-white">{mcProfile.nickname}</span></p>
                  <p className="text-slate-300">감지된 IP: <span className="font-mono text-amber-300 font-semibold">{mcProfile.ip}</span></p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate">UUID: {mcProfile.uuid}</p>
            </div>
            <button onClick={() => { setStep(1); setNicknameInput(""); }} className="w-full py-2.5 px-4 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-medium transition">다른 계정으로 다시 인증하기</button>
          </div>
        )}
        <div className="bg-[#181611] border border-amber-500/30 rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-bold text-amber-300">집 인터넷 IP가 변경되었나요?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">공유기 재부팅 등으로 IP가 바뀌어 서버 접속이 안 될 경우, 다시 인증하면 새 IP가 관리자에게 즉시 전송됩니다.</p>
          <div className="pt-1 text-xs text-slate-400">현재 감지된 내 IP: <span className="font-mono text-slate-200">{userIp}</span></div>
        </div>
      </div>
    </main>
  );
}
