export default function AuthBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-[#24364F]" />

      <div className="absolute -left-52 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-orange-500/15 blur-[170px]" />

      <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-sky-500/10 blur-[150px]" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
        }}
      />
    </>
  );
}