"use client";

import { useCallback, useRef, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import type { TeamMemberDTO } from "@/types/content";

export default function TeamAdminPage() {
  const { data, loading, error, setData } = useApi<TeamMemberDTO[]>("/api/team", "no-store");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string>("");
  const [failedImages, setFailedImages] = useState<Record<string, true>>({});
  const fileInputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());
  const team = data || [];

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });

  const updateMemberField = useCallback(
    (memberId: string | undefined, key: keyof TeamMemberDTO, value: string) => {
      if (!memberId) return;
      setData((prev) =>
        (prev || []).map((m) => (m._id === memberId ? { ...m, [key]: value } : m))
      );
    },
    [setData]
  );

  const addMember = async () => {
    try {
      setMessage("");
      setCreating(true);
      const stamp = Date.now();
      const created = await apiSend<TeamMemberDTO>("/api/team", "POST", {
        name: "New Member",
        role: "Role",
        image: "/assets/team-1.jpg",
        email: `member-${stamp}@example.com`,
        linkedin: "",
        github: "",
      });
      setData((prev) => [...(prev || []), created]);
      setMessage("Team member added.");
    } catch (err) {
      const text = err instanceof Error ? err.message : "Failed to add member.";
      if (text.toLowerCase().includes("unauthorized")) {
        window.location.href = "/admin/login";
        return;
      }
      setMessage(text);
    } finally {
      setCreating(false);
    }
  };

  const saveMember = useCallback(
    async (member: TeamMemberDTO) => {
      if (!member._id) return;
      try {
        setMessage("");
        await apiSend(`/api/team/${member._id}`, "PUT", member);
        setMessage("Team member updated.");
      } catch (err) {
        const text = err instanceof Error ? err.message : "Save failed.";
        if (text.toLowerCase().includes("unauthorized")) {
          window.location.href = "/admin/login";
          return;
        }
        setMessage(text);
      }
    },
    []
  );

  const removeMember = async (id: string | undefined) => {
    if (!id) {
      setMessage("Cannot delete: missing member ID.");
      return;
    }
    try {
      setMessage("");
      setDeletingId(id);
      await apiSend(`/api/team/${id}`, "DELETE");
      setData((prev) => (prev || []).filter((m) => m._id !== id));
      setMessage("Team member deleted.");
    } catch (err) {
      const text = err instanceof Error ? err.message : "Delete failed.";
      if (text.toLowerCase().includes("unauthorized")) {
        window.location.href = "/admin/login";
        return;
      }
      setMessage(text);
    } finally {
      setDeletingId("");
    }
  };

  const uploadImage = useCallback(
    async (member: TeamMemberDTO, file: File) => {
      if (!member._id) {
        setMessage("Cannot upload: member has no ID");
        return;
      }

      try {
        setMessage("");
        setUploading(member._id);

        if (!file.type.startsWith("image/")) {
          throw new Error("Please upload a valid image file.");
        }
        if (file.size > 2 * 1024 * 1024) {
          throw new Error("Image too large. Please upload an image under 2MB.");
        }

        const imageDataUrl = await fileToDataUrl(file);
        const updated = { ...member, image: imageDataUrl };
        await saveMember(updated);

        setData((prevData) =>
          prevData?.map((m) => (m._id === member._id ? updated : m)) || []
        );

        if (member.image && member.image !== "/assets/team-1.jpg") {
          setFailedImages((prev) => {
            if (!prev[member.image]) return prev;
            const next = { ...prev };
            delete next[member.image];
            return next;
          });
        }

        setMessage("✓ Profile image updated successfully.");
      } catch (err) {
        const text = err instanceof Error ? err.message : "Image upload failed.";
        if (text.toLowerCase().includes("unauthorized")) {
          window.location.href = "/admin/login";
          return;
        }
        setMessage(text);
      } finally {
        setUploading("");
      }
    },
    [saveMember]
  );

  const handleFileInputRef = useCallback((memberId: string, el: HTMLInputElement | null) => {
    if (el) {
      fileInputRefs.current.set(memberId, el);
    } else {
      fileInputRefs.current.delete(memberId);
    }
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Team</div>
          <h1 className="font-display font-bold text-3xl">Manage Team Members</h1>
        </div>
        <button onClick={addMember} disabled={creating} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm hover:bg-primary/15 hover:border-primary/30 transition disabled:opacity-50 disabled:cursor-not-allowed">
          <Plus className="h-4 w-4" /> {creating ? "Adding..." : "Add"}
        </button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading team members...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        {team.map((member, index) => {
          const memberId = member._id || member.email || `member-${index}`;
          const rawImage = member.image || "/assets/team-1.jpg";
          const imageSrc = failedImages[rawImage] ? "/assets/team-1.jpg" : rawImage;
          return (
            <div key={member._id || member.email || index} className="glass rounded-2xl p-4 flex gap-4">
              <button
                type="button"
                onClick={() => fileInputRefs.current.get(memberId)?.click()}
                disabled={uploading === memberId}
                className="relative h-20 w-20 rounded-xl overflow-hidden shrink-0 group hover:opacity-75 transition disabled:opacity-50"
                title="Click to change profile picture"
              >
                <img 
                  src={imageSrc}
                  alt={member.name} 
                  className="w-full h-full object-cover" 
                  onError={() => {
                    if (rawImage !== "/assets/team-1.jpg") {
                      setFailedImages((prev) => {
                        if (prev[rawImage]) return prev;
                        return { ...prev, [rawImage]: true };
                      });
                    }
                  }}
                />
                {uploading === memberId && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-xs font-medium">Uploading...</div>
                  </div>
                )}
              </button>
              <input
                ref={(el) => handleFileInputRef(memberId, el)}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) uploadImage(member, file);
                  e.currentTarget.value = "";
                }}
              />
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  value={member.name}
                  onChange={(e) => updateMemberField(member._id, "name", e.target.value)}
                  onBlur={(e) => saveMember({ ...member, name: e.currentTarget.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-sm font-medium"
                  placeholder="Name"
                />
                <input
                  value={member.role}
                  onChange={(e) => updateMemberField(member._id, "role", e.target.value)}
                  onBlur={(e) => saveMember({ ...member, role: e.currentTarget.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs text-muted-foreground"
                  placeholder="Role"
                />
                <input
                  value={member.email}
                  onChange={(e) => updateMemberField(member._id, "email", e.target.value)}
                  onBlur={(e) => saveMember({ ...member, email: e.currentTarget.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs font-mono"
                  placeholder="Email"
                />
                <input
                  value={member.linkedin || ""}
                  onChange={(e) => updateMemberField(member._id, "linkedin", e.target.value)}
                  onBlur={(e) => saveMember({ ...member, linkedin: e.currentTarget.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs"
                  placeholder="LinkedIn URL"
                />
                <input
                  value={member.github || ""}
                  onChange={(e) => updateMemberField(member._id, "github", e.target.value)}
                  onBlur={(e) => saveMember({ ...member, github: e.currentTarget.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs"
                  placeholder="GitHub URL"
                />
              </div>
              <button 
                onClick={() => removeMember(member._id)} 
                disabled={deletingId === member._id}
                className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete member"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
