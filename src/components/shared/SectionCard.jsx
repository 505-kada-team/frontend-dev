export default function SectionCard({
  title,
  icon: Icon,
  iconColor = "text-primary",
  children,
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-card/90
        backdrop-blur-md
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      </div>

      <div className="relative p-6">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-border pb-5">

          <div className="flex items-center gap-3">

            {Icon && (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">

                <Icon
                  className={iconColor}
                  size={22}
                />

              </div>
            )}

            <div>

              <h2 className="text-xl font-bold text-foreground">
                {title}
              </h2>

              <p className="text-sm text-muted-foreground">
                Overview and latest information
              </p>

            </div>

          </div>

        </div>

        {/* Content */}

        <div className="mt-5 space-y-4">

          {children}

        </div>

      </div>
    </div>
  );
}