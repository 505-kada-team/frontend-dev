export default function UserProfile() {
  return (
    <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
        A
      </div>

      <div>

        <p className="text-sm font-semibold text-foreground">
          Admin
        </p>

        <p className="text-xs text-muted-foreground">
          admin@afternooncoffee.com
        </p>

      </div>

    </div>
  );
}