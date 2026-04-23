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
  const fileInputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());
  const team = data || [];

  const addMember = async () => {
    try {
      const created = await apiSend<TeamMemberDTO>("/api/team", "POST", {
        name: "New Member",
        role: "Role",
        image: "/assets/team-1.jpg",
        email: "email@example.com",
      });
      setData([...(team || []), created]);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to add member.");
    }
  };

  const saveMember = useCallback(
    async (member: TeamMemberDTO) => {
      if (!member._id) return;
      try {
        await apiSend(`/api/team/${member._id}`, "PUT", member);
        setMessage("Team member updated.");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Save failed.");
      }
    },
    []
  );

  const removeMember = async (id: string | undefined) => {
    if (!id) return;
    try {
      await apiSend(`/api/team/${id}`, "DELETE");
      setData(team.filter((m) => m._id !== id));
      setMessage("Team member deleted.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed.");
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
        const formData = new FormData();
        formData.append("file", file);
        const uploaded = await apiSend<{ fileUrl: string }>("/api/upload", "POST", formData);
        const updated = { ...member, image: uploaded.fileUrl };
        await saveMember(updated);
        
        // Update immediately in state
        setData((prevData) =>
          prevData?.map((m) => (m._id === member._id ? updated : m)) || []
        );
        setMessage("✓ Profile image updated successfully.");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Image upload failed.");
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
        <button onClick={addMember} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm hover:bg-primary/15 hover:border-primary/30 transition">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading team members...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        {team.map((member, index) => {
          const memberId = member._id || member.email || `member-${index}`;
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
                  src={member.image || "/assets/team-1.jpg"} 
                  alt={member.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (!img.dataset.errorHandled) {
                      img.dataset.errorHandled = "true";
                      img.src = "/assets/team-1.jpg";
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
                  onChange={(e) => setData(team.map((m) => (m._id === member._id ? { ...m, name: e.target.value } : m)))}
                  onBlur={(e) => saveMember({ ...member, name: e.currentTarget.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-sm font-medium"
                  placeholder="Name"
                />
                <input
                  value={member.role}
                  onChange={(e) => setData(team.map((m) => (m._id === member._id ? { ...m, role: e.target.value } : m)))}
                  onBlur={(e) => saveMember({ ...member, role: e.currentTarget.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs text-muted-foreground"
                  placeholder="Role"
                />
                <input
                  value={member.email}
                  onChange={(e) => setData(team.map((m) => (m._id === member._id ? { ...m, email: e.target.value } : m)))}
                  onBlur={(e) => saveMember({ ...member, email: e.currentTarget.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-input/50 border border-border focus:border-primary/40 focus:outline-none text-xs font-mono"
                  placeholder="Email"
                />
              </div>
              <button 
                onClick={() => removeMember(member._id)} 
                className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center flex-shrink-0"
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
