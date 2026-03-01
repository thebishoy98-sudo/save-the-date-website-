import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { RSVPRecord, SMSInviteRecord } from "@/types/rsvp";
import { buildSmsText, normalizePhoneByLanguage, parseCsvLine } from "@/lib/dashboardSms";
import { REVIEW_PENDING_STATUSES, sortResponsesForReview } from "@/lib/rsvpReview";

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || window.location.origin;
const CSV_REQUIRED_COLUMNS_LABEL = "Name, Phone, Language, Seats";

const getManualInviteLanguage = (): "en" | "es" => {
  if (typeof window === "undefined") return "en";
  const value = window.localStorage.getItem("manual_invite_language");
  return value === "es" ? "es" : "en";
};

const normalizeInviteLanguage = (value: string): "en" | "es" => {
  const normalized = value.trim().toLowerCase();
  return normalized === "es" || normalized === "sp" ? "es" : "en";
};


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
  const [invitesNotice, setInvitesNotice] = useState("");
  const [newInviteName, setNewInviteName] = useState("");
  const [newInvitePhone, setNewInvitePhone] = useState("");
  const [newInviteSeats, setNewInviteSeats] = useState("1");
  const [newInviteLanguage, setNewInviteLanguage] = useState<"en" | "es">(getManualInviteLanguage);
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [importingInvites, setImportingInvites] = useState(false);
  const [convertingSelectedInvites, setConvertingSelectedInvites] = useState(false);
  const [importStatus, setImportStatus] = useState("");
  const [deletingInviteId, setDeletingInviteId] = useState<string | null>(null);
  const [deletingAllInvites, setDeletingAllInvites] = useState(false);
  const [copiedInviteIds, setCopiedInviteIds] = useState<Record<string, true>>({});
  const [openingWhatsApp, setOpeningWhatsApp] = useState(false);
  const [deletingResponseId, setDeletingResponseId] = useState<string | null>(null);
  const [updatingResponseId, setUpdatingResponseId] = useState<string | null>(null);
  const [responseNotice, setResponseNotice] = useState("");
  const [selectedDraftInviteIds, setSelectedDraftInviteIds] = useState<Record<string, true>>({});
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("manual_invite_language", newInviteLanguage);
  }, [newInviteLanguage]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("copied_invite_ids");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Record<string, true>;
      setCopiedInviteIds(parsed ?? {});
    } catch {
      setCopiedInviteIds({});
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("copied_invite_ids", JSON.stringify(copiedInviteIds));
  }, [copiedInviteIds]);

  const stats = useMemo(() => {
    const total = rows.length;
    const attending = rows.filter((row) => row.attending).length;
    const notAttending = total - attending;
    const totalGuests = rows.filter((row) => row.attending).reduce((acc, row) => acc + row.guest_count, 0);
    const pendingReview = rows.filter((row) => REVIEW_PENDING_STATUSES.includes(row.review_status)).length;
    return { total, attending, notAttending, totalGuests, pendingReview };
  }, [rows]);

  const sortedRows = useMemo(() => sortResponsesForReview(rows), [rows]);

  const inviteStats = useMemo(() => {
    const total = invites.length;
    const opened = invites.filter((row) => ["opened", "started", "accepted", "declined"].includes(row.status)).length;
    const started = invites.filter((row) => ["started", "accepted", "declined"].includes(row.status)).length;
    const accepted = invites.filter((row) => row.status === "accepted").length;
    const pending = total - accepted;
    return { total, opened, started, accepted, pending };
  }, [invites]);

  const draftEnglishInvites = useMemo(() => invites.filter((invite) => invite.status === "draft" && invite.invite_language === "en"), [invites]);

  const selectedDraftCount = useMemo(() => draftEnglishInvites.filter((invite) => selectedDraftInviteIds[invite.id]).length, [draftEnglishInvites, selectedDraftInviteIds]);

  useEffect(() => {
    setSelectedDraftInviteIds((prev) => {
      const allowedIds = new Set(draftEnglishInvites.map((invite) => invite.id));
      const next = Object.fromEntries(Object.keys(prev).filter((id) => allowedIds.has(id)).map((id) => [id, true])) as Record<string, true>;
      if (Object.keys(next).length === Object.keys(prev).length) return prev;
      return next;
    });
  }, [draftEnglishInvites]);

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

  const sendInviteSms = async (invite: SMSInviteRecord) => {
    if (!supabase) return;
    setInvitesError("");

    const { error } = await supabase.functions.invoke("send-sms-invite", {
      body: {
        invite_token: invite.invite_token,
        guest_name: invite.guest_name,
        phone: invite.phone,
        invite_language: invite.invite_language ?? "en",
        reserved_seats: invite.reserved_seats ?? 1,
        invite_url: invite.invite_url,
      },
    });

    if (error) {
      setInvitesError(error.message);
      return;
    }

    await loadRows();
  };

  const copyMessage = async (invite: SMSInviteRecord) => {
    try {
      await navigator.clipboard.writeText(buildSmsText(invite));
      setInvitesNotice(`Copied message for ${invite.guest_name}.`);
      setCopiedInviteIds((prev) => ({ ...prev, [invite.id]: true }));
    } catch (error) {
      setInvitesError(error instanceof Error ? error.message : "Unable to copy message");
    }
  };

  const openSmsComposer = (invite: SMSInviteRecord) => {
    const phone = invite.phone.trim();
    const text = buildSmsText(invite);
    const encodedBody = encodeURIComponent(text);
    const separator = /iPad|iPhone|iPod/.test(navigator.userAgent) ? "&" : "?";
    const smsUrl = `sms:${phone}${separator}body=${encodedBody}`;
    window.open(smsUrl, "_self");
  };

  const toWhatsAppPhone = (rawPhone: string) => rawPhone.replace(/\D/g, "");

  const openWhatsAppChat = (invite: SMSInviteRecord) => {
    const phone = toWhatsAppPhone(invite.phone);
    const text = encodeURIComponent(buildSmsText(invite));
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const openSpanishWhatsAppChats = () => {
    const spanishInvites = invites.filter((invite) => invite.invite_language === "es" && !copiedInviteIds[invite.id]);
    if (spanishInvites.length === 0) {
      setInvitesNotice("No uncopied Spanish invites found.");
      return;
    }

    setOpeningWhatsApp(true);
    setInvitesError("");
    setInvitesNotice(`Opening ${spanishInvites.length} WhatsApp chat(s)...`);

    const openedIds: Record<string, true> = {};
    spanishInvites.forEach((invite, index) => {
      const phone = toWhatsAppPhone(invite.phone);
      const text = encodeURIComponent(buildSmsText(invite));
      const url = `https://wa.me/${phone}?text=${text}`;
      window.setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
      }, index * 250);
      openedIds[invite.id] = true;
    });

    setCopiedInviteIds((prev) => ({ ...prev, ...openedIds }));
    window.setTimeout(() => setOpeningWhatsApp(false), Math.max(800, spanishInvites.length * 250 + 200));
  };

  const downloadInviteTemplateCsv = () => {
    const header = "Name,Phone,Language,Seats";
    const sampleRows = [
      ["Maria Lopez", "5541234567", "es", "2"],
      ["John Smith", "9735550102", "en", "1"],
    ];
    const csv = [header, ...sampleRows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sms_invites_template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportInvitesCsv = () => {
    const header = "guest_name,phone,invite_language,reserved_seats,invite_url,status,sent_at,opened_at,started_at,responded_at";
    const rowsCsv = invites.map((invite) =>
      [
        invite.guest_name,
        invite.phone,
        invite.invite_language ?? "en",
        invite.reserved_seats ?? 1,
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
    if (!newInviteName.trim() || !newInvitePhone.trim() || !newInviteSeats.trim()) {
      setInvitesError("Name, phone, and reserved seats are required.");
      return;
    }
    if (!/^\d+$/.test(newInviteSeats) || Number.parseInt(newInviteSeats, 10) < 1) {
      setInvitesError("Reserved seats must be a number greater than 0.");
      return;
    }

    setCreatingInvite(true);
    setInvitesError("");
    const token = crypto.randomUUID();
    const inviteUrl = `${SITE_URL}/?invite=${token}`;
    const normalizedPhone = normalizePhoneByLanguage(newInvitePhone, newInviteLanguage);

    const { error } = await supabase.from("sms_invites").insert({
      guest_name: newInviteName.trim(),
      phone: normalizedPhone,
      invite_language: newInviteLanguage,
      reserved_seats: Number.parseInt(newInviteSeats, 10),
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
    setNewInviteSeats("1");
    setCreatingInvite(false);
    await loadRows();
  };

  const deleteInvite = async (invite: SMSInviteRecord) => {
    if (!supabase) return;
    const confirmed = window.confirm(`Delete invite for ${invite.guest_name}?`);
    if (!confirmed) return;

    setDeletingInviteId(invite.id);
    setInvitesError("");
    setInvitesNotice("");

    const { error } = await supabase.from("sms_invites").delete().eq("id", invite.id);
    if (error) {
      setInvitesError(error.message);
      setDeletingInviteId(null);
      return;
    }

    setInvitesNotice(`Deleted invite for ${invite.guest_name}.`);
    setDeletingInviteId(null);
    await loadRows();
  };

  const deleteAllInvites = async () => {
    if (!supabase || invites.length === 0) return;
    const confirmed = window.confirm(`Delete all ${invites.length} SMS invites? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingAllInvites(true);
    setInvitesError("");
    setInvitesNotice("");

    const { error } = await supabase.from("sms_invites").delete().not("id", "is", null);
    if (error) {
      setInvitesError(error.message);
      setDeletingAllInvites(false);
      return;
    }

    setInvitesNotice("Deleted all SMS invites.");
    setDeletingAllInvites(false);
    await loadRows();
  };

  const convertDraftEnglishInvitesToSpanish = async () => {
    if (!supabase) return;
    const totalDraftEnglish = invites.filter((invite) => invite.status === "draft" && invite.invite_language === "en").length;
    if (totalDraftEnglish === 0) {
      setInvitesNotice("No draft EN invites found.");
      return;
    }

    const confirmed = window.confirm(`Convert ${totalDraftEnglish} draft EN invite(s) to ES?`);
    if (!confirmed) return;

    setInvitesError("");
    setInvitesNotice("");
    setImportingInvites(true);
    setImportStatus("Converting draft EN invites to ES...");

    const { data: updatedRows, error } = await supabase
      .from("sms_invites")
      .update({ invite_language: "es" })
      .eq("status", "draft")
      .eq("invite_language", "en")
      .select("id");

    if (error) {
      setInvitesError(error.message);
      setImportStatus("");
      setImportingInvites(false);
      return;
    }

    const updatedCount = updatedRows?.length ?? 0;
    setInvitesNotice(`Converted ${updatedCount} draft invite(s) from EN to ES.`);
    setImportStatus("Conversion complete.");
    setImportingInvites(false);
    await loadRows();
  };

  const deleteResponse = async (row: RSVPRecord) => {
    if (!supabase) return;
    const confirmed = window.confirm(`Delete RSVP response for ${row.name}?`);
    if (!confirmed) return;

    setDeletingResponseId(row.id);
    setLoadError("");
    setResponseNotice("");

    const { error } = await supabase.from("rsvps").delete().eq("id", row.id);
    if (error) {
      setLoadError(error.message);
      setDeletingResponseId(null);
      return;
    }

    setDeletingResponseId(null);
    await loadRows();
  };

  const approveResponseDuplicate = async (row: RSVPRecord) => {
    if (!supabase) return;
    setUpdatingResponseId(row.id);
    setLoadError("");
    setResponseNotice("");

    const { error } = await supabase
      .from("rsvps")
      .update({
        duplicate_flag: false,
        duplicate_reason: null,
        review_status: "approved",
      })
      .eq("id", row.id);

    if (error) {
      setLoadError(error.message);
      setUpdatingResponseId(null);
      return;
    }

    setResponseNotice(`Approved ${row.name}.`);
    setUpdatingResponseId(null);
    await loadRows();
  };

  const editResponseDuplicate = async (row: RSVPRecord) => {
    if (!supabase) return;
    const newName = window.prompt("Edit guest name", row.name)?.trim();
    if (!newName) return;

    const newPlusOne = window.prompt("Edit plus-one name(s), comma-separated", row.plus_one_name ?? "")?.trim() ?? "";

    setUpdatingResponseId(row.id);
    setLoadError("");
    setResponseNotice("");

    const { error } = await supabase
      .from("rsvps")
      .update({
        name: newName,
        plus_one_name: newPlusOne || null,
        duplicate_flag: false,
        duplicate_reason: null,
        review_status: "approved",
      })
      .eq("id", row.id);

    if (error) {
      setLoadError(error.message);
      setUpdatingResponseId(null);
      return;
    }

    setResponseNotice(`Updated and approved ${newName}.`);
    setUpdatingResponseId(null);
    await loadRows();
  };

  const importInvitesCsvFile = async (file: File) => {
    if (!supabase) return;
    setInvitesError("");
    setInvitesNotice("");
    setImportStatus("Reading CSV file...");
    setImportingInvites(true);

    try {
      const raw = await file.text();
      const lines = raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length < 2) {
        setInvitesError("CSV must include a header and at least one row.");
        setImportStatus("");
        setImportingInvites(false);
        return;
      }

      const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
      const getHeaderIndex = (aliases: string[]) => {
        for (const alias of aliases) {
          const idx = headers.indexOf(alias);
          if (idx >= 0) return idx;
        }
        return -1;
      };
      const colIndex = {
        guest_name: getHeaderIndex(["guest_name", "name", "guest", "guestname"]),
        phone: getHeaderIndex(["phone", "phone_number", "number", "telefono"]),
        invite_language: getHeaderIndex(["invite_language", "language", "lang", "idioma"]),
        reserved_seats: getHeaderIndex(["reserved_seats", "seats", "seat_count", "lugares"]),
      };

      if (colIndex.guest_name < 0 || colIndex.phone < 0) {
        setInvitesError("CSV must contain at least guest_name and phone columns.");
        setImportStatus("");
        setImportingInvites(false);
        return;
      }

      setImportStatus("Validating rows...");
      const inserts = lines.slice(1).map((line) => {
        const cells = parseCsvLine(line);
        const guestName = (cells[colIndex.guest_name] ?? "").trim();
        const rawPhone = (cells[colIndex.phone] ?? "").trim();
        const langCell = cells[colIndex.invite_language] ?? "";
        const inviteLanguage: "en" | "es" = normalizeInviteLanguage(langCell);
        const seatCell = (cells[colIndex.reserved_seats] ?? "").trim();
        const seats = /^\d+$/.test(seatCell) && Number.parseInt(seatCell, 10) > 0 ? Number.parseInt(seatCell, 10) : 1;

        if (!guestName || !rawPhone) {
          return null;
        }

        const token = crypto.randomUUID();
        return {
          guest_name: guestName,
          phone: normalizePhoneByLanguage(rawPhone, inviteLanguage),
          invite_language: inviteLanguage,
          reserved_seats: seats,
          invite_token: token,
          invite_url: `${SITE_URL}/?invite=${token}`,
          status: "draft" as const,
        };
      }).filter(Boolean);

      if (inserts.length === 0) {
        setInvitesError("No valid rows found in CSV.");
        setImportStatus("");
        setImportingInvites(false);
        return;
      }

      setImportStatus(`Saving ${inserts.length} invites...`);
      const { error } = await supabase.from("sms_invites").insert(inserts);
      if (error) {
        setInvitesError(error.message);
        setImportStatus("");
        setImportingInvites(false);
        return;
      }

      setInvitesNotice(`Imported ${inserts.length} invites.`);
      setImportStatus("Import complete.");
      if (csvInputRef.current) {
        csvInputRef.current.value = "";
      }
      await loadRows();
    } catch (error) {
      setInvitesError(error instanceof Error ? error.message : "Failed to import CSV.");
      setImportStatus("");
    } finally {
      setImportingInvites(false);
    }
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
            <button
              onClick={() => csvInputRef.current?.click()}
              className="px-4 py-2 rounded-sm border border-border hover:bg-secondary"
              disabled={importingInvites}
            >
              {importingInvites ? "Importing..." : "Import SMS CSV"}
            </button>
            <button onClick={() => downloadInviteTemplateCsv()} className="px-4 py-2 rounded-sm border border-border hover:bg-secondary">
              Download CSV Template
            </button>
            <button onClick={() => exportInvitesCsv()} className="px-4 py-2 rounded-sm border border-border hover:bg-secondary">
              Export Existing CSV
            </button>
            <button
              onClick={openSpanishWhatsAppChats}
              disabled={openingWhatsApp}
              className="px-4 py-2 rounded-sm border border-border hover:bg-secondary disabled:opacity-60"
            >
              {openingWhatsApp ? "Opening WhatsApp..." : "Open WhatsApp (ES only)"}
            </button>
            <button
              onClick={() => void convertDraftEnglishInvitesToSpanish()}
              disabled={importingInvites}
              className="px-4 py-2 rounded-sm border border-border hover:bg-secondary disabled:opacity-60"
            >
              {importingInvites ? "Working..." : "Fix draft EN → ES"}
            </button>
            <button
              onClick={() => void deleteAllInvites()}
              disabled={deletingAllInvites || invites.length === 0}
              className="px-4 py-2 rounded-sm border border-destructive text-destructive hover:bg-destructive/10 disabled:opacity-60"
            >
              {deletingAllInvites ? "Deleting all..." : "Delete all invites"}
            </button>
            <button onClick={() => void handleLogout()} className="px-4 py-2 rounded-sm bg-primary text-primary-foreground hover:bg-foreground">
              Sign out
            </button>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void importInvitesCsvFile(file);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
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
          <div className="vintage-card rounded-sm p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Needs Review</p>
            <p className="text-2xl font-serif mt-1">{stats.pendingReview}</p>
          </div>
        </div>

        <div className="vintage-card rounded-sm p-4 sm:p-6 space-y-4">
          <div>
            <h2 className="font-serif text-lg">SMS Invite Tracking</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create unique links, copy a ready-to-send SMS text, and track opens, started forms, and accepted/declined RSVPs.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              CSV required columns: {CSV_REQUIRED_COLUMNS_LABEL}
            </p>
            {importingInvites && (
              <p className="text-sm mt-2 text-amber-700">
                Processing import... {importStatus}
              </p>
            )}
            {!importingInvites && importStatus && (
              <p className="text-sm mt-2 text-emerald-700">{importStatus}</p>
            )}
          </div>

          <div className="border border-border rounded-sm p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Default language for new guests</p>
            <div className="mt-2 inline-flex rounded-sm border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setNewInviteLanguage("en")}
                className={`px-3 py-1 text-sm ${newInviteLanguage === "en" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-secondary"}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setNewInviteLanguage("es")}
                className={`px-3 py-1 text-sm ${newInviteLanguage === "es" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-secondary"}`}
              >
                Espanol
              </button>
            </div>
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

          <div className="grid sm:grid-cols-[1fr_1fr_140px_auto] gap-2">
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
              placeholder={newInviteLanguage === "es" ? "Phone (auto +52)" : "Phone (auto +1)"}
            />
            <input
              value={newInviteSeats}
              onChange={(e) => setNewInviteSeats(e.target.value.replace(/\D/g, ""))}
              className="px-4 py-2 vintage-input rounded-sm"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Seats"
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
          {invitesNotice && <p className="text-sm text-emerald-700">{invitesNotice}</p>}

          <div className="rounded-sm border border-border p-3 text-sm text-muted-foreground">
            Draft EN invites available: {draftEnglishInvites.length}. Selected for conversion: {selectedDraftCount}.
          </div>

          <div className="space-y-3">
            {invites.map((invite) => (
              <div key={invite.id} className="border border-border rounded-sm p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {invite.status === "draft" && invite.invite_language === "en" && (
                      <input
                        type="checkbox"
                        checked={Boolean(selectedDraftInviteIds[invite.id])}
                        onChange={(e) => toggleDraftInviteSelection(invite.id, e.target.checked)}
                        aria-label={`Select ${invite.guest_name} for EN to ES conversion`}
                      />
                    )}
                    <p className="font-medium">{invite.guest_name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Created {new Date(invite.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">
                    {invite.phone} | Lang: {(invite.invite_language ?? "en").toUpperCase()} | Seats: {invite.reserved_seats ?? 1} | Status: {invite.status}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => void sendInviteSms(invite)}
                      className="text-xs px-2 py-1 rounded-sm border border-border hover:bg-secondary"
                    >
                      {invite.status === "draft" ? "Send SMS" : "Resend SMS"}
                    </button>
                    <button
                      onClick={() => void copyMessage(invite)}
                      className="text-xs px-2 py-1 rounded-sm border border-border hover:bg-secondary"
                    >
                      {copiedInviteIds[invite.id] ? "Copied" : "Copy SMS text"}
                    </button>
                    <button
                      onClick={() => openSmsComposer(invite)}
                      className="text-xs px-2 py-1 rounded-sm border border-border hover:bg-secondary"
                    >
                      Compose SMS
                    </button>
                    {invite.invite_language === "es" && (
                      <button
                        onClick={() => openWhatsAppChat(invite)}
                        className="text-xs px-2 py-1 rounded-sm border border-border hover:bg-secondary"
                      >
                        WhatsApp
                      </button>
                    )}
                    <button
                      onClick={() => void deleteInvite(invite)}
                      disabled={deletingInviteId === invite.id}
                      className="text-xs px-2 py-1 rounded-sm border border-destructive text-destructive hover:bg-destructive/10 disabled:opacity-60"
                    >
                      {deletingInviteId === invite.id ? "Deleting..." : "Delete"}
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
          {responseNotice && <p className="text-sm text-emerald-700">{responseNotice}</p>}
          {!loadingRows && !loadError && rows.length === 0 && <p className="text-sm text-muted-foreground">No responses yet.</p>}
          <div className="space-y-3">
            {sortedRows.map((row) => (
              <div key={row.id} className="border border-border rounded-sm p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="font-medium">{row.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString()}</p>
                    <button
                      onClick={() => void deleteResponse(row)}
                      disabled={deletingResponseId === row.id}
                      className="text-xs px-2 py-1 rounded-sm border border-destructive text-destructive hover:bg-destructive/10 disabled:opacity-60"
                    >
                      {deletingResponseId === row.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
                <p className="text-sm mt-1">{row.attending ? "Attending" : "Not attending"} | Guests: {row.guest_count}</p>
                <p className="text-sm text-muted-foreground mt-1">Plus one: {row.plus_one_name || "None"}</p>
                <p className="text-sm text-muted-foreground mt-1">Review status: {row.review_status}</p>
                {row.duplicate_flag && (
                  <div className="mt-2 rounded-sm border border-amber-300 bg-amber-50 p-2">
                    <p className="text-sm text-amber-900">
                      Possible duplicate: {row.duplicate_reason || "Potential duplicate detected."}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => void approveResponseDuplicate(row)}
                        disabled={updatingResponseId === row.id}
                        className="text-xs px-2 py-1 rounded-sm border border-border hover:bg-secondary disabled:opacity-60"
                      >
                        {updatingResponseId === row.id ? "Saving..." : "Approve"}
                      </button>
                      <button
                        onClick={() => void editResponseDuplicate(row)}
                        disabled={updatingResponseId === row.id}
                        className="text-xs px-2 py-1 rounded-sm border border-border hover:bg-secondary disabled:opacity-60"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
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
