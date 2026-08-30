export function Ticker({ text = "BE TESTING BE UNSTOPPABLE" }: { text?: string }) {
  const phrase = `${text}  ·  `;
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-mist py-3">
      <div className="ticker flex w-max whitespace-nowrap font-mono text-[12px] tracking-[0.35em] text-forest uppercase">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index}>{phrase}</span>
        ))}
      </div>
    </div>
  );
}
