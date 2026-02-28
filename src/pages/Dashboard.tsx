import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { RSVPRecord, SMSInviteRecord } from "@/types/rsvp";

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || window.location.origin;

const buildSmsText = (invite: SMSInviteRecord) =>
  `Hi ${invite.guest_name}, your wedding invite is ready: ${invite.invite_url}`;

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
        <p className="text-sm text-muted-foreground text-center">Sign in to view responses.</p>
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
  const [invites, setInvites] = useState<SMSInviteRecord[]>([]);
  const [invitesError, setInvitesError] = useState("");
  const [newInviteName, setNewInviteName] = useState("");
  const [newInvitePhone, setNewInvitePhone] = useState("");
  const [creatingInvite, setCreatingInvite] = useState(false);

  const stats = useMemo(() => {
    const total = rows.length;
    const attending = rows.filter((row) => row.attending).length;
    const notAttending = total - attending;
    const totalGuests = rows.filter((row) => row.attending).reduce((acc, row) => acc + row.guest_count, 0);
    return { total, attending, notAttending, totalGuests };
  }, [rows]);

  const inviteStats = useMemo(() => {
    const total = invites.length;
    const opened = invites.filter((row) => ["opened", "started", "accepted", "declined"].includes(row.status)).length;
    const started = invites.filter((row) => ["started", "accepted", "declined"].includes(row.status)).length;
    const accepted = invites.filter((row) => row.status === "accepted").length;
    const pending = total - accepted;
    return { total, opened, started, accepted, pending };
  }, [invites]);

  const loadRows = async () => {
    if (!supabase) return;
    setLoadingRows(true);
    setLoadError("");
    const [{ data: rsvpData, error: rsvpError }, { data: inviteData, error: inviteError }] = await Promise.all([
      supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
      supabase.from("sms_invites").select("*").order("created_at", { ascending: false }),
    ]);

    if (rsvpError) {
      setLoadError(rsvpError.message);
      setLoadingRows(false);
      return;
    }

    setRows((rsvpData ?? []) as RSVPRecord[]);
    setInvites((inviteData ?? []) as SMSInviteRecord[]);
    setInvitesError(inviteError?.message || "");
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
        setInvites([]);
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

  const markInviteSent = async (inviteToken: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("sms_invites")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("invite_token", inviteToken)
      .eq("status", "draft");

    if (error) {
      setInvitesError(error.message);
      return;
    }

    await loadRows();
  };

  const copyMessage = async (invite: SMSInviteRecord) => {
    try {
      await navigator.clipboard.writeText(buildSmsText(invite));
    } catch (error) {
      setInvitesError(error instanceof Error ? error.message : "Unable to copy message");
    }
  };

  const exportInvitesCsv = () => {
    const header = "guest_name,phone,invite_url,status,sent_at,opened_at,started_at,responded_at";
    const rowsCsv = invites.map((invite) =>
      [
        invite.guest_name,
        invite.phone,
        invite.invite_url,
        invite.status,
        invite.sent_at || "",
        invite.opened_at || "",
        invite.started_at || "",
        invite.responded_at || "",
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header, ...rowsCsv].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sms_invites_export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const createInvite = async () => {
    if (!supabase) return;
    if (!newInviteName.trim() || !newInvitePhone.trim()) {
      setInvitesError("Name and phone are required to create an SMS invite.");
      return;
    }

    setCreatingInvite(true);
    setInvitesError("");
    const token = crypto.randomUUID();
    const inviteUrl = `${SITE_URL}/?invite=${token}`;

    const { error } = await supabase.from("sms_invites").insert({
      guest_name: newInviteName.trim(),
      phone: newInvitePhone.trim(),
      invite_token: token,
      invite_url: inviteUrl,
      status: "draft",
    });

    if (error) {
      setInvitesError(error.message);
      setCreatingInvite(false);
      return;
    }

    setNewInviteName("");
    setNewInvitePhone("");
    setCreatingInvite(false);
    await loadRows();
  };

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="min-h-screen bg-background px-4 py-10">
        <div className="max-w-2xl mx-auto vintage-card rounded-sm p-6 sm:p-8 space-y-3">
          <h1 className="font-script text-4xl gold-text">RSVP Dashboard</h1>
          <p className="text-foreground">
            Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to run the dashboard.
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
            <p className="text-sm text-muted-foreground">Signed in as {session.user.email}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void loadRows()} className="px-4 py-2 rounded-sm border border-border hover:bg-secondary">
              Refresh
            </button>
            <button onClick={() => exportInvitesCsv()} className="px-4 py-2 rounded-sm border border-border hover:bg-secondary">
              Export SMS CSV
            </button>
            <button onClick={() => void handleLogout()} className="px-4 py-2 rounded-sm bg-primary text-primary-foreground hover:bg-foreground">
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

        <div className="vintage-card rounded-sm p-4 sm:p-6 space-y-4">
          <div>
            <h2 className="font-serif text-lg">SMS Invite Tracking</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create unique links, copy a ready-to-send SMS text, and track opens, started forms, and accepted/declined RSVPs.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="border border-border rounded-sm p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Invites</p>
              <p className="text-xl font-serif mt-1">{inviteStats.total}</p>
            </div>
            <div className="border border-border rounded-sm p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Opened</p>
              <p className="text-xl font-serif mt-1">{inviteStats.opened}</p>
            </div>
            <div className="border border-border rounded-sm p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Started</p>
              <p className="text-xl font-serif mt-1">{inviteStats.started}</p>
            </div>
            <div className="border border-border rounded-sm p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Accepted</p>
              <p className="text-xl font-serif mt-1">{inviteStats.accepted}</p>
            </div>
            <div className="border border-border rounded-sm p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Pending</p>
              <p className="text-xl font-serif mt-1">{inviteStats.pending}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
            <input
              value={newInviteName}
              onChange={(e) => setNewInviteName(e.target.value)}
              className="px-4 py-2 vintage-input rounded-sm"
              placeholder="Guest name"
            />
            <input
              value={newInvitePhone}
              onChange={(e) => setNewInvitePhone(e.target.value)}
              className="px-4 py-2 vintage-input rounded-sm"
              placeholder="Phone (ex: +52...)"
            />
            <button
              onClick={() => void createInvite()}
              disabled={creatingInvite}
              className="px-4 py-2 rounded-sm bg-primary text-primary-foreground hover:bg-foreground disabled:opacity-60"
            >
              {creatingInvite ? "Creating..." : "Create invite"}
            </button>
          </div>

          {invitesError && <p className="text-sm text-destructive">{invitesError}</p>}

          <div className="space-y-3">
            {invites.map((invite) => (
              <div key={invite.id} className="border border-border rounded-sm p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="font-medium">{invite.guest_name}</p>
                  <p className="text-xs text-muted-foreground">Created {new Date(invite.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">{invite.phone} | Status: {invite.status}</p>
                  <div className="flex items-center gap-2">
                    {invite.status === "draft" && (
                      <button
                        onClick={() => void markInviteSent(invite.invite_token)}
                        className="text-xs px-2 py-1 rounded-sm border border-border hover:bg-secondary"
                      >
                        Mark sent
                      </button>
                    )}
                    <button
                      onClick={() => void copyMessage(invite)}
                      className="text-xs px-2 py-1 rounded-sm border border-border hover:bg-secondary"
                    >
                      Copy SMS text
                    </button>
                  </div>
                </div>
                <p className="text-sm break-all mt-1">
                  <a href={invite.invite_url} className="underline" target="_blank" rel="noreferrer">
                    {invite.invite_url}
                  </a>
                </p>
              </div>
            ))}
            {invites.length === 0 && <p className="text-sm text-muted-foreground">No SMS invites yet.</p>}
          </div>
        </div>

        <div className="vintage-card rounded-sm p-4 sm:p-6">
          <h2 className="font-serif text-lg mb-4">Responses</h2>
          {loadingRows && <p className="text-sm text-muted-foreground">Loading responses...</p>}
          {loadError && <p className="text-sm text-destructive">{loadError}</p>}
          {!loadingRows && !loadError && rows.length === 0 && <p className="text-sm text-muted-foreground">No responses yet.</p>}
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="border border-border rounded-sm p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString()}</p>
                </div>
                <p className="text-sm mt-1">{row.attending ? "Attending" : "Not attending"} | Guests: {row.guest_count}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {row.email || "No email"} | {row.phone || "No phone"} | {row.arrival_airport || "No airport"}
                </p>
                <p className="text-sm text-muted-foreground">Tracking token: {row.invite_token || "No invite token"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
