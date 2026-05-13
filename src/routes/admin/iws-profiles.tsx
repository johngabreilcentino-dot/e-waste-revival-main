import { createFileRoute } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { loadIsAdmin } from "@/lib/admin";

type IwsProfile = {
  id: string;
  name: string;
  title: string;
  location: string;
  photo_url: string;
  summary: string;
  story: string;
  focus: string;
  goal: string;
  sponsorship: string | null;
  impact: string;
};

type IwsProfileForm = Omit<IwsProfile, "id">;

const emptyForm: IwsProfileForm = {
  name: "",
  title: "",
  location: "",
  photo_url: "",
  summary: "",
  story: "",
  focus: "",
  goal: "",
  sponsorship: "",
  impact: "",
};

type AdminMessage = {
  type: "success" | "error" | "info";
  text: string;
};

export const Route = createFileRoute("/admin/iws-profiles")({
  head: () => ({
    meta: [
      { title: "Admin IWS Profiles - e-waste ready" },
      { name: "description", content: "Manage IWS profiles for e-waste ready." },
    ],
  }),
  component: AdminIwsProfilesPage,
});

function AdminIwsProfilesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [profiles, setProfiles] = useState<IwsProfile[]>([]);
  const [form, setForm] = useState<IwsProfileForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IwsProfile | null>(null);
  const [message, setMessage] = useState<AdminMessage | null>(null);

  const isEditing = Boolean(editingId);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      setCheckingAccess(true);

      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;

      if (!active) return;
      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setCheckingAccess(false);
        return;
      }

      const allowed = await loadIsAdmin(currentUser);

      if (!active) return;

      setIsAdmin(allowed);
      setCheckingAccess(false);

      if (allowed) {
        loadProfiles();
      }
    }

    checkAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadProfiles() {
    const { data, error } = await supabase
      .from("iws_profiles")
      .select(
        "id,name,title,location,photo_url,summary,story,focus,goal,sponsorship,impact",
      )
      .order("name", { ascending: true });

    if (error) {
      setMessage({ type: "error", text: `Could not load profiles: ${error.message}` });
      return;
    }

    setProfiles(data ?? []);
  }

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof IwsProfileForm,
  ) {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function startEdit(profile: IwsProfile) {
    setEditingId(profile.id);
    setForm({
      name: profile.name,
      title: profile.title,
      location: profile.location,
      photo_url: profile.photo_url,
      summary: profile.summary,
      story: profile.story,
      focus: profile.focus,
      goal: profile.goal,
      sponsorship: profile.sponsorship ?? "",
      impact: profile.impact,
    });
    setMessage({ type: "info", text: `Editing ${profile.name}.` });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      ...form,
      sponsorship: form.sponsorship || null,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = editingId
        ? await supabase.from("iws_profiles").update(payload).eq("id", editingId)
        : await supabase.from("iws_profiles").insert(payload);

      if (error) {
        setMessage({
          type: "error",
          text: `Could not ${editingId ? "update" : "add"} profile: ${error.message}`,
        });
        return;
      }

      setMessage({
        type: "success",
        text: editingId
          ? "IWS profile updated successfully."
          : "IWS profile added successfully. It is now visible on the IWS page.",
      });
      setEditingId(null);
      setForm(emptyForm);
      await loadProfiles();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong while saving.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeName = `${crypto.randomUUID()}-${file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}.${extension}`;

    try {
      const { error } = await supabase.storage.from("iws-photos").upload(safeName, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

      if (error) {
        setMessage({ type: "error", text: `Photo upload failed: ${error.message}` });
        return;
      }

      const { data } = supabase.storage.from("iws-photos").getPublicUrl(safeName);
      if (!data.publicUrl) {
        setMessage({ type: "error", text: "Photo uploaded, but Supabase did not return a URL." });
        return;
      }

      setForm((current) => ({ ...current, photo_url: data.publicUrl }));
      setMessage({
        type: "success",
        text: "Photo uploaded successfully. The URL was added to the form.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong during upload.",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function requestDelete(profile: IwsProfile) {
    setDeleteTarget(profile);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    const profile = deleteTarget;
    setDeleting(true);
    setMessage(null);

    try {
      const { error } = await supabase.from("iws_profiles").delete().eq("id", profile.id);

      if (error) {
        setMessage({ type: "error", text: `Could not delete ${profile.name}: ${error.message}` });
        return;
      }

      setMessage({ type: "success", text: `${profile.name} was deleted.` });
      if (editingId === profile.id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      await loadProfiles();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong while deleting.",
      });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground">Manage IWS profiles</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
          </p>
        </div>

        {checkingAccess ? (
          <StatusPanel message="Checking admin access..." />
        ) : !user ? (
          <StatusPanel message="Please log in with your admin account to manage IWS profiles." />
        ) : !isAdmin ? (
          <StatusPanel message="Your account is logged in, but it is not registered as an admin." />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <section className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {isEditing ? "Edit profile" : "Add profile"}
                </h2>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                ) : null}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <FormInput
                  label="Name"
                  value={form.name}
                  onChange={(e) => updateField(e, "name")}
                />
                <FormInput
                  label="Title"
                  value={form.title}
                  onChange={(e) => updateField(e, "title")}
                />
                <FormInput
                  label="Location"
                  value={form.location}
                  onChange={(e) => updateField(e, "location")}
                />
                <FormInput
                  label="Photo URL"
                  value={form.photo_url}
                  onChange={(e) => updateField(e, "photo_url")}
                />
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-leaf-soft">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading photo..." : "Upload photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                    disabled={uploading}
                  />
                </label>
                <FormInput
                  label="Focus"
                  value={form.focus}
                  onChange={(e) => updateField(e, "focus")}
                />
                <FormArea
                  label="Summary"
                  value={form.summary}
                  onChange={(e) => updateField(e, "summary")}
                />
                <FormArea
                  label="Story"
                  value={form.story}
                  onChange={(e) => updateField(e, "story")}
                />
                <FormArea label="Goal" value={form.goal} onChange={(e) => updateField(e, "goal")} />
                <FormArea
                  label="Sponsorship"
                  value={form.sponsorship ?? ""}
                  onChange={(e) => updateField(e, "sponsorship")}
                  required={false}
                />
                <FormArea
                  label="Impact"
                  value={form.impact}
                  onChange={(e) => updateField(e, "impact")}
                />
                {message ? (
                  <MessagePanel message={message} />
                ) : null}

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {saving ? "Saving..." : isEditing ? "Save changes" : "Add IWS profile"}
                </button>
              </form>
            </section>

            <section className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-foreground">Current profiles</h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {profiles.length} total
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {profiles.map((profile) => (
                  <article
                    key={profile.id}
                    className="flex gap-4 rounded-3xl border border-border bg-background p-4"
                  >
                    <img
                      src={profile.photo_url}
                      alt={profile.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{profile.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{profile.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {profile.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <IconButton
                          label={`Edit ${profile.name}`}
                          onClick={() => startEdit(profile)}
                        >
                          <Pencil className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          label={`Delete ${profile.name}`}
                          onClick={() => requestDelete(profile)}
                          danger
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
      <DeleteProfileDialog
        profile={deleteTarget}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <SiteFooter />
    </div>
  );
}

function StatusPanel({ message }: { message: string }) {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-8 text-muted-foreground shadow-soft">
      {message}
    </div>
  );
}

function MessagePanel({ message }: { message: AdminMessage }) {
  const className =
    message.type === "success"
      ? "border-primary/20 bg-primary/5 text-primary"
      : message.type === "error"
        ? "border-destructive/25 bg-destructive/5 text-destructive"
        : "border-border bg-background text-foreground";

  return <p className={`rounded-3xl border px-4 py-3 text-sm ${className}`}>{message.text}</p>;
}

function DeleteProfileDialog({
  profile,
  deleting,
  onCancel,
  onConfirm,
}: {
  profile: IwsProfile | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={Boolean(profile)} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="rounded-[2rem] border-border p-8 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete IWS profile?</DialogTitle>
          <DialogDescription>
            {profile
              ? `This will permanently delete ${profile.name} from the admin list and the public IWS page.`
              : "This profile will be permanently deleted."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:space-x-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-full bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete profile"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={onChange}
        required
        className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function FormArea({
  label,
  value,
  onChange,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <textarea
        value={value}
        onChange={onChange}
        required={required}
        rows={3}
        className="mt-1.5 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function IconButton({
  label,
  onClick,
  danger = false,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={
        danger
          ? "inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive hover:text-destructive-foreground"
          : "inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
      }
    >
      {children}
    </button>
  );
}
