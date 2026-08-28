import { useRef, useEffect, useState } from "react"
const PORTFOLIO_PASSWORD = "5811"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion"

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  y = 36,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px 0px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Custom cursor ─────────────────────────────────────────────────────────────
function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)
  const sp = { stiffness: 500, damping: 40 }
  const x = useSpring(pos.x, sp)
  const y = useSpring(pos.y, sp)

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const over = (e: MouseEvent) => {
      setHovered(!!(e.target as HTMLElement).closest("a,button,[data-hover]"))
    }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseover", over)
    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseover", over)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-multiply hidden md:block"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={{
          width: hovered ? 44 : 9,
          height: hovered ? 44 : 9,
          opacity: hovered ? 0.18 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="rounded-full bg-[#1a1a2e]"
      />
    </motion.div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "ホーム", id: "home" },
  { label: "プロフィール", id: "profile" },
  { label: "制作実績", id: "works" },
  { label: "お問合せ", id: "contact" },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-14 py-5 transition-all duration-300 ${
          scrolled
            ? "bg-[#faf9f7]/90 backdrop-blur-md border-b border-[#1a1a2e]/8"
            : ""
        }`}
      >
        <motion.button
          className="font-['Fraunces'] text-base font-bold tracking-tight text-[#1a1a2e]"
          onClick={() => go("home")}
          whileHover={{ letterSpacing: "0.04em" }}
          transition={{ duration: 0.3 }}
        >
          KATSUNOSHIN UTSUMI
        </motion.button>

        <div className="hidden md:flex gap-8">
          {navLinks.map((l) => (
            <motion.button
              key={l.id}
              onClick={() => go(l.id)}
              className="text-sm font-['Inter'] text-[#1a1a2e]/60 hover:text-[#c0392b] transition-colors relative group"
              whileHover={{ y: -1 }}
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#c0392b] group-hover:w-full transition-all duration-300" />
            </motion.button>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 w-6"
          onClick={() => setOpen(!open)}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }}
            className="block h-px w-full bg-[#1a1a2e]"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            className="block h-px w-full bg-[#1a1a2e]"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }}
            className="block h-px w-full bg-[#1a1a2e]"
          />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 bg-[#1a1a2e] flex flex-col items-center justify-center gap-10"
          >
            {navLinks.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.07 + 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-['Fraunces'] text-4xl font-light text-[#faf9f7] hover:text-[#c0392b] transition-colors"
                onClick={() => go(l.id)}
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex items-end pb-20 px-6 md:px-14 overflow-hidden bg-[#faf9f7]"
    >
      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[20, 40, 60, 80].map((pct, i) => (
          <motion.div
            key={pct}
            className="absolute top-0 bottom-0 w-px bg-[#1a1a2e]/5"
            style={{ left: `${pct}%` }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              duration: 1.4,
              delay: i * 0.08 + 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </div>

      {/* Orbiting accent */}
      <motion.div
        className="absolute top-20 right-8 md:right-28 w-48 h-48 md:w-72 md:h-72 rounded-full border border-[#c0392b]/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-32 right-20 md:right-44 w-28 h-28 md:w-44 md:h-44 rounded-full bg-[#c0392b]/8"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hero image — desk art from WIX */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block overflow-hidden"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="https://static.wixstatic.com/media/11062b_077aff6b883a46d5b8ea0886f27185e7~mv2.jpe/v1/fill/w_940,h_550,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%E3%83%9B%E3%83%BC%E3%83%A0%E3%83%87%E3%82%B9%E3%82%AF%E3%82%A2%E3%83%BC%E3%83%88.jpe"
          alt="ホームデスクアート"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f7] via-[#faf9f7]/20 to-transparent" />
      </motion.div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-2xl">
        <motion.p
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs font-['Inter'] tracking-widest text-[#8a8680] uppercase mb-6"
        >
          WEBデザイナー · グラフィックデザイナー · イラストレーター
        </motion.p>

        <h1 className="font-['Fraunces'] text-[clamp(2.8rem,8vw,7.5rem)] font-[300] leading-[0.93] tracking-tight text-[#1a1a2e]">
          {["KATSUNOSHIN", "UTSUMI", "Portfolio"].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.95,
                  delay: i * 0.14 + 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {i === 2 ? (
                  <em className="italic text-[#c0392b]">{line}</em>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-6 text-sm text-[#8a8680] font-['Inter'] font-[300] leading-relaxed max-w-sm"
        >
          WEBデザイナー / グラフィックデザイナー / イラストレーター — 1996年7月11日生まれ。福岡出身。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-10 flex gap-4 items-center flex-wrap"
        >
          <motion.button
            className="bg-[#1a1a2e] text-[#faf9f7] px-8 py-4 text-sm font-['Inter'] tracking-wide hover:bg-[#c0392b] transition-colors duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              document
                .getElementById("works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            制作実績を見る
          </motion.button>
          <motion.button
            className="border border-[#1a1a2e]/30 text-[#1a1a2e] px-8 py-4 text-sm font-['Inter'] tracking-wide hover:border-[#c0392b] hover:text-[#c0392b] transition-colors duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              document
                .getElementById("profile")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            プロフィールを見る
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-6 md:right-14 flex items-center gap-2 text-xs text-[#8a8680] font-['Inter']"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          ↓
        </motion.span>
        スクロール
      </motion.div>
    </section>
  )
}

// ── Profile ───────────────────────────────────────────────────────────────────
function Profile() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const x = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

  return (
    <section id="profile" className="py-28 overflow-hidden bg-[#faf9f7]">
      {/* Marquee */}
      <div className="border-y border-[#1a1a2e]/8 py-4 mb-24 overflow-hidden">
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="font-['Fraunces'] text-2xl font-[300] italic text-[#1a1a2e]/15 shrink-0"
            >
              WEBデザイン · グラフィックデザイン · イラスト · 映像制作 · UI/UX・AIツール開発
              ·&nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      <div
        className="px-6 md:px-14 grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
        ref={ref}
      >
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden bg-[#e8e5df]">
              <motion.img
                src="https://static.wixstatic.com/media/11062b_72ef542be0124c9f8985cf5aaa91eed0~mv2.jpe/v1/fill/w_940,h_420,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%E8%91%89%E3%81%AE%E6%8F%8F%E7%94%BB.jpe"
                alt="葉の描画"
                className="w-full h-full object-cover"
                style={{ x }}
              />
            </div>
            <motion.div
              className="absolute -bottom-4 -right-4 bg-[#c0392b] px-5 py-4"
              whileHover={{ scale: 1.06 }}
            >
              <span className="font-['Fraunces'] text-[#faf9f7] text-sm italic block">
                Illustrator
              </span>
              <span className="font-['Fraunces'] text-[#faf9f7] text-sm italic block">
                & Designer
              </span>
            </motion.div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xs font-['Inter'] tracking-widest text-[#8a8680] uppercase mb-4">
              Profile
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-['Fraunces'] text-4xl md:text-5xl font-[300] text-[#1a1a2e] leading-tight mb-8">
              デザインで
              <br />
              ビジョンを
              <br />
              <em className="italic text-[#c0392b]">カタチに。</em>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="text-[#8a8680] font-['Inter'] font-[300] leading-relaxed mb-5 text-sm">
              １９９６年７月１１日生まれ。福岡育出身。趣味は野球観戦（オリックス）。
              西南学院大学　経済学部　卒業後は、アルバイトを兼任しながらクリエイティブ系の仕事を目指し、
              イラスト・WEBデザインを学ぶ。
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="text-[#8a8680] font-['Inter'] font-[300] leading-relaxed mb-10 text-sm">
              デザイン関連・公文教室の教師・プロ野球のデータ入力や映像作成・クラウドワークスではイラストレーターの職務も経験。
              株式会社ランドマークにて正社員雇用を経て、現在{" "}
              <strong className="text-[#1a1a2e] font-[400]">
                株式会社ホテリエ
              </strong>
              にてWEBデザイナーとして経験。
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="grid grid-cols-3 gap-4 border-t border-[#1a1a2e]/10 pt-8">
              {[
                { n: "10+", l: "制作実績" },
                { n: "5+", l: "運営実績" },
                { n: "3+", l: "職種経験" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <motion.p
                    className="font-['Fraunces'] text-3xl font-[300] text-[#c0392b]"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    {n}
                  </motion.p>
                  <p className="text-xs font-['Inter'] text-[#8a8680] mt-1">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── Works ─────────────────────────────────────────────────────────────────────
const works = [
  {
    title: "ホテリエ",
    category: "HP制作/運営実績",
    url: "https://hotel.inc/hoteliervison/",
    color: "#0f1923",
    img: "/images/works/hotel.jpg",
  },
  {
    title: "コビタススペース",
     category: "HP制作/運営実績",
    url: "https://cobitas.com/",
    color: "#1a2e1a",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format",
  },
  {
    title: "株式会社イムズパートナー",
    category: "運営実績",
    url: "http://ims-p.com/",
    color: "#1e1e1e",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format",
  },
  {
    title: "メディアカフェプラネット",
    category: "運営実績",
    url: "https://planet-cafe.jp/",
    color: "#1a1430",
    img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=600&fit=crop&auto=format",
  },
  {
    title: "はま唐亭",
    category: "運営実績",
    url: "https://hamakara.jp/",
    color: "#2e1a0a",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&auto=format",
  },
  {
    title: "東邦ハウジング株式会社",
     category: "HP制作/運営実績",
    url: "https://www.toho-housing.co.jp/",
    color: "#162030",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format",
  },
]

function WorkCard({ work, index }: { work: typeof works[0] index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Reveal delay={index * 0.07}>
      <motion.article
        className="cursor-pointer overflow-hidden"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        data-hover
      >
        <div className="relative overflow-hidden bg-[#e8e5df] aspect-[2/1]">
          <motion.img
            src={work.img}
            alt={work.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-0 flex items-end p-5"
            style={{
              background: `linear-gradient(to top, ${work.color}dd, transparent)`,
            }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.a
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#faf9f7] font-['Inter'] text-sm tracking-wide hover:text-[#c0392b] transition-colors"
              animate={{ y: hovered ? 0 : 10 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              サイトを見る →
            </motion.a>
          </motion.div>
        </div>
        <div className="pt-4 pb-6 flex items-start justify-between">
          <div>
            <h3 className="font-['Fraunces'] text-lg font-[300] text-[#1a1a2e] group-hover:text-[#c0392b] transition-colors">
              {work.title}
            </h3>
            <p className="text-xs text-[#8a8680] font-['Inter'] mt-1">
              {work.category}
            </p>
          </div>
          <motion.span
            animate={{
              color: hovered ? "#c0392b" : "#8a8680",
              x: hovered ? 3 : 0,
            }}
            className="text-lg mt-1"
          >
            ↗
          </motion.span>
        </div>
      </motion.article>
    </Reveal>
  )
}

function Works() {
  return (
    <section id="works" className="px-6 md:px-14 py-28 bg-[#faf9f7]">
      <Reveal>
        <div className="flex items-end justify-between mb-16 border-b border-[#1a1a2e]/10 pb-6">
          <h2 className="font-['Fraunces'] text-5xl md:text-7xl font-[300] text-[#1a1a2e]">
            制作
            <br />
            <em className="italic text-[#c0392b]">実績</em>
          </h2>
          <span className="text-sm text-[#8a8680] font-['Inter'] mb-2">
            HP制作 &amp; 運営実績
          </span>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
        {works.map((w, i) => (
          <WorkCard key={w.title} work={w} index={i} />
        ))}
      </div>

      {/* Video credit */}
      <Reveal delay={0.1}>
        <div className="mt-16 border-t border-[#1a1a2e]/8 pt-10">
          <p className="text-xs font-['Inter'] tracking-widest text-[#8a8680] uppercase mb-3">
            映像制作実績
          </p>
          <p className="text-sm text-[#8a8680] font-['Inter'] font-[300]">
            製作映像（0:06〜の柳田選手の映像のみ）—{" "}
            <a
              href="https://youtu.be/p50NH04QDV0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a1a2e] underline underline-offset-3 hover:text-[#c0392b] transition-colors"
            >
              YouTube で見る
            </a>
          </p>
        </div>
      </Reveal>
    </section>
  )
}

// ── Skills ticker ─────────────────────────────────────────────────────────────
const skills = [
  { label: "WEBデザイン", pct: 88 },
  { label: "グラフィックデザイン", pct: 82 },
  { label: "イラスト", pct: 78 },
  { label: "映像制作", pct: 65 },
  { label: "UI/UX", pct: 72 },
  { label: "WordPress", pct: 80 },
]

function SkillBar({
  label,
  pct,
  delay,
}: {
  label: string
  pct: number
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-['Inter'] text-[#8a8680]">{label}</span>
        <span className="text-xs font-['Inter'] text-[#8a8680]">{pct}%</span>
      </div>
      <div className="h-px bg-[#1a1a2e]/10 relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-[#c0392b]"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{
            duration: 1.1,
            delay: delay + 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </div>
  )
}

function Skills() {
  return (
    <section className="px-6 md:px-14 py-28 bg-[#1a1a2e]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <Reveal>
            <p className="text-xs font-['Inter'] tracking-widest text-[#faf9f7]/40 uppercase mb-4">
              Skills
            </p>
            <h2 className="font-['Fraunces'] text-5xl font-[300] text-[#faf9f7] leading-tight mb-10">
              得意な
              <br />
              <em className="italic text-[#c0392b]">スキル</em>
            </h2>
          </Reveal>
        </div>
        <div>
          {skills.map((s, i) => (
            <SkillBar
              key={s.label}
              label={s.label}
              pct={s.pct}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>

      {/* Other works marquee — dark bg */}
      <div className="mt-20 border-t border-[#faf9f7]/8 pt-10">
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-10 whitespace-nowrap"
            animate={{ x: [0, "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="font-['Fraunces'] text-xl italic text-[#faf9f7]/12 shrink-0"
              >
                株式会社ニューブランド · 株式会社ランドマーク · はま唐亭 ·
                株式会社ホテリエ · 三都管財 · (株)トップ・プランニング ·&nbsp;
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  return (
    <section id="contact" className="px-6 md:px-14 py-28 bg-[#faf9f7]">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <p className="text-xs font-['Inter'] tracking-widest text-[#8a8680] uppercase mb-4">
            Contact
          </p>
          <h2 className="font-['Fraunces'] text-5xl md:text-7xl font-[300] text-[#1a1a2e] leading-tight mb-4">
            お問合せ
          </h2>
          <p className="text-sm text-[#8a8680] font-['Inter'] font-[300] mb-12">
            採用担当の方へ。ご質問・面談のご依頼はお気軽にどうぞ。
          </p>
        </Reveal>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="w-16 h-16 rounded-full bg-[#c0392b] flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-[#faf9f7] text-2xl">✓</span>
              </motion.div>
              <p className="font-['Fraunces'] text-2xl text-[#1a1a2e] italic">
                送信が完了しました。
              </p>
              <p className="text-sm text-[#8a8680] font-['Inter'] mt-2">
                お問い合わせありがとうございます。
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <Reveal delay={0.05}>
                <input
                  type="text"
                  placeholder="名前"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[#1a1a2e]/15 bg-transparent px-5 py-4 text-sm font-['Inter'] text-[#1a1a2e] placeholder:text-[#8a8680]/60 outline-none focus:border-[#c0392b] transition-colors"
                />
              </Reveal>
              <Reveal delay={0.08}>
                <input
                  type="email"
                  placeholder="メールアドレス"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-[#1a1a2e]/15 bg-transparent px-5 py-4 text-sm font-['Inter'] text-[#1a1a2e] placeholder:text-[#8a8680]/60 outline-none focus:border-[#c0392b] transition-colors"
                />
              </Reveal>
              <Reveal delay={0.11}>
                <input
                  type="text"
                  placeholder="件名"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="w-full border border-[#1a1a2e]/15 bg-transparent px-5 py-4 text-sm font-['Inter'] text-[#1a1a2e] placeholder:text-[#8a8680]/60 outline-none focus:border-[#c0392b] transition-colors"
                />
              </Reveal>
              <Reveal delay={0.14}>
                <textarea
                  placeholder="メッセージ"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full border border-[#1a1a2e]/15 bg-transparent px-5 py-4 text-sm font-['Inter'] text-[#1a1a2e] placeholder:text-[#8a8680]/60 outline-none focus:border-[#c0392b] transition-colors resize-none"
                />
              </Reveal>
              <Reveal delay={0.17}>
                <motion.button
                  type="submit"
                  className="w-full bg-[#1a1a2e] text-[#faf9f7] py-4 text-sm font-['Inter'] tracking-wide hover:bg-[#c0392b] transition-colors duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  送信
                </motion.button>
              </Reveal>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <Reveal delay={0.1}>
        <div className="mt-24 pt-10 border-t border-[#1a1a2e]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#8a8680] font-['Inter']">
          <div>
            <span className="font-['Fraunces'] text-base text-[#1a1a2e] mr-3">
              KATSUNOSHIN UTSUMI
            </span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-6">
            {["Facebook", "Twitter", "LinkedIn"].map((s) => (
              <motion.a
                key={s}
                href="#"
                className="hover:text-[#c0392b] transition-colors"
                whileHover={{ y: -2 }}
              >
                {s}
              </motion.a>
            ))}
            <motion.a
              href="tel:09028505371"
              className="hover:text-[#c0392b] transition-colors"
              whileHover={{ y: -2 }}
            >
              090-2850-5371
            </motion.a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ── Chatbot ───────────────────────────────────────────────────────────────────
type Message = { role: "bot" | "user"; text: string }

const faq: { q: string[]; a: string }[] = [
  {
    q: ["プロフィール", "経歴", "自己紹介", "who", "誰", "名前", "どんな人"],
    a: "KATSUNOSHIN UTSUMI（内海勝乃真）です。1996年7月11日生まれ、福岡出身です。西南学院大学経済学部を卒業後、デザイン・イラスト・映像制作などのクリエイティブ分野で経験を積み、現在はWEBデザインを中心に、サイト制作・運用、デザイン、コーディングなどに携わっています。"
  },

  {
    q: ["実績", "制作", "サイト", "ポートフォリオ", "作品", "hp"],
    a: "WEBサイトの制作・運用を中心に、ホテル関連サイトなど複数のWeb制作に携わってきました。WordPressを使用したサイト制作や更新、ページ制作、デザインなど、企画・デザインから実装・運用まで幅広く経験しています。詳しい制作実績は、ページ内の「制作実績」からご覧いただけます。"
  },

  {
    q: ["スキル", "できる", "得意", "技術", "使える", "ツール", "何ができる", "できますか"],
    a: "主なスキルは、HTML・CSS・JavaScript・jQuery・PHP（基礎）、WordPress、Photoshop、Illustrator、Figmaなどです。WEBデザインだけでなく、コーディングやサイト運用にも対応できます。また、SEOやアクセス解析、AIツールの活用にも取り組んでいます。"
  },

  {
    q: ["志望", "動機", "なぜ", "理由", "転職", "なぜ応募", "応募理由"],
    a: "これまでWEBデザインやサイト制作・運用を通じて、デザインだけでなく、実装や運用、ユーザー目線での改善まで幅広く経験してきました。今後はこれまで培ったクリエイティブの経験を活かしながら、より幅広い業務に挑戦し、デザインと技術の両面から貢献していきたいと考えています。"
  },

  {
    q: ["強み", "長所", "アピール", "得意なこと"],
    a: "デザインだけでなく、コーディングやWordPressでの実装・運用まで一貫して対応できることが強みです。また、イラストやグラフィック、映像制作などの経験もあり、目的に応じて複数のクリエイティブ領域を組み合わせて考えられます。"
  },

  {
    q: ["短所", "弱み", "苦手", "弱点", "改善したい"],
    a: "一つのことを深く考えすぎて、作業に時間をかけてしまうことがあります。そのため、最近は最初に目的や優先順位を整理し、まず全体を完成させてから細部を改善することを意識しています。"
  },

  {
    q: ["前職", "ホテリエ", "仕事内容", "何をしていた"],
    a: "株式会社ホテリエでは、ホテルのWebサイト制作・運用を中心に、WordPressを使ったサイト制作・更新、ページの調整、画像編集など、Webサイトに関する幅広い業務に携わっています。また、新規開業に伴うWebサイト制作にも関わり、関係者との調整やスケジュール管理など、制作以外の業務も経験しています。"
  },

  {
    q: ["AI", "ai", "ＡＩ", "生成AI", "ChatGPT", "Claude", "AI活用"],
    a: "ChatGPTやClaudeなどの生成AIを、業務効率化やアイデア整理、文章作成、コード作成などに活用しています。また、AIを単に利用するだけでなく、自分でAIを活用したWebアプリケーションや業務支援ツールを制作するなど、実際の業務や制作に活かす方法を試しています。"
  },

  {
    q: ["WordPress", "wordpress", "ワードプレス"],
    a: "WordPressを使用したWEBサイトの制作・更新・運用経験があります。テーマやプラグインの設定だけでなく、HTML・CSSなどを使ったページの調整やカスタマイズにも対応できます。"
  },

  {
    q: ["プログラミング", "コーディング", "コード", "HTML", "CSS", "JavaScript", "jQuery"],
    a: "HTML・CSS・JavaScript・jQueryを中心に、WEBサイトのコーディング経験があります。デザインをそのまま形にするだけでなく、レスポンシブ対応やユーザーが使いやすいUIを意識した実装を行っています。PHPについても基礎的な知識があります。"
  },

  {
    q: ["学歴", "大学", "卒業", "西南"],
    a: "西南学院大学経済学部を卒業しています。大学卒業後はクリエイティブ分野で経験を積み、WEBデザインやサイト制作・運用などの仕事に携わってきました。"
  },

  {
    q: ["趣味", "好き", "野球", "オリックス", "プライベート"],
    a: "趣味は野球観戦です。試合を見るだけでなく、選手の成績やデータを見ながら分析することも好きです。興味を持ったことを調べて、データを整理・分析することが好きなタイプです。"
  },

  {
    q: ["将来", "今後", "キャリア"],
    a: "今後は、WEB制作の経験をさらに広げて、WEBマーケティングやデータ活用、AIなどの領域にも取り組んでいきたいと考えています。制作・運用・改善を一つの流れとして考えられる人材になることを目指しています。"
  },

  {
    q: ["連絡", "メール", "電話", "contact", "面談"],
    a: "お問い合わせはページ下部のお問い合わせフォームからご連絡ください。採用や仕事内容についてのご質問、面談などもお気軽にお問い合わせください。"
  }
]
function getBotReply(input: string): string {
  const lower = input.toLowerCase()
  for (const { q, a } of faq) {
    if (q.some((kw) => lower.includes(kw))) return a
  }
  return "ご質問ありがとうございます。「プロフィール」「スキル」「実績」「志望動機」「強み」「連絡先」などについてお答えできます。お気軽にどうぞ！"
}

const QUICK = ["プロフィールを教えて", "スキルは？", "志望動機は？", "強みは何ですか"]

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "こんにちは！KATSUNOSHIN UTSUMIのポートフォリオへようこそ。\n採用に関するご質問に何でもお答えします😊\n下のボタンからお気軽にどうぞ！",
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const send = (text: string) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: "user", text }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: getBotReply(text) }])
      setTyping(false)
    }, 900)
  }

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80)
  }, [messages, open, typing])

  return (
    <>
      {/* Toggle button — larger, with label */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1a1a2e] text-[#faf9f7] text-xs font-['Inter'] px-3 py-1.5 whitespace-nowrap shadow-md"
            >
              採用担当者向けQ&amp;A
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          className="w-16 h-16 rounded-full bg-[#c0392b] text-[#faf9f7] flex items-center justify-center shadow-xl hover:bg-[#1a1a2e] transition-colors duration-300 relative"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setOpen((v) => !v)}
          aria-label="チャットを開く"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="text-2xl leading-none font-light">✕</motion.span>
            ) : (
              <motion.span key="chat" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.2 }} className="text-2xl leading-none">💬</motion.span>
            )}
          </AnimatePresence>
          {/* Ping ring */}
          {!open && (
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#faf9f7]" />
          )}
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-28 right-6 z-50 flex flex-col overflow-hidden shadow-2xl border border-[#1a1a2e]/12"
            style={{ width: 420, maxWidth: "calc(100vw - 24px)", height: 580, maxHeight: "calc(100vh - 140px)", background: "#faf9f7" }}
          >
            {/* Header */}
            <div className="bg-[#1a1a2e] px-6 py-5 flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#c0392b] flex items-center justify-center shrink-0">
                <span className="font-['Fraunces'] text-[#faf9f7] text-sm font-bold tracking-tight">KU</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Fraunces'] text-[#faf9f7] text-base font-[400] truncate">UTSUMI Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <p className="text-[#faf9f7]/50 text-xs font-['Inter']">オンライン · 採用担当者向けQ&amp;A</p>
                </div>
              </div>
            </div>

            {/* Quick reply chips — always visible at top */}
            <div className="px-5 pt-4 pb-2 border-b border-[#1a1a2e]/8 shrink-0">
              <p className="text-xs font-['Inter'] text-[#8a8680] mb-2 tracking-wide">よくある質問</p>
              <div className="flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs font-['Inter'] bg-[#1a1a2e]/6 text-[#1a1a2e] px-3 py-2 rounded-full hover:bg-[#c0392b] hover:text-[#faf9f7] transition-colors duration-200 whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-[#c0392b] flex items-center justify-center shrink-0 mb-0.5">
                      <span className="font-['Fraunces'] text-[#faf9f7] text-[10px] font-bold">KU</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-4 py-3 text-sm font-['Inter'] font-[300] leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-[#1a1a2e] text-[#faf9f7] rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl"
                        : "bg-white border border-[#1a1a2e]/8 text-[#1a1a2e] rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-[#c0392b] flex items-center justify-center shrink-0">
                    <span className="font-['Fraunces'] text-[#faf9f7] text-[10px] font-bold">KU</span>
                  </div>
                  <div className="bg-white border border-[#1a1a2e]/8 px-5 py-3.5 flex gap-1.5 items-center rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#8a8680] block"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.55, delay: i * 0.13, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-[#1a1a2e]/8 flex gap-3 shrink-0 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="質問を入力してください…"
                className="flex-1 bg-[#faf9f7] border border-[#1a1a2e]/12 px-4 py-3 text-sm font-['Inter'] text-[#1a1a2e] placeholder:text-[#8a8680]/70 outline-none focus:border-[#c0392b] transition-colors rounded-full"
              />
              <motion.button
                onClick={() => send(input)}
                className="bg-[#c0392b] text-[#faf9f7] w-12 h-12 flex items-center justify-center rounded-full text-lg hover:bg-[#1a1a2e] transition-colors shrink-0"
                whileTap={{ scale: 0.92 }}
                title="送信"
              >
                ↑
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem("portfolio_authenticated") === "true"
  })
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === PORTFOLIO_PASSWORD) {
      sessionStorage.setItem("portfolio_authenticated", "true")
      setAuthenticated(true)
      setError("")
    } else {
      setError("パスワードが正しくありません。")
      setPassword("")
    }
  }

  if (authenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <p className="text-xs font-['Inter'] tracking-widest text-[#8a8680] uppercase mb-5">
            Portfolio
          </p>

          <h1 className="font-['Fraunces'] text-4xl md:text-5xl font-[300] text-[#1a1a2e]">
            KATSUNOSHIN
            <br />
            <em className="italic text-[#c0392b]">
              UTSUMI
            </em>
          </h1>

          <p className="text-sm text-[#8a8680] font-['Inter'] font-[300] mt-6">
            閲覧にはパスワードが必要です。
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-[#1a1a2e]/10 pt-8"
        >
          <label className="block text-xs font-['Inter'] text-[#8a8680] mb-3">
            PASSWORD
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
            placeholder="パスワードを入力"
            autoFocus
            className="w-full border border-[#1a1a2e]/15 bg-transparent px-5 py-4 text-sm font-['Inter'] text-[#1a1a2e] placeholder:text-[#8a8680]/60 outline-none focus:border-[#c0392b] transition-colors"
          />

          {error && (
            <p className="text-xs text-[#c0392b] mt-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-5 bg-[#1a1a2e] text-[#faf9f7] py-4 text-sm font-['Inter'] tracking-wide hover:bg-[#c0392b] transition-colors duration-300"
          >
            ENTER
          </button>
        </form>

        <p className="text-center text-xs text-[#8a8680]/60 mt-10 font-['Inter']">
          KATSUNOSHIN UTSUMI · 2026
        </p>

      </div>
    </div>
  )
}

export default function App() {
  return (
    <PasswordGate>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Profile />
        <Works />
        <Skills />
        <Contact />
      </main>
      <Chatbot />
    </PasswordGate>
  )
}
