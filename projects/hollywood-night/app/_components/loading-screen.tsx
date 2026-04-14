export default function LoadingScreen({ label }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink-black grain">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(212,175,55,0.18) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <span
            className="absolute inset-0 border-2 border-gold-500/30 rounded-full"
          />
          <span
            className="absolute inset-0 border-2 border-transparent border-t-gold-400 rounded-full animate-[spin_1.2s_linear_infinite]"
          />
          <span
            className="absolute inset-2 border border-gold-500/60 rounded-full"
          />
          <span className="absolute inset-0 flex items-center justify-center text-gold-400 text-xs">
            ◆
          </span>
        </div>
        <div className="text-center">
          <p className="font-display italic text-champagne text-xl md:text-2xl">
            Hollywood Night
          </p>
          <p className="text-[10px] uppercase tracking-[0.32em] text-gold-500 mt-2">
            {label ?? "Loading"}
          </p>
        </div>
      </div>
    </div>
  );
}
