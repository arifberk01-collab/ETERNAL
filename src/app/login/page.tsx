"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Heart, Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2, XCircle } from "lucide-react";

// ─── Toast Component ───────────────────────────────────────────────────────────
type ToastType = 'success' | 'error';
interface ToastState { message: string; type: ToastType; visible: boolean; }

function Toast({ toast }: { toast: ToastState }) {
    if (!toast.visible) return null;
    const isSuccess = toast.type === 'success';
    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-medium tracking-wide text-sm transition-all duration-500 animate-in slide-in-from-top-4 fade-in ${isSuccess ? 'bg-indigo-950/90 text-rose-400 border border-rose-500/30 backdrop-blur-xl' : 'bg-red-950/90 text-red-200 border border-red-500/30 backdrop-blur-xl'}`}>
            {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {toast.message}
        </div>
    );
}

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });
    const router = useRouter();

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLogin && password !== confirmPassword) {
            showToast("Şifreler eşleşmiyor", "error");
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                if (data.session) {
                    showToast("Başarıyla giriş yapıldı ✨");
                    router.push('/');
                }
            } else {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                if (data.session) {
                    showToast("Hesap başarıyla oluşturuldu ✨");
                    router.push('/');
                } else {
                    showToast("Lütfen e-postanızı doğrulayın 💖", "success");
                }
            }
        } catch (err: any) {
            // Friendly error messages
            const msg = err.message === 'Invalid login credentials'
                ? "E-posta veya şifre hatalı"
                : err.message === 'User already registered'
                    ? "Bu e-posta zaten kullanımda"
                    : err.message;
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
            <Toast toast={toast} />

            {/* ── Ambient glow orbs ── */}
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] bg-blue-500/8 rounded-full blur-[80px] pointer-events-none" />

            {/* ── Noise overlay ── */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay pointer-events-none" />

            {/* ── Login Card ── */}
            <div className="relative w-full max-w-[400px] mx-4 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">

                {/* Card inner glow */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 p-8 sm:p-10 flex flex-col gap-8">

                    {/* ── Brand header ── */}
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.2)] mb-1 group transition-all duration-700 hover:shadow-[0_0_40px_rgba(244,63,94,0.35)] hover:scale-105 cursor-default">
                            <Heart
                                size={28}
                                className="text-rose-400 fill-rose-400/30 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                            />
                        </div>
                        <h1 className="text-3xl font-light tracking-[0.15em] text-slate-100">
                            Eternal <span className="text-rose-400">✨</span>
                        </h1>
                        <p className="text-xs text-slate-400 font-light tracking-widest uppercase">
                            {isLogin ? "Hesabına Giriş Yap" : "Yeni Hesap Oluştur"}
                        </p>
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Email */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-400 transition-colors duration-500">
                                <Mail size={18} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder=" "
                                className="peer w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-100 outline-none pl-11 pr-4 pt-4 pb-1 font-light text-sm transition-all duration-500 focus:bg-white/10 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 placeholder:text-slate-600"
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-xs tracking-wider text-slate-400 duration-500 transform -translate-y-3 scale-75 top-3 left-11 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-rose-400 pointer-events-none"
                            >
                                E-posta
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-400 transition-colors duration-500">
                                <Lock size={18} />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=" "
                                className="peer w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-100 outline-none pl-11 pr-12 pt-4 pb-1 font-light text-sm transition-all duration-500 focus:bg-white/10 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 placeholder:text-slate-600"
                            />
                            <label
                                htmlFor="password"
                                className="absolute text-xs tracking-wider text-slate-400 duration-500 transform -translate-y-3 scale-75 top-3 left-11 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-rose-400 pointer-events-none"
                            >
                                Şifre
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors duration-300"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Confirm Password (Register only) */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${isLogin ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
                                }`}
                        >
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-400 transition-colors duration-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder=" "
                                    className="peer w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-100 outline-none pl-11 pr-12 pt-4 pb-1 font-light text-sm transition-all duration-500 focus:bg-white/10 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 placeholder:text-slate-600"
                                />
                                <label
                                    htmlFor="confirmPassword"
                                    className="absolute text-xs tracking-wider text-slate-400 duration-500 transform -translate-y-3 scale-75 top-3 left-11 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-rose-400 pointer-events-none"
                                >
                                    Şifre Tekrar
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors duration-300"
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative mt-2 h-14 w-full rounded-2xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-white font-medium tracking-wide text-sm shadow-[0_8px_30px_rgba(244,63,94,0.35)] hover:shadow-[0_8px_40px_rgba(244,63,94,0.5)] transition-all duration-500 overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {/* Shimmer effect */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white/80" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        <span>{isLogin ? "Giriş yapılıyor..." : "Hesap oluşturuluyor..."}</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} />
                                        <span>{isLogin ? "Eternal'a Giriş Yap" : "Hesap Oluştur"}</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* ── Toggle login / register ── */}
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-slate-500 font-light">
                            {isLogin ? "Hesabın yok mu?" : "Zaten hesabın var mı?"}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setPassword("");
                                setConfirmPassword("");
                            }}
                            className="text-rose-400 font-medium hover:text-rose-300 transition-colors duration-300 underline-offset-2 hover:underline"
                        >
                            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
                        </button>
                    </div>

                    {/* ── Tagline ── */}
                    <p className="text-center text-[10px] text-slate-600 font-light tracking-widest uppercase">
                        Your shared moments, beautifully remembered.
                    </p>
                </div>
            </div>
        </div>
    );
}
