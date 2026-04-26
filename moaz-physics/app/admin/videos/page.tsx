"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Edit3,
  Film,
  Search,
  X,
  Upload,
  DollarSign,
  Check,
  Globe,
  Lock,
  ArrowLeft,
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  category: string;
  price: number;
  isFree: boolean;
  isPublished: boolean;
  createdAt: string;
  _count?: { purchases: number };
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    duration: 0,
    category: "Relativity",
    price: 0,
    isFree: true,
    isPublished: false,
  });

  const fetchVideos = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setVideos(data.videos);
    } catch {
      toast({ title: "Error", description: "Failed to load videos", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingVideo ? `/api/videos/${editingVideo.id}` : "/api/videos";
      const method = editingVideo ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast({
        title: "Success",
        description: editingVideo ? "Video updated" : "Video created",
      });

      setIsModalOpen(false);
      setEditingVideo(null);
      resetForm();
      fetchVideos();
    } catch {
      toast({ title: "Error", description: "Failed to save video", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast({ title: "Success", description: "Video deleted" });
      fetchVideos();
    } catch {
      toast({ title: "Error", description: "Failed to delete video", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      thumbnail: "",
      duration: 0,
      category: "Relativity",
      price: 0,
      isFree: true,
      isPublished: false,
    });
  };

  const openEditModal = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
      url: video.url,
      thumbnail: video.thumbnail || "",
      duration: video.duration || 0,
      category: video.category,
      price: video.price,
      isFree: video.isFree,
      isPublished: video.isPublished,
    });
    setIsModalOpen(true);
  };

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
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
                Video <span className="gradient-text">Manager</span>
              </h1>
              <p className="text-gray-400">Manage your course content</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingVideo(null);
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-neon-blue hover:bg-neon-blue/80 text-black font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl overflow-hidden group"
              >
                <div className="relative aspect-video bg-gradient-to-br from-space-700 to-space-800">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(video)}
                      className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-neon-blue/50 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-red-500/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      video.isFree
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-neon-blue/20 text-neon-blue"
                    }`}>
                      {video.isFree ? "FREE" : `$${video.price}`}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      video.isPublished
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {video.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-space font-bold text-white mb-1 line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {video.category}
                    </span>
                    <span>{video._count?.purchases || 0} purchases</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add/Edit Modal */}
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
                className="glass-strong rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-neon-blue/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-space font-bold text-white">
                    {editingVideo ? "Edit Video" : "Add New Video"}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Video URL</Label>
                      <Input
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Thumbnail URL</Label>
                      <Input
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Duration (sec)</Label>
                      <Input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Category</Label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white px-3"
                      >
                        <option value="Relativity">Relativity</option>
                        <option value="Quantum">Quantum</option>
                        <option value="Classical">Classical</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="bg-white/5 border-white/10 text-white"
                        disabled={formData.isFree}
                      />
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFree}
                        onChange={(e) => setFormData({ ...formData, isFree: e.target.checked, price: 0 })}
                        className="w-5 h-5 rounded border-white/20 bg-white/5"
                      />
                      <span className="text-gray-300">Free</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="w-5 h-5 rounded border-white/20 bg-white/5"
                      />
                      <span className="text-gray-300">Published</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold py-6"
                  >
                    {editingVideo ? "Update Video" : "Create Video"}
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