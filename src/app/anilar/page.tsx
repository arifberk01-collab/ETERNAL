"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { AppMemory } from "@/lib/types";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MemoryCard } from "@/components/MemoryCard";
import { Upload, X } from 'lucide-react';

export default function MemoriesPage() {
    const router = useRouter();
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);
    const [memories, setMemories] = useState<AppMemory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMemory, setEditingMemory] = useState<AppMemory | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMemories();
    }, []);

    async function fetchMemories() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setSessionUserId(session.user.id);

            const { data, error } = await supabase
                .from('memories')
                .select('*')
                .order('dateISO', { ascending: false });
            if (error) console.error('Fetch error:', error.message);
            if (data) {
                setMemories(data);
            } else {
                setMemories([]); // Guard against null
            }
        } catch {
            setMemories([]);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenAdd = () => {
        setEditingMemory(null);
        setPreviewImage('');
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (memory: AppMemory) => {
        setEditingMemory(memory);
        setPreviewImage(memory.image || '');
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bu anıyı silmek istediğinize emin misiniz?')) {
            const { error } = await supabase.from('memories').delete().eq('id', id);
            if (error) {
                alert("Silinemedi: " + error.message);
            } else {
                setMemories(prev => prev.filter(m => m.id !== id));
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("Seçtiğiniz fotoğraf çok büyük! En fazla 10MB olabilir.");
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const uploadImage = async (file: File): Promise<string> => {
        // Try Supabase Storage first
        try {
            const fileExt = file.name.split('.').pop() ?? 'jpg';
            const fileName = `${crypto.randomUUID()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('photos')
                .upload(fileName, file, { upsert: false });

            if (!uploadError) {
                const { data: urlData } = supabase.storage
                    .from('photos')
                    .getPublicUrl(fileName);
                return urlData.publicUrl;
            }
            console.warn('Storage upload failed, falling back to base64:', uploadError.message);
        } catch (err) {
            console.warn('Storage unavailable, using base64 fallback', err);
        }

        // Fallback: return the base64 preview (already in state)
        return previewImage;
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const dateISO = formData.get('dateISO') as string;
        const description = formData.get('description') as string;

        let imageUrl = editingMemory?.image ?? '';

        // Only upload/update if a new file was selected
        if (selectedFile) {
            imageUrl = await uploadImage(selectedFile);
        } else if (previewImage) {
            imageUrl = previewImage;
        }

        if (editingMemory) {
            const { error } = await supabase
                .from('memories')
                .update({ title, dateISO, description, image: imageUrl })
                .eq('id', editingMemory.id);

            if (error) {
                alert("Güncelleme hatası: " + error.message);
            } else {
                setMemories(prev =>
                    prev.map(m => m.id === editingMemory.id
                        ? { ...m, title, dateISO, description, image: imageUrl }
                        : m
                    )
                );
                setIsModalOpen(false);
            }
        } else {
            if (!sessionUserId) {
                alert("Oturum bulunamadı, lütfen tekrar giriş yapın.");
                return;
            }

            const { data, error } = await supabase
                .from('memories')
                .insert([{ title, dateISO, description, image: imageUrl, user_id: sessionUserId }])
                .select()
                .single();

            if (error) {
                alert("Hata: " + error.message);
            } else if (data) {
                setMemories(prev => [data, ...prev]);
                setIsModalOpen(false);
            }
        }

        setSaving(false);
    };

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Yükleniyor...</div>;

    const safeMemories = memories || [];
    const sortedMemories = [...safeMemories].sort(
        (a, b) => new Date(b?.dateISO || 0).getTime() - new Date(a?.dateISO || 0).getTime()
    );

    return (
        <div className="flex flex-col gap-6 relative pb-6">
            {sortedMemories.length === 0 && (
                <div className="text-center text-gray-500 py-10 mt-10">Hiç anı yok. İlk anını ekle! 💙</div>
            )}

            <div className="relative pl-[18px] sm:pl-6 before:absolute before:inset-y-0 before:left-[11px] sm:before:left-[11px] before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-primary/20 before:to-transparent flex flex-col gap-8 mt-2">
                {sortedMemories.map(memory => (
                    <div key={memory.id} className="relative">
                        <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-4 h-4 rounded-full bg-primary ring-4 ring-background shrink-0" />
                        <MemoryCard
                            memory={memory}
                            onEdit={handleOpenEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                ))}
            </div>

            <FloatingActionButton onClick={handleOpenAdd} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMemory ? "Anıyı Düzenle" : "Yeni Anı Ekle"}>
                <form onSubmit={handleSave} className="flex flex-col gap-4 mt-2">
                    <Input name="title" label="Anı Başlığı" defaultValue={editingMemory?.title} required />
                    <Input name="dateISO" label="Tarih" type="date" defaultValue={editingMemory?.dateISO} required />
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-1.5">Açıklama</label>
                        <textarea
                            name="description"
                            defaultValue={editingMemory?.description}
                            className="w-full rounded-xl bg-gray-50 dark:bg-[#2C2C2E] border border-transparent focus:border-primary focus:ring-1 focus:ring-primary p-4 transition-all text-base outline-none resize-none min-h-[100px]"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium mb-1.5">Fotoğraf (Maks 10MB)</label>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

                        {previewImage ? (
                            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 group">
                                <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setPreviewImage(''); setSelectedFile(null); }}
                                    className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-primary transition-colors gap-2"
                            >
                                <Upload size={24} />
                                <span className="text-sm font-medium">Fotoğraf Yükle</span>
                            </button>
                        )}
                    </div>

                    <div className="pt-4 pb-10">
                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving ? 'Kaydediliyor...' : (editingMemory ? "Güncelle" : "Ekle")}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
