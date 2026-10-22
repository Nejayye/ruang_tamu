import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  Github, Twitter, Instagram, Linkedin, Send, Mail, User,
  Zap, VolumeX, Volume2, Menu as MenuIcon, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Lang = "EN" | "JP" | "ID";

const TRANSLATIONS: Record<Lang, {
  menu: string[];
  menuLabel: string;
  welcome: string;
  heroTitle: string[];
  heroTagline: string;
  heroSub: string;
  sectionSocial: string;
  sectionAbout: string;
  sectionContact: string;
  contactTitle: string;
  contactNameLabel: string; contactNamePlaceholder: string;
  contactMsgLabel: string; contactMsgPlaceholder: string;
  contactBtn: string;
  sectionConfig: string;
  cfgBgNoise: string; cfgBgNoiseDesc: string;
  cfgAnim: string; cfgAnimDesc: string;
  cfgNotif: string; cfgNotifDesc: string;
  cfgNotifMsg: string;
  cfgCursor: string; cfgCursorDesc: string;
  cfgLang: string; cfgLangDesc: string;
  cfgBgm: string; cfgBgmDesc: string;
  cfgReset: string; cfgResetDesc: string;
  cfgResetBtn: string;
}> = {
  EN: {
    menu: ["Introduction", "wat im fw", "Social", "About", "Contact", "Config"],
    menuLabel: "Menu",
    welcome: "Welcome",
    heroTitle: ["twin and", "folk"],
    heroTagline: "are ya smokin or nah cuh",
    heroSub: "lets be fr in here lads, ong no cap frfr",
    sectionSocial: "Social Links",
    sectionAbout: "About Me",
    sectionContact: "sending hate",
    contactTitle: "sending hate",
    contactNameLabel: "From", contactNamePlaceholder: "put yo name here",
    contactMsgLabel: "Message", contactMsgPlaceholder: "whatcu tryna say",
    contactBtn: "Dispatch",
    sectionConfig: "System Config",
    cfgBgNoise: "Background Noise", cfgBgNoiseDesc: "Enable CRT scanline and static effects",
    cfgAnim: "Battle Animations", cfgAnimDesc: "Enable heavy UI transitions",
    cfgNotif: "Notification Alerts", cfgNotifDesc: "Receive quest update notifications",
    cfgNotifMsg: "Quest alerts are now active. Stay sharp.",
    cfgCursor: "Cursor Style", cfgCursorDesc: "Choose your phantom thief cursor",
    cfgLang: "Language", cfgLangDesc: "Interface language setting",
    cfgBgm: "BGM Volume", cfgBgmDesc: "Background music level",
    cfgReset: "Reset All Settings", cfgResetDesc: "Restore factory defaults",
    cfgResetBtn: "Reset",
  },
  JP: {
    menu: ["自己紹介", "wat im fw", "ソーシャル", "について", "連絡先", "設定"],
    menuLabel: "メニュー",
    welcome: "ようこそ",
    heroTitle: ["迷子の", "旅人"],
    heroTagline: "バイブコーディング & ドゥームスクロール。",
    heroSub: "AIに限界まで仕事をさせろ。",
    sectionSocial: "ソーシャルリンク",
    sectionAbout: "自己紹介",
    sectionContact: "予告状を送る",
    contactTitle: "予告状を送る",
    contactNameLabel: "送信者", contactNamePlaceholder: "相手は誰ですか？",
    contactMsgLabel: "メッセージ", contactMsgPlaceholder: "意図を述べてください...",
    contactBtn: "送信",
    sectionConfig: "システム設定",
    cfgBgNoise: "バックグラウンドノイズ", cfgBgNoiseDesc: "CRTスキャンラインと静的エフェクトを有効にする",
    cfgAnim: "バトルアニメーション", cfgAnimDesc: "重いUIトランジションを有効にする",
    cfgNotif: "通知アラート", cfgNotifDesc: "クエスト更新通知を受け取る",
    cfgNotifMsg: "クエストアラートが有効になりました。油断するな。",
    cfgCursor: "カーソルスタイル", cfgCursorDesc: "怪盗のカーソルを選ぶ",
    cfgLang: "言語", cfgLangDesc: "インターフェース言語の設定",
    cfgBgm: "BGM音量", cfgBgmDesc: "バックグラウンドミュージックのレベル",
    cfgReset: "全設定をリセット", cfgResetDesc: "工場出荷時のデフォルトに戻す",
    cfgResetBtn: "リセット",
  },
  ID: {
    menu: ["Perkenalan", "wat im fw", "Sosial", "Tentang", "Kontak", "Konfigurasi"],
    menuLabel: "Menu",
    welcome: "Selamat Datang",
    heroTitle: ["twin and", "folk"],
    heroTagline: "are ya smokin or nah cuh",
    heroSub: "lets be fr in here lads, ong no cap frfr",
    sectionSocial: "Tautan Sosial",
    sectionAbout: "Tentang Saya",
    sectionContact: "sending hate",
    contactTitle: "sending hate",
    contactNameLabel: "Dari", contactNamePlaceholder: "put yo name here",
    contactMsgLabel: "Pesan", contactMsgPlaceholder: "whatcu tryna say",
    contactBtn: "Kirim",
    sectionConfig: "Konfigurasi Sistem",
    cfgBgNoise: "Kebisingan Latar", cfgBgNoiseDesc: "Aktifkan efek scanline CRT dan statis",
    cfgAnim: "Animasi Pertempuran", cfgAnimDesc: "Aktifkan transisi UI berat",
    cfgNotif: "Notifikasi Quest", cfgNotifDesc: "Terima notifikasi pembaruan quest",
    cfgNotifMsg: "Alert quest sekarang aktif. Tetap waspada.",
    cfgCursor: "Gaya Kursor", cfgCursorDesc: "Pilih kursor pencuri hantu kamu",
    cfgLang: "Bahasa", cfgLangDesc: "Pengaturan bahasa antarmuka",
    cfgBgm: "Volume BGM", cfgBgmDesc: "Level musik latar belakang",
    cfgReset: "Reset Semua Pengaturan", cfgResetDesc: "Kembalikan ke pengaturan default",
    cfgResetBtn: "Reset",
  },
};

