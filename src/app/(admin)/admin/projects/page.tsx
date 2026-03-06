"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { saveProject, deleteProject } from "@/actions/admin-actions";
import projectData from "@/lib/projects.json";
import { useFormStatus } from "react-dom";
import { Edit3, Trash2, Globe, Image as ImageIcon, Star, X, Upload, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- CLIENT-SIDE PORTAL ---
// Ensures the modal is injected into the body only after hydration
function GlobalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

// --- ENHANCED MODAL SHELL ---
function ModalShell({ isOpen, onClose, children, accentColor = "amber" }: any) {
  // Handle Escape Key & Scroll Lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <GlobalPortal>
      <AnimatePresence mode="wait">
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
            {/* Backdrop: Fades in and closes on click */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-crosshair"
            />

            {/* Modal Box: Springs in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-zinc-800 p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden cursor-default"
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside content
            >
              {/* Decorative Accent Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${accentColor === 'red' ? 'bg-red-600/20' : 'bg-amber-600/20'} rounded-full blur-[60px] -mr-16 -mt-16`} />
              
              <div className="relative z-10 text-center">
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </GlobalPortal>
  );
}

// --- SUBMIT BUTTON ---
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="w-full md:w-auto bg-amber-500 text-black font-black py-5 px-12 rounded-full text-[11px] uppercase tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50"
    >
      {pending ? "Processing..." : isEditing ? "Update Archive" : "Publish Archive"}
    </button>
  );
}

// --- MAIN PAGE ---
export default function ManageProjects() {
  const formRef = useRef<HTMLFormElement>(null);
  
  // States
  const [editingProject, setEditingProject] = useState<any>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    if (editingProject) setExistingGallery(editingProject.gallery || []);
    else setExistingGallery([]);
  }, [editingProject]);

  const handleCoverChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e: any) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file: any) => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };

  const resetForm = useCallback(() => {
    setEditingProject(null);
    setCoverPreview(null);
    setGalleryPreviews([]);
    formRef.current?.reset();
  }, []);

  async function handleAction(formData: FormData) {
    const isEdit = !!editingProject;
    if (isEdit) {
      formData.append("id", editingProject.id);
      formData.append("existingCover", editingProject.coverImage);
      formData.append("existingGallery", JSON.stringify(existingGallery));
    }
    
    await saveProject(formData);
    setSuccessModal({ isOpen: true, message: isEdit ? "Updated" : "Published" });
    resetForm();
  }

  const confirmDelete = async () => {
    if (deleteModal.id) {
      await deleteProject(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null, name: "" });
      setSuccessModal({ isOpen: true, message: "Deleted" });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-amber-500/30 pb-20">
      
      {/* DELETE MODAL */}
      <ModalShell 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        accentColor="red"
      >
        <AlertTriangle className="mx-auto text-red-500 mb-6" size={56} strokeWidth={1.5} />
        <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-4">Confirm</h3>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-8 leading-relaxed">
          Permanent removal of record:
        </p>
        <div className="bg-black py-5 px-6 rounded-2xl border border-zinc-800 mb-10 font-bold text-white uppercase italic tracking-tight">
          "{deleteModal.name}"
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={confirmDelete} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.4em] transition-all">
            Purge Archive
          </button>
          <button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} className="text-zinc-600 hover:text-white font-bold text-[10px] uppercase py-2 transition-colors">
            Cancel
          </button>
        </div>
      </ModalShell>

      {/* SUCCESS MODAL */}
      <ModalShell 
        isOpen={successModal.isOpen} 
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
      >
        <CheckCircle2 className="mx-auto text-amber-500 mb-6" size={56} strokeWidth={1.5} />
        <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-4">Verified</h3>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-10">
          Project was {successModal.message} successfully.
        </p>
        <button onClick={() => setSuccessModal({ ...successModal, isOpen: false })} className="w-full bg-white hover:bg-amber-500 text-black font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.4em] transition-all">
          Continue
        </button>
      </ModalShell>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-12 bg-amber-500"></span>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-500">Studio Control</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
              {editingProject ? "Update Entry" : "New Archive"}
            </h1>
          </div>
          {editingProject && (
            <button onClick={resetForm} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-red-400 bg-red-950/30 border border-red-900 px-6 py-3 rounded-full hover:bg-red-900 transition-all">
              <X size={14} /> Abandon Edit
            </button>
          )}
        </header>

        {/* --- FORM SECTION --- */}
        <section className="bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl mb-12 relative overflow-hidden">
          <form ref={formRef} action={handleAction} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Title</label>
                <input name="title" defaultValue={editingProject?.title} className="w-full bg-zinc-950 border-b border-zinc-700 p-4 rounded-xl outline-none focus:border-amber-500 text-white" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Category</label>
                <select name="category" defaultValue={editingProject?.category || "Web"} className="w-full bg-zinc-950 border-b border-zinc-700 p-4 rounded-xl outline-none text-white appearance-none cursor-pointer">
                  <option value="Web">Web Development</option>
                  <option value="Mobile">Mobile Experience</option>
                  <option value="Creative">Creative Direction</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-amber-500 ml-1 flex items-center gap-2"><ImageIcon size={12} /> Cover Image</label>
                <div className="relative h-48 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl p-2 bg-zinc-950 hover:border-amber-500 transition-all">
                  <input type="file" name="coverFile" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {coverPreview || editingProject?.coverImage ? (
                    <img src={coverPreview || editingProject?.coverImage} className="h-full w-full object-cover rounded-2xl" alt="Preview" />
                  ) : (
                    <div className="text-center">
                      <Upload size={20} className="mx-auto text-zinc-600 mb-2" />
                      <p className="text-[9px] text-zinc-500 uppercase font-bold">Upload Hero</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Stack</label>
                    <input name="stack" defaultValue={editingProject?.stack?.join(", ")} placeholder="React, GSAP" className="w-full bg-zinc-950 border-b border-zinc-700 p-4 rounded-xl outline-none text-white" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1 flex items-center gap-2"><Globe size={12} /> Live URL</label>
                    <input name="liveLink" defaultValue={editingProject?.liveLink} placeholder="https://..." className="w-full bg-zinc-950 border-b border-zinc-700 p-4 rounded-xl outline-none text-white" />
                 </div>
              </div>
            </div>

            <div className="space-y-4 bg-zinc-950 p-6 rounded-3xl border border-dashed border-zinc-800">
              <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Gallery</label>
              <div className="relative flex items-center justify-center p-10 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-amber-500 transition-all cursor-pointer">
                <input type="file" name="galleryFiles" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Plus size={24} className="text-amber-500" />
              </div>
            </div>

            <textarea name="description" defaultValue={editingProject?.description} placeholder="Project details..." className="w-full bg-zinc-950 border-none p-5 rounded-2xl outline-none focus:ring-1 focus:ring-amber-500 text-sm min-h-[140px] text-white resize-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-zinc-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="featured" defaultChecked={editingProject?.featured} className="w-5 h-5 accent-amber-500" />
                <span className="text-[10px] uppercase font-bold text-zinc-500">Feature Entry</span>
              </label>
              <SubmitButton isEditing={!!editingProject} />
            </div>
          </form>
        </section>

        {/* --- LIST SECTION --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">Archive List</h2>
            <span className="text-[10px] text-zinc-700 font-mono">{projectData.projects.length} Total</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {projectData.projects.map((proj: any) => (
              <div key={proj.id} className="group bg-zinc-900 p-4 rounded-[2rem] flex items-center justify-between border border-zinc-800 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-14 bg-zinc-950 rounded-xl overflow-hidden relative border border-zinc-800">
                    <img src={proj.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    {proj.featured && <div className="absolute top-1 right-1 text-amber-500"><Star size={10} fill="currentColor" /></div>}
                  </div>
                  <div>
                    <span className="text-[8px] px-2 py-0.5 bg-amber-500/10 text-amber-500 font-bold uppercase rounded-full border border-amber-500/20">{proj.category}</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">{proj.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingProject(proj); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 bg-zinc-800 text-zinc-500 hover:bg-white hover:text-black rounded-xl transition-all"><Edit3 size={16} /></button>
                  <button onClick={() => setDeleteModal({ isOpen: true, id: proj.id, name: proj.title })} className="p-3 bg-zinc-800 text-zinc-500 hover:bg-red-900 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}