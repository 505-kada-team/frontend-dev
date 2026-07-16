export default function AuthFeature({
  icon: Icon,
  title,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-4
        text-center
        backdrop-blur-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-orange-500/40
        hover:bg-white/10
      "
    >

      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">

        <Icon size={20} />

      </div>

      <p className="text-sm font-semibold text-white">

        {title}

      </p>

    </div>
  );
}