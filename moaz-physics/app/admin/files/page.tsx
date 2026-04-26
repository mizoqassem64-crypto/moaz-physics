"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  FileText,
  ArrowLeft,
  X,
  Upload,
  File,
  Image,
  Video,
  Music,
  Archive,
  Link2,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  videoId: string | null;
  video?: { title: string };
  createdAt: string;
}

interface VideoOption {
  id: string;
  title: string;
}

export default function AdminFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [videos, setVideos] = useState<VideoOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    size: 0,
    type: "pdf",
    videoId: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const [filesRes, videosRes] = await Promise.all([
        fetch("/api/files", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/videos", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (filesRes.ok) {
        const data = await filesRes.json();
        setFiles(data.files);
      }
      if (videosRes.ok) {
        const data = await videosRes.json();
        setVideos(data.videos.map((v: any) => ({ id: v.id, title: v.title })));
      }
    } catch {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create");

      toast({ title: "Success", description: "File added successfully" });
      setIsModalOpen(false);
      setFormData({ name: "", url: "", size: 0, type: "pdf", videoId: "" });
      fetchData();
    } catch {
      toast({ title: "Error", description: "Failed to add file", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/files?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast({ title: "Success", description: "File deleted" });
      fetchData();
    } catch {
      toast({ title: "Error", description: "Failed to delete file", variant: "destructive" });
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf": return <FileText className="w-6 h-6 text-red-400" />;
      case "image": case "jpg": case "png": return <Image className="w-6 h-6 text-blue-400" />;
      case "video": case "mp4": return <Video className="w-6 h-6 text-purple-400" />;
      case "audio": case "mp3": return <Music className="w-6 h-6 text-green-400" />;
      case "zip": case "rar": return <Archive className="w-6 h-6 text-yellow-400" />;
      default: return <File className="w-6 h-6 text-gray-400" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-neon-purple animate-pulse delay-100" />
          <div className="w-3 h-3 rounded-full bg-neon-pink animate-pulse delay-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/dashboard")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-4xl font-space font-bold text-white">
                File <span className="gradient-text">Manager</span>
              </h1>
              <p className="text-gray-400">Manage course resources and attachments</p>
            </div>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-neon-purple hover:bg-neon-purple/80 text-white font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add File
          </Button>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-4 group hover:border-neon-purple/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    {getFileIcon(file.type)}
                  </div>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-space font-bold text-white mb-1 truncate">{file.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span>{formatSize(file.size)}</span>
                  <span className="uppercase">{file.type}</span>
                </div>
                {file.video && (
                  <div className="flex items-center gap-1 text-xs text-neon-purple">
                    <Link2 className="w-3 h-3" />
                    <span className="truncate">{file.video.title}</span>
                  </div>
                )}
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center py-2 rounded-lg bg-white/5 text-neon-blue text-sm hover:bg-neon-blue/10 transition-colors"
                >
                  Download
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add File Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-strong rounded-2xl p-8 w-full max-w-lg border border-neon-purple/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-space font-bold text-white">Add File</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">File Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">File URL</Label>
                    <Input
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Size (bytes)</Label>
                      <Input
                        type="number"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: parseInt(e.target.value) })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Type</Label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white px-3"
                      >
                        <option value="pdf">PDF</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                        <option value="zip">ZIP</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Linked Video (Optional)</Label>
                    <select
                      value={formData.videoId}
                      onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                      className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white px-3"
                    >
                      <option value="">None</option>
                      {videos.map((v) => (
                        <option key={v.id} value={v.id}>{v.title}</option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white font-bold py-6">
                    <Upload className="w-4 h-4 mr-2" />
                    Add File
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}