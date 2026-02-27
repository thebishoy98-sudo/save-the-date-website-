import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { RSVPRecord } from "@/types/rsvp";

const LoginPanel = ({
  onLogin,
  loading,
  error,
}: {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-md mx-auto vintage-card rounded-sm p-6 sm:p-8 space-y-5">
        <h1 className="font-script text-4xl gold-text text-center">RSVP Dashboard</h1>
        <p className="text-sm text-muted-foreground text-center">
          Sign in to view responses.
        </p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void onLogin(email, password);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 vintage-input rounded-sm"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 vintage-input rounded-sm"
            placeholder="Password"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-sm bg-primary text-primary-foreground hover:bg-foreground disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rows, setRows] = useState<RSVPRecord[]>([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [loadError, setLoadError] = useState("");

  const stats = useMemo(() => {
    const total = rows.length;
    const attending = rows.filter((row) => row.attending).length;
    const notAttending = total - attending;
    const totalGuests = rows
      .filter((row) => row.attending)
      .reduce((acc, row) => acc + row.guest_count, 0);
    return { total, attending, notAttending, totalGuests };
  }, [rows]);

  const loadRows = async () => {
    if (!supabase) return;
    setLoadingRows(true);
    setLoadError("");
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setLoadError(error.message);
      setLoadingRows(false);
      return;
    }
    setRows((data ?? []) as RSVPRecord[]);
    setLoadingRows(false);
  };

  useEffect(() => {
    if (!supabase) {
      setLoadingAuth(false);
      return;
    }
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingAuth(false);
      if (data.session) {
        void loadRows();
      }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        void loadRows();
      } else {
        setRows([]);
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    if (!supabase) return;
    setLoginError("");
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="min-h-screen bg-background px-4 py-10">
        <div className="max-w-2xl mx-auto vintage-card rounded-sm p-6 sm:p-8 space-y-3">
          <h1 className="font-script text-4xl gold-text">RSVP Dashboard</h1>
          <p className="text-foreground">
            Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> to run the dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loadingAuth) {
    return <div className="min-h-screen bg-background px-4 py-10">Loading...</div>;
  }

  if (!session) {
    return <LoginPanel onLogin={handleLogin} loading={loginLoading} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="vintage-card rounded-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-script text-4xl gold-text">RSVP Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Signed in as {session.user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void loadRows()}
              className="px-4 py-2 rounded-sm border border-border hover:bg-secondary"
            >
              Refresh
            </button>
            <button
              onClick={() => void handleLogout()}
              className="px-4 py-2 rounded-sm bg-primary text-primary-foreground hover:bg-foreground"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="vintage-card rounded-sm p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Total RSVPs</p>
            <p className="text-2xl font-serif mt-1">{stats.total}</p>
          </div>
          <div className="vintage-card rounded-sm p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Attending</p>
            <p className="text-2xl font-serif mt-1">{stats.attending}</p>
          </div>
          <div className="vintage-card rounded-sm p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Not Attending</p>
            <p className="text-2xl font-serif mt-1">{stats.notAttending}</p>
          </div>
          <div className="vintage-card rounded-sm p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Guests Count</p>
            <p className="text-2xl font-serif mt-1">{stats.totalGuests}</p>
          </div>
        </div>

        <div className="vintage-card rounded-sm p-4 sm:p-6">
          <h2 className="font-serif text-lg mb-4">Responses</h2>
          {loadingRows && <p className="text-sm text-muted-foreground">Loading responses...</p>}
          {loadError && <p className="text-sm text-destructive">{loadError}</p>}
          {!loadingRows && !loadError && rows.length === 0 && (
            <p className="text-sm text-muted-foreground">No responses yet.</p>
          )}
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="border border-border rounded-sm p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(row.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm mt-1">
                  {row.attending ? "Attending" : "Not attending"} | Guests: {row.guest_count}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {row.email || "No email"} | {row.phone || "No phone"} | {row.arrival_airport || "No airport"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Hotel: {row.hotel || "Not selected"} | Transport:{" "}
                  {row.transport_needed === null
                    ? "Not specified"
                    : row.transport_needed
                      ? "Yes"
                      : "No"}{" "}
                  | Kids food:{" "}
                  {row.kids_food_required === null
                    ? "Not specified"
                    : row.kids_food_required
                      ? "Yes"
                      : "No"}
                </p>
                {row.allergies_notes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Notes: {row.allergies_notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
