import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { user } = useAuth();

  const userName = user?.name || "User";
  const userEmail = user?.email || "-";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
        {userInitial}
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">
          {userName}
        </p>

        <p className="text-xs text-muted-foreground">
          {userEmail}
        </p>
      </div>
    </div>
  );
}