function useBackgroundMusic(volumeLevel: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(volumeLevel);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    volumeRef.current = volumeLevel;
    if (audioRef.current) audioRef.current.volume = volumeLevel / 100;
  }, [volumeLevel]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.loop = true;
    audio.volume = volumeRef.current / 100;
    audio.muted = true;
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    let unmuteTimer: number | undefined;
    audio.play().then(() => {
      setIsPlaying(true);
      unmuteTimer = window.setTimeout(() => {
        if (!audio.paused) {
          audio.muted = false;
          audio.volume = volumeRef.current / 100;
        }
      }, 500);
    }).catch(() => setIsPlaying(false));

    return () => {
      if (unmuteTimer !== undefined) window.clearTimeout(unmuteTimer);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.muted = false;
      audio.volume = volumeRef.current / 100;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  return { audioRef, isPlaying, toggle };
}

export default function Home() {
  const [activeItem, setActiveItem] = useState("intro");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(75);
  const [cursorStyle, setCursorStyle] = useState("Default");
  const [language, setLanguage] = useState<Lang>("EN");
  const [notifications, setNotifications] = useState(false);
  const [battleAnimations, setBattleAnimations] = useState(true);
  const [bgNoise, setBgNoise] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);
  const [closingSite, setClosingSite] = useState(false);
  const [siteClosed, setSiteClosed] = useState(false);
  const [surpriseActive, setSurpriseActive] = useState(false);
  const [dispatchGifVisible, setDispatchGifVisible] = useState(false);
  const [socialGifVisible, setSocialGifVisible] = useState(false);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [toast, setToast] = useState<{ rank: number; title: string; msg: string } | null>(null);
  const [allOutAttack, setAllOutAttack] = useState(false);
  const shownAchievementsRef = useRef<Set<string>>(new Set());
  const allOutTriggeredRef = useRef(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const RAIN_CHARS = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      src: i % 2 === 0 ? "/char1.png" : "/char2.png",
      left: `${(i * 4.9 + 2) % 92}%`,
      delay: `${((i * 0.37) % 2.8).toFixed(2)}s`,
      duration: `${(2.8 + (i * 0.23) % 1.6).toFixed(2)}s`,
      size: `${80 + (i * 11) % 60}px`,
    })),
  []);

  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.play().catch(() => {});
  };

  const playTypingTick = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.022);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.025);
      osc.onended = () => ctx.close();
    } catch {}
  };

  const handleCloseSite = () => {
    playSound("/close-site.mp3");
    setSiteMenuOpen(false);
    setClosingSite(true);
    setTimeout(() => setSiteClosed(true), 1400);
  };

  const handleSurprise = () => {
    setSiteMenuOpen(false);
    setSurpriseActive((v) => !v);
  };

  const handleSocialClick = () => {
    playSound("/social-links.mp3");
    setSocialGifVisible(true);
    setTimeout(() => setSocialGifVisible(false), 1500);
  };

  const t = TRANSLATIONS[language];

  const MENU_ITEMS = [
    { id: "intro",     label: t.menu[0] },
    { id: "game-info", label: t.menu[1] },
    { id: "social",    label: t.menu[2] },
    { id: "about",     label: t.menu[3] },
    { id: "contact",   label: t.menu[4] },
    { id: "config",    label: t.menu[5] },
  ];

  const { audioRef, isPlaying, toggle: toggleMusic } = useBackgroundMusic(bgmVolume);

  const handleNotifications = async (enabled: boolean) => {
    if (enabled) {
      if (!("Notification" in window)) { setNotifications(false); return; }
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotifications(true);
        new Notification("Phantom Thief", { body: t.cfgNotifMsg, icon: "/favicon.svg" });
      } else {
        setNotifications(false);
      }
    } else {
      setNotifications(false);
    }
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMsg.trim()) return;
    playSound("/dispatch.mp3");
    setSendStatus("sending");
    try {
      const res = await fetch("https://ruang-tamu-snsw.vercel.app/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, message: contactMsg }),
      });
      if (res.ok) {
        setSendStatus("ok");
        setContactName("");
        setContactMsg("");
        setDispatchGifVisible(true);
        setTimeout(() => setDispatchGifVisible(false), 3200);
        setTimeout(() => setSendStatus("idle"), 4000);
      } else {
        setSendStatus("err");
        setTimeout(() => setSendStatus("idle"), 4000);
      }
    } catch {
      setSendStatus("err");
      setTimeout(() => setSendStatus("idle"), 4000);
    }
  };

  const cursorMap: Record<string, string> = { Default: "auto", Knife: "crosshair", Gun: "cell" };

  const scrollToSection = (id: string) => {
    playSound("/menu-select.mp3");
    setActiveItem(id);
    setMobileMenuOpen(false);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) setActiveItem(entry.target.id); });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/visits").then(r => r.json()).then((d: { count: number }) => setVisitCount(d.count)).catch(() => {});
  }, []);

  useEffect(() => {
    const ACHIEVEMENTS: Record<string, { rank: number; title: string; msg: string }> = {
      "game-info": { rank: 2, title: "TS WHAT I LOVE",        msg: "TUFF OR NAH." },
      "social":    { rank: 3, title: "CONNECTIONS FOUND",     msg: "lets moots tho." },
      "about":     { rank: 4, title: "TS ME GNG ONG",         msg: "WHO DIS GUY ." },
      "contact":   { rank: 5, title: "SENDING HATE",          msg: "why u bulleh meh." },
      "config":    { rank: 6, title: "SYSTEM INFILTRATED",    msg: "YESSIR YESSIR." },
    };
    if (activeItem && ACHIEVEMENTS[activeItem] && !shownAchievementsRef.current.has(activeItem)) {
      shownAchievementsRef.current.add(activeItem);
      const a = ACHIEVEMENTS[activeItem];
      setToast(a);
      setTimeout(() => setToast(null), 3500);
      if (shownAchievementsRef.current.size >= 5 && !allOutTriggeredRef.current) {
        allOutTriggeredRef.current = true;
        setTimeout(() => {
          setAllOutAttack(true);
          setTimeout(() => setAllOutAttack(false), 3200);
        }, 4000);
      }
    }
  }, [activeItem]);

  useEffect(() => {
    if (!activeItem) return;
    const LABELS: Record<string, string> = {
      intro:       "insert tittle",
      "game-info": "wat im fw",
      social:      "Social",
      about:       "Me btw",
      contact:     "send domth",
      config:      "Config",
    };
    const label = LABELS[activeItem] ?? activeItem;
    let i = 0;
    const interval = setInterval(() => {
      playTypingTick();
      i++;
      if (i >= label.length) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, [activeItem]);

  useEffect(() => {
    if (!siteClosed) return;
    const handler = () => window.location.reload();
    window.addEventListener("keydown", handler);
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);
    };
  }, [siteClosed]);

  return (
    <MotionConfig reducedMotion={battleAnimations ? "never" : "always"}>
    <div className="min-h-screen text-foreground font-sans relative overflow-hidden dark" style={{ cursor: cursorMap[cursorStyle] ?? "auto" }}>
      <audio ref={audioRef} src="/bgm-custom.mp3" autoPlay loop muted preload="auto" className="hidden" aria-hidden="true" />

      {/* Background */}
      <div className="fixed inset-0 -z-30 bg-cover bg-bottom bg-no-repeat" style={{ backgroundImage: "url('/bg.png')" }} />
      <div className="fixed inset-0 -z-20 bg-black/30" />
      {bgNoise && <><div className="noise" /><div className="scanline" /></>}

      {/* Watermark */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 translate-x-[10%] rotate-90 text-[20vw] font-display font-bold text-white/5 whitespace-nowrap pointer-events-none -z-20 leading-none tracking-tighter mix-blend-overlay hidden md:block">
        {MENU_ITEMS.find((m) => m.id === activeItem)?.label}
      </div>

      {/* Decorative */}
      <div className="fixed top-10 right-10 text-primary opacity-50 -z-10 hidden md:block"><Zap size={48} /></div>
      <div className="fixed bottom-20 left-[30%] text-primary opacity-30 -z-10 rotate-45 hidden md:block"><Zap size={64} /></div>

      {/* ── CLOSE SITE CURTAIN ── */}
      <AnimatePresence>
        {closingSite && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: "top" }}
            className="fixed inset-0 bg-black z-[9999] flex items-center justify-center"
          >
            <AnimatePresence>
              {siteClosed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center gap-4 select-none"
                >
                  <img src="/gif1.gif" alt="" className="w-36 h-28 md:w-52 md:h-40 object-contain" />
                  <span className="text-white font-display font-bold text-4xl md:text-5xl tracking-wider">ciao</span>
                  <GlitchText text="press any key to return" className="text-white/40 font-display text-xs md:text-sm tracking-widest mt-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DISPATCH GIF ── */}
      <AnimatePresence>
        {dispatchGifVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[500] pointer-events-none flex items-center justify-center"
          >
            <img src="/gif2.gif" alt="" className="w-64 h-64 md:w-[28rem] md:h-[28rem] object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SOCIAL GIF ── */}
      <AnimatePresence>
        {socialGifVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 pointer-events-none z-[300] flex items-center justify-center"
          >
            <img src="/gif3.gif" alt="" className="w-[85vw] h-[85vw] max-w-[480px] max-h-[480px] md:w-[520px] md:h-[520px] md:max-w-none object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ALL-OUT ATTACK ── */}
      <AnimatePresence>
        {allOutAttack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[8000] flex items-center justify-center overflow-hidden pointer-events-none"
          >
            <div className="absolute inset-0 bg-black" style={{ backgroundImage: "radial-gradient(circle, rgba(204,0,204,0.18) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="absolute w-px bg-primary/25 origin-center" style={{ height: "200%", transform: `rotate(${i * 22.5}deg)` }} />
              ))}
            </motion.div>
            <div className="absolute top-6 left-6 w-20 h-20 border-4 border-primary rotate-45 opacity-70" />
            <div className="absolute top-6 right-6 w-10 h-10 bg-primary rotate-45 opacity-70" />
            <div className="absolute bottom-6 left-6 w-10 h-10 bg-primary rotate-45 opacity-70" />
            <div className="absolute bottom-6 right-6 w-20 h-20 border-4 border-primary rotate-45 opacity-70" />
            <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="bg-primary text-black font-display font-bold text-xs md:text-sm px-8 py-2 tracking-[0.3em] transform -skew-x-12"
              >
                ★ ALL-OUT ATTACK ★
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.2, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 280, damping: 20 }}
                className="font-display font-bold text-5xl sm:text-6xl md:text-8xl tracking-wider transform -skew-x-6 leading-tight"
                style={{ color: "white", WebkitTextStroke: "3px #cc00cc", textShadow: "0 0 40px rgba(204,0,204,0.9), 0 0 80px rgba(204,0,204,0.4)" }}
              >
                INFILTRATION<br />COMPLETE!
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="text-primary font-display font-bold text-sm md:text-base tracking-[0.25em]"
              >
                — Random Tourist —
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ACHIEVEMENT TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.title}
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed bottom-6 right-4 md:right-6 z-[600] w-72 md:w-80 pointer-events-none"
          >
            <div className="bg-black border-4 border-primary transform -skew-x-3 shadow-[4px_4px_0_0_rgba(204,0,204,1)] p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <div className="text-primary font-display font-bold text-xs tracking-widest mb-1.5 flex items-center gap-1">
                {"★".repeat(toast.rank)}<span className="ml-2">RANK {toast.rank}</span>
              </div>
              <div className="text-white font-display font-bold text-sm md:text-base tracking-wide leading-tight">{toast.title}</div>
              <div className="text-white/60 text-xs mt-1.5 font-bold tracking-wide">{toast.msg}</div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/40" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SURPRISE RAIN ── */}
      {surpriseActive && (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
          {RAIN_CHARS.map((c) => (
            <img
              key={c.id}
              src={c.src}
              alt=""
              className="absolute top-0 rain-char"
              style={{
                left: c.left,
                width: c.size,
                animationDuration: c.duration,
                animationDelay: c.delay,
              }}
            />
          ))}
          <button
            onClick={() => setSurpriseActive(false)}
            className="pointer-events-auto fixed top-4 right-4 bg-black/70 border border-white/30 text-white font-display font-bold px-4 py-2 text-sm z-[201]"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── TOP BAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 h-14 md:h-auto md:top-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setSiteMenuOpen((v) => !v)}
              className="bg-primary text-white font-display font-bold px-4 py-1 p5-clip transform -skew-x-12 text-lg md:text-xl tracking-wider cursor-pointer hover:brightness-110 transition-all"
            >
              {t.menuLabel}
            </button>
            <AnimatePresence>
              {siteMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
                  transition={{ duration: 0.15 }}
                  style={{ transformOrigin: "top" }}
                  className="absolute top-full left-0 mt-2 flex flex-col gap-1 min-w-[160px] z-50"
                >
                  <button
                    onClick={handleCloseSite}
                    className="bg-black border-2 border-white/30 text-white font-display font-bold px-4 py-2 text-sm tracking-wide text-left hover:bg-primary hover:border-primary transition-all transform -skew-x-6"
                  >
                    Close Site
                  </button>
                  <button
                    onClick={handleSurprise}
                    className="bg-black border-2 border-white/30 text-white font-display font-bold px-4 py-2 text-sm tracking-wide text-left hover:bg-primary hover:border-primary transition-all transform -skew-x-6"
                  >
                    {surpriseActive ? "Stop Surprise" : "Surprise"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="w-8 md:w-12 h-1 bg-white transform -skew-x-12 hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="button-music-toggle"
            onClick={toggleMusic}
            className={`flex items-center gap-1.5 font-display font-bold text-xs px-3 py-2 border-2 transform -skew-x-6 tracking-wider transition-all ${
              isPlaying ? "bg-primary border-primary text-white" : "bg-black/60 border-white/40 text-white/70 hover:border-white"
            }`}
          >
            {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden sm:inline">BGM</span>
          </button>
          <button
            data-testid="button-mobile-menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden bg-black/60 border-2 border-white/40 text-white p-2 transform -skew-x-6"
          >
            {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/80" onClick={() => setMobileMenuOpen(false)} />
            <nav className="absolute top-0 left-0 h-full w-72 bg-transparent border-r-4 border-primary flex flex-col justify-center gap-3 px-6 pt-16 overflow-hidden">
              <div className="absolute top-0 left-6 w-0.5 h-full bg-primary/30" />
              {MENU_ITEMS.map((item, index) => {
                const isActive = activeItem === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ x: -60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.06 }}
                    onClick={() => scrollToSection(item.id)}
                    data-testid={`mobile-nav-${item.id}`}
                    className={`relative text-left font-display font-bold text-xl tracking-wide transform -skew-x-12 px-5 py-3 overflow-hidden border-2 transition-all ${
                      isActive ? "bg-primary border-primary text-white scale-105 ml-3" : "bg-black/70 border-white/20 text-white/80"
                    }`}
                  >
                    {item.label}
                    {isActive && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rotate-45" />}
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex h-screen overflow-hidden relative z-10 pt-14 md:pt-20">

        {/* Desktop Sidebar */}
        <nav className="hidden md:flex w-72 lg:w-80 flex-shrink-0 flex-col justify-center pl-8 lg:pl-10 gap-3 z-40 h-full pb-20 relative overflow-hidden">
          <div className="absolute top-0 left-8 w-2 h-full bg-white/10" />
          <div className="absolute top-0 left-[38px] w-0.5 h-full bg-primary/30" />
          {MENU_ITEMS.map((item, index) => {
            const isActive = activeItem === item.id;
            const isHovered = hoveredItem === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeLine"
                      className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-2 bg-primary"
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                    />
                  )}
                </AnimatePresence>
                <button
                  onClick={() => scrollToSection(item.id)}
                  data-testid={`nav-${item.id}`}
                  className={`relative block w-full text-left font-display font-bold text-xl lg:text-2xl tracking-wide transition-all duration-200 transform -skew-x-12 px-5 lg:px-6 py-3 overflow-hidden group ${
                    isActive ? "text-white scale-110 ml-4" : "text-white/75 hover:text-white"
                  }`}
                  style={{ textShadow: isActive ? "2px 2px 0px #000" : "none" }}
                >
                  <div className={`absolute inset-0 transition-all duration-300 z-[-1] border-2 ${
                    isActive ? "bg-primary border-primary translate-x-0"
                      : isHovered ? "bg-primary/20 border-primary/50 translate-x-2"
                        : "bg-black/60 border-white/20 -translate-x-4"
                  }`} />
                  {(isActive || isHovered) && (
                    <div className="absolute inset-0 z-[-1] opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]" />
                  )}
                  <span className="relative z-10 flex items-center justify-between">
                    {item.label}
                    {isActive && <div className="w-3 h-3 bg-white rotate-45" />}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto h-full scroll-smooth scrollbar-hide snap-y snap-mandatory px-4 sm:px-8 md:px-10 lg:px-12 pb-24 relative">

          {/* INTRODUCTION */}
          <Section id="intro" ref={(el) => { sectionRefs.current["intro"] = el; }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex flex-col justify-center h-full max-w-4xl w-full"
            >
              <div className="mb-2">
                <div className="bg-primary text-black font-display font-bold text-base md:text-xl px-4 py-1 p5-clip transform -skew-x-12 inline-block mb-3">
                  {t.welcome}
                </div>
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold text-white leading-none transform -skew-x-6 relative">
                  <span className="block text-primary transform translate-x-[-4px] translate-y-[4px] absolute inset-0 -z-10">{t.heroTitle[0]}</span>
                  <span className="block text-black" style={{ WebkitTextStroke: "2px white" }}>{t.heroTitle[0]}</span>
                  <span className="block">{t.heroTitle[1]}</span>
                </h1>
              </div>
              <div className="bg-white text-black font-bold p-4 md:p-6 transform -skew-x-6 mt-6 md:mt-8 max-w-2xl relative border-l-8 border-primary">
                <div className="absolute top-0 right-0 w-8 h-8 bg-background transform translate-x-4 -translate-y-4 rotate-45" />
                <p className="text-lg md:text-xl lg:text-2xl font-display">{t.heroTagline}</p>
                <p className="text-base md:text-lg text-black/70 mt-2">{t.heroSub}</p>
              </div>
              {visitCount !== null && (
                <div className="flex items-center gap-2 mt-5">
                  <div className="bg-black border-2 border-primary text-primary font-display font-bold text-xs md:text-sm px-4 py-1.5 transform -skew-x-12 tracking-widest">
                    INFILTRATORS: {visitCount.toLocaleString()}
                  </div>
                </div>
              )}
            </motion.div>
          </Section>

          {/* TOP 3 FAVORITES */}
          <Section id="game-info" ref={(el) => { sectionRefs.current["game-info"] = el; }}>
            <div className="max-w-6xl w-full px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                <TopThreeList
                  title="TOP 3 CHARACTERS"
                  items={[
                    { name: "Araragi Koyomi", image: "/top3-araragi.jpg", description: "altruistic blud" },
                    { name: "Gilgamesh", image: "/top3-gilgamesh.jpg", description: "mongrel guy" },
                    { name: "Fyodor Dostoyevsky", image: "/top3-fyodor.jpg", description: "russian hat guy" },
                  ]}
                />
                <TopThreeList
                  title="TOP 3 VIDEO GAMES"
                  items={[
                    { name: "Persona 4 Golden", image: "/top3-persona4-golden.jpg", description: "where do i even begin..." },
                    { name: "Fate/Extella Link", image: "/top3-fate-extella-link.jpg", description: "charlegmane tuff ash" },
                    {
                      name: "Shin Megami Tensei: Nocturne",
                      image: "/top3-shin-megami-tensei-nocturne.jpg",
                      descriptionImage: "/raidou-meme.jpg",
                      descriptionImageCount: 20,
                    },
                  ]}
                />
                <TopThreeList
                  title="TOP 3 ARTISTS"
                  items={[
                    { name: "Kanye West", image: "/top3-kanye-west.jpg", description: "goat, t1 human" },
                    { name: "Playboi Carti", image: "/top3-playboi-carti.jpg", description: "me young me vamp me live" },
                    { name: "Van Gogh", image: "/top3-van-gogh.jpg", description: "idk who is dis" },
                  ]}
                />
              </div>
            </div>
          </Section>

          {/* SOCIAL */}
          <Section id="social" ref={(el) => { sectionRefs.current["social"] = el; }}>
            <div className="max-w-4xl w-full">
              <SectionTitle title={t.sectionSocial} tooltip="OPERATIVE NETWORK MAPPED" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-10 md:mt-12">
                <SocialCard platform="Github" username="@nejayye" icon={<Github size={36} />} link="https://github.com/Nejayye" color="bg-gray-800" onBeforeNavigate={handleSocialClick} />
                <SocialCard platform="X" username="@nejayye" icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>} link="https://x.com/nejayye" color="bg-zinc-950" onBeforeNavigate={handleSocialClick} />
                <SocialCard platform="Instagram" username="@nejayye" icon={<Instagram size={36} />} link="https://www.instagram.com/nejayye" color="bg-pink-900" onBeforeNavigate={handleSocialClick} />
                <SocialCard platform="Discord" username="@czenestza" icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>} link="https://discordapp.com/users/548497002787373066" color="bg-indigo-700" onBeforeNavigate={handleSocialClick} />
              </div>
            </div>
          </Section>

          {/* ABOUT */}
          <Section id="about" ref={(el) => { sectionRefs.current["about"] = el; }}>
            <div className="max-w-4xl w-full">
              <SectionTitle title={t.sectionAbout} tooltip="IDENTITY PROFILE UNLOCKED" />
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-10 md:mt-12 items-center">
                <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-zinc-900 border-4 border-white p5-clip transform rotate-3 flex-shrink-0 relative overflow-hidden group">
                  <img src="/about-tohru-adachi.jpg" alt="Tohru Adachi" className="w-full h-full object-cover relative z-0" />
                </div>
                <div className="bg-black/80 border border-white/20 p-6 md:p-8 transform -skew-x-3 relative">
                  <div className="absolute top-0 right-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] pointer-events-none" />
                  <p className="text-lg md:text-xl leading-relaxed relative z-10">
                    im a nihilism guy, life has no meanings type shi frfr
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* CONTACT */}
          <Section id="contact" ref={(el) => { sectionRefs.current["contact"] = el; }}>
            <div className="max-w-3xl w-full mx-auto">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-white transform rotate-45 z-0" />
                <div className="bg-white text-black relative z-10 border-8 border-black shadow-[8px_8px_0_0_rgba(204,0,204,1)] md:shadow-[16px_16px_0_0_rgba(204,0,204,1)] overflow-hidden">
                  <div className="w-full h-36 md:h-52 overflow-hidden border-b-4 border-black">
                    <img src="/calling-card-banner.png" alt="Calling Card Banner" className="w-full h-full object-cover object-center" />
                  </div>
                  <div className="p-6 md:p-10 lg:p-12">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 md:mb-8 flex items-center gap-3 md:gap-4 tracking-wide">
                    <Mail className="text-primary" size={36} />
                    {t.contactTitle}
                  </h2>
                  <form className="space-y-5 md:space-y-6" onSubmit={handleDispatch}>
                    <div className="space-y-2">
                      <Label className="text-base md:text-lg font-display font-bold tracking-wide text-black">{t.contactNameLabel}</Label>
                      <Input
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        disabled={sendStatus === "sending"}
                        className="border-4 border-black rounded-none text-base md:text-lg p-4 md:p-6 bg-gray-100 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:bg-white transition-colors"
                        placeholder={t.contactNamePlaceholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base md:text-lg font-display font-bold tracking-wide text-black">{t.contactMsgLabel}</Label>
                      <Textarea
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        required
                        disabled={sendStatus === "sending"}
                        className="border-4 border-black rounded-none text-base md:text-lg p-4 md:p-6 bg-gray-100 min-h-[120px] md:min-h-[150px] focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:bg-white transition-colors resize-none"
                        placeholder={t.contactMsgPlaceholder}
                      />
                    </div>
                    {sendStatus === "ok" && (
                      <div className="bg-green-500 text-white font-display font-bold px-4 py-3 text-center transform -skew-x-6">
                        ✓ Calling card dispatched to Discord!
                      </div>
                    )}
                    {sendStatus === "err" && (
                      <div className="bg-primary text-white font-display font-bold px-4 py-3 text-center transform -skew-x-6">
                        ✗ Dispatch failed. Try again.
                      </div>
                    )}
                    <Button
                      type="submit"
                      data-testid="button-dispatch"
                      disabled={sendStatus === "sending"}
                      className="w-full bg-primary hover:bg-black text-white border-4 border-black rounded-none text-xl md:text-2xl font-display font-bold py-6 md:py-8 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {sendStatus === "sending" ? "Dispatching..." : <>{t.contactBtn} <Send className="group-hover:translate-x-2 transition-transform" /></>}
                    </Button>
                  </form>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* CONFIG */}
          <Section id="config" ref={(el) => { sectionRefs.current["config"] = el; }}>
            <div className="max-w-3xl w-full mx-auto">
              <SectionTitle title={t.sectionConfig} tooltip="SYSTEM PARAMETERS EXPOSED" />
              <div className="bg-black/50 border-2 border-white/10 p-6 md:p-8 transform skew-x-0 md:skew-x-2 mt-10 md:mt-12 space-y-6 md:space-y-8">

                <ConfigRow title={t.cfgBgNoise} description={t.cfgBgNoiseDesc}>
                  <Switch checked={bgNoise} onCheckedChange={setBgNoise} className="data-[state=checked]:bg-primary" />
                </ConfigRow>
                <div className="w-full h-px bg-white/10" />

                <ConfigRow title={t.cfgAnim} description={t.cfgAnimDesc}>
                  <Switch checked={battleAnimations} onCheckedChange={setBattleAnimations} className="data-[state=checked]:bg-primary" />
                </ConfigRow>
                <div className="w-full h-px bg-white/10" />

                <ConfigRow title={t.cfgNotif} description={t.cfgNotifDesc}>
                  <Switch checked={notifications} onCheckedChange={handleNotifications} className="data-[state=checked]:bg-primary" />
                </ConfigRow>
                <div className="w-full h-px bg-white/10" />

                <ConfigRow title={t.cfgCursor} description={t.cfgCursorDesc}>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {["Default", "Knife", "Gun"].map((opt) => (
                      <button key={opt} data-testid={`cursor-option-${opt.toLowerCase()}`}
                        onClick={() => setCursorStyle(opt)}
                        className={`font-display font-bold text-xs px-3 py-2 border-2 transform -skew-x-6 tracking-wide transition-all ${cursorStyle === opt ? "bg-primary border-primary text-white" : "bg-transparent border-white/30 text-white/50 hover:border-white/70"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </ConfigRow>
                <div className="w-full h-px bg-white/10" />

                <ConfigRow title={t.cfgLang} description={t.cfgLangDesc}>
                  <div className="flex gap-2">
                    {(["EN", "JP", "ID"] as Lang[]).map((lang) => (
                      <button key={lang} data-testid={`lang-option-${lang.toLowerCase()}`}
                        onClick={() => setLanguage(lang)}
                        className={`font-display font-bold text-xs px-3 py-2 border-2 transform -skew-x-6 tracking-wide transition-all ${language === lang ? "bg-primary border-primary text-white" : "bg-transparent border-white/30 text-white/50 hover:border-white/70"}`}>
                        {lang}
                      </button>
                    ))}
                  </div>
                </ConfigRow>
                <div className="w-full h-px bg-white/10" />

                <ConfigRow title={t.cfgBgm} description={t.cfgBgmDesc}>
                  <div className="flex items-center gap-3">
                    <input data-testid="slider-bgm-volume" type="range" min={0} max={100} value={bgmVolume}
                      onChange={(e) => setBgmVolume(Number(e.target.value))}
                      className="w-28 md:w-36 accent-primary cursor-pointer" />
                    <span className="font-display font-bold text-xl w-8 text-right">{bgmVolume}</span>
                  </div>
                </ConfigRow>
                <div className="w-full h-px bg-white/10" />

                <ConfigRow title={t.cfgReset} description={t.cfgResetDesc}>
                  <button data-testid="button-reset-config"
                    onClick={() => { setBgmVolume(75); setCursorStyle("Default"); setLanguage("EN"); setNotifications(false); setBattleAnimations(true); setBgNoise(true); }}
                    className="font-display font-bold text-xs px-5 py-2 border-2 border-primary text-primary transform -skew-x-6 tracking-wide hover:bg-primary hover:text-white transition-all">
                    {t.cfgResetBtn}
                  </button>
                </ConfigRow>

              </div>
            </div>
          </Section>

        </main>
      </div>
    </div>
    </MotionConfig>
  );
}

const Section = React.forwardRef<HTMLDivElement, { id: string; children: React.ReactNode }>(
  ({ id, children }, ref) => (
    <section id={id} ref={ref} className="min-h-screen flex items-center justify-center snap-start py-16 md:py-20">
      {children}
    </section>
  )
);
Section.displayName = "Section";

const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  const [typed, setTyped] = React.useState(0);
  const [glitchIdx, setGlitchIdx] = React.useState<number | null>(null);
  const GLYPH = "!@#$%01░▒█<>/?\\";
  React.useEffect(() => {
    let i = 0;
    const typeId = setInterval(() => {
      i++;
      setTyped(i);
      if (i >= text.length) clearInterval(typeId);
    }, 55);
    const glitchId = setInterval(() => {
      if (i >= text.length) {
        const pos = Math.floor(Math.random() * text.length);
        setGlitchIdx(pos);
        setTimeout(() => setGlitchIdx(null), 90);
      }
    }, 700);
    return () => { clearInterval(typeId); clearInterval(glitchId); };
  }, [text]);
  return (
    <span className={className}>
      {text.split("").map((orig, i) => (
        <span key={i} style={{ opacity: i < typed ? 1 : 0, color: glitchIdx === i ? "#cc00cc" : "inherit", transition: "color 0.05s" }}>
          {glitchIdx === i ? GLYPH[Math.floor(Math.random() * GLYPH.length)] : orig}
        </span>
      ))}
      {typed < text.length && <span className="animate-pulse opacity-60">█</span>}
    </span>
  );
};

const SectionTitle = ({ title, tooltip }: { title: string; tooltip?: string }) => {
  const [scanning, setScanning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (revealed || !tooltip) return;
    setScanning(true);
    scanTimerRef.current = setTimeout(() => {
      setScanning(false);
      setRevealed(true);
    }, 820);
  };

  const handleMouseLeave = () => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    setScanning(false);
    setRevealed(false);
  };

  return (
    <div
      className="relative inline-block cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-3 md:w-4 h-full bg-primary transform -skew-x-12" />
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-wide transform -skew-x-6 relative z-10 pl-3 md:pl-4">
        {title}
      </h2>
      <div className="absolute bottom-1 left-0 w-full h-3 bg-white/20 transform -skew-x-6 z-0" />

      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: "105%" }}
            transition={{ duration: 0.75, ease: "linear" }}
            className="absolute top-0 h-full w-[3px] bg-primary z-20 pointer-events-none"
            style={{ boxShadow: "0 0 14px 5px rgba(204,0,204,0.75)" }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {revealed && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 -bottom-9 z-50 pointer-events-none"
          >
            <div className="bg-black border-2 border-primary text-primary font-display font-bold text-[11px] md:text-xs tracking-widest px-4 py-1.5 -skew-x-3 whitespace-nowrap shadow-[3px_3px_0_0_rgba(204,0,204,0.6)]">
              ▶ {tooltip}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TopThreeList = ({
  title,
  items,
}: {
  title: string;
  items: {
    name: string;
    image?: string;
    description?: string;
    descriptionImage?: string;
    descriptionImageCount?: number;
  }[];
}) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.45 }}
    className="relative min-w-0 overflow-hidden bg-zinc-950/95 border-2 border-white/15 transform -skew-x-2 shadow-[5px_5px_0_0_rgba(204,0,204,0.45)]"
  >
    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
    <div className="absolute top-0 left-0 w-1 h-full bg-primary/70" />
    <div className="relative px-4 md:px-5 py-5 md:py-6">
      <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-3 mb-3">
        <h3 className="text-primary font-display font-bold text-sm md:text-base tracking-widest leading-tight">
          {title}
        </h3>
        <span className="text-white/40 font-display text-[10px] tracking-widest whitespace-nowrap">01—03</span>
      </div>
      <ol className="space-y-2">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center gap-3 min-h-12 border-b border-white/10 last:border-0 last:pb-0 pb-2">
            {item.image ? (
              <div className="relative w-20 h-20 aspect-square shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full aspect-square object-cover border-2 border-primary"
                />
                <span className="absolute -top-1.5 -left-1.5 w-6 h-6 flex items-center justify-center bg-primary text-black font-display font-bold text-sm transform -skew-x-6">
                  <span className="transform skew-x-6">{index + 1}</span>
                </span>
              </div>
            ) : (
              <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-primary text-black font-display font-bold text-lg transform -skew-x-6">
                <span className="transform skew-x-6">{index + 1}</span>
              </span>
            )}
            <div className="min-w-0">
              <div className="text-white font-display font-bold text-sm md:text-base leading-snug break-words">
                {item.name}
              </div>
              {item.description && (
                <p className="font-sans font-normal text-sm text-white/70 leading-snug mt-1">
                  {item.description}
                </p>
              )}
              {item.descriptionImage && (
                <div
                  role="img"
                  aria-label={`${item.descriptionImageCount ?? 1} repeated description images`}
                  className="mt-1 flex flex-wrap gap-0.5"
                >
                  {Array.from({ length: item.descriptionImageCount ?? 1 }, (_, imageIndex) => (
                    <img
                      key={imageIndex}
                      src={item.descriptionImage}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="w-[14px] h-[14px] shrink-0 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  </motion.article>
);

const SocialCard = ({ platform, username, icon, link, color, onBeforeNavigate }: { platform: string; username: string; icon: React.ReactNode; link: string; color: string; onBeforeNavigate?: () => void }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onBeforeNavigate) {
      e.preventDefault();
      onBeforeNavigate();
      setTimeout(() => window.open(link, "_blank", "noopener,noreferrer"), 1100);
    }
  };
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" onClick={handleClick} data-testid={`social-card-${platform.toLowerCase()}`}
      className={`block p-5 md:p-6 ${color} border-4 border-transparent hover:border-primary transform -skew-x-6 transition-all hover:scale-105 hover:z-10 relative group overflow-hidden`}>
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="text-xs md:text-sm font-bold opacity-70 tracking-wide">{platform}</div>
          <div className="text-xl md:text-2xl font-display font-bold mt-1">{username}</div>
        </div>
        <div className="text-white/80 group-hover:text-white transition-colors transform group-hover:rotate-12">{icon}</div>
      </div>
    </a>
  );
};

const ConfigRow = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 flex-wrap">
    <div className="min-w-0">
      <div className="text-lg md:text-2xl font-display font-bold tracking-wide text-white">{title}</div>
      <div className="text-xs md:text-sm text-white/50 mt-1">{description}</div>
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);
