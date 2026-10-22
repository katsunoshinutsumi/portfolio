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
  { label: "サービス", id: "services" },
  { label: "制作実績", id: "works" },
  { label: "ご依頼について", id: "contact" },
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

        <div className="hidden lg:flex gap-7">
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
          className="lg:hidden flex flex-col gap-1.5 w-6"
          aria-label="メニュー"
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
            className="fixed inset-0 z-30 bg-[#1a1a2e] flex flex-col items-center justify-center gap-7"
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
                className="font-['Fraunces'] text-3xl font-light text-[#faf9f7] hover:text-[#c0392b] transition-colors"
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
          Freelance Designer · Web / Graphic / Illustration
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
          福岡を拠点に活動するフリーランスデザイナー。Webサイト制作・運用から、チラシ・パンフレット・イラストまで、企画からデザイン・実装・更新までワンストップで対応します。
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
                .getElementById("services")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            できることを見る
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
  const ref = useRef<HTMLDivElement>(null)
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
              福岡出身。西南学院大学 経済学部を卒業後、イラスト・WEBデザインを学び、
              クリエイティブの道へ。趣味は野球観戦（オリックス）。
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="text-[#8a8680] font-['Inter'] font-[300] leading-relaxed mb-10 text-sm">
              不動産会社でのチラシ・パンフレット制作、{" "}
              <strong className="text-[#1a1a2e] font-[400]">
                株式会社ホテリエ
              </strong>
              でのホテルサイト制作・運用（現職）、プロ野球の映像制作、クラウドワークスでのイラスト制作などを経験。
              現在はWEBデザイナーとして勤務しながら、クラウドワークスなどを通じてフリーランスでも制作を承っています。
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="grid grid-cols-3 gap-4 border-t border-[#1a1a2e]/10 pt-8">
              {[
                { n: "10+", l: "制作実績" },
                { n: "6+", l: "サイト運用実績" },
                { n: "4", l: "対応領域" },
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
// ── Works ─────────────────────────────────────────────────────────────────────

const works = [
  {
    title: "Nhat Box",
    category: "ECサイト制作/運営",
    url: "https://nhatbox.space/",
    color: "#1a1a1a",
    img: "/images/works/nhatbox.png",
  },
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
    img: "/images/works/cobitas.jpg",
  },
  {
    title: "株式会社イムズパートナー",
    category: "運営実績",
    url: "http://ims-p.com/",
    color: "#1e1e1e",
    img: "/images/works/ims.jpg",
  },
  {
    title: "メディアカフェプラネット",
    category: "運営実績",
    url: "https://planet-cafe.jp/",
    color: "#1a1430",
    img: "/images/works/planet.jpg",
  },
  {
    title: "はま唐亭",
    category: "運営実績",
    url: "https://hamakara.jp/",
    color: "#2e1a0a",
    img: "/images/works/hamakara.jpg",
  },
  {
    title: "東邦ハウジング株式会社",
    category: "HP制作/運営実績",
    url: "https://www.toho-housing.co.jp/",
    color: "#162030",
    img: "/images/works/toho.jpg",
  },
  {
    title: "株式会社文流",
    category: "HP制作/運営実績",
    url: "https://www.bunryu.com/",
    color: "#1a1a1a",
    img: "/images/works/bunryu.jpg",
  },
  {
    title: "ZONK",
    category: "HP制作/運営実績",
    url: "https://zonk.jp/",
    color: "#111111",
    img: "/images/works/zonk.jpg",
  },
]

const aiTools = [
  {
    no: "01",
    title: "メール・LINE下書きツール",
    text: "状況や受信文を入力すると、送信できる状態の下書きを生成。ビジネス敬語のルール、未記入箇所のハイライトとコピー防止、日程の自動抽出とGoogleカレンダー登録、祝日判定まで備えた実務向けツール。",
    tags: ["React", "Next.js", "Claude / Gemini API", "Google SSO"],
  },
]

const graphicWorks = [
  {
    title: "写真加工",
    description:
      "中古物件、テナント物件の写真を加工。PhotoshopのAI生成機能を活用し、作業効率を向上。",
    img: "https://static.wixstatic.com/media/cd63c9_103ac96cc065422681d9b8da931e9a6e~mv2.jpg",
  },
  {
    title: "中古物件",
    description:
      "築年数の古い物件の外観をイラスト風に加工。チラシをきっかけに契約につながった制作物。",
    img: "https://static.wixstatic.com/media/cd63c9_4392a8a62ced4e2fb8140bb770f83de7~mv2.jpg",
  },
  {
    title: "中古物件2",
    description: "築年数の古い物件を加工したチラシ制作。",
    img: "https://static.wixstatic.com/media/cd63c9_7196a1fb27d242d7a7e29f26a3e9e3b5~mv2.jpg",
  },
  {
    title: "マンションパンフレット1",
    description:
      "マンションパンフレットの表紙。青空のパースを夜のパースへ加工し、ライトを直接描画。",
    img: "https://static.wixstatic.com/media/cd63c9_17c4d5bf2a5f49178eb8967df3dc717e~mv2.jpg",
  },
  {
    title: "マンションパンフレット2",
    description: "高級感を重視した見開きデザイン。",
    img: "https://static.wixstatic.com/media/cd63c9_6fd6a62e6faf45b883e81679449ac1b2~mv2.jpg",
  },
  {
    title: "マンションパンフレット3",
    description: "ロケーションを分かりやすく伝えるページ。",
    img: "https://static.wixstatic.com/media/cd63c9_f41b9a1243874ca79db9f7a4aadaf55d~mv2.jpg",
  },
  {
    title: "マンションパンフレット4",
    description: "写真を活用したパンフレットページ。",
    img: "https://static.wixstatic.com/media/cd63c9_58a2db1e1ac2440bab8ea0f05d9085fa~mv2.jpg",
  },
  {
    title: "不動産パンフレット 2021",
    description:
      "グループ会社から依頼を受けて制作したチラシ。家族や車の写真は合成写真を使用。",
    img: "https://static.wixstatic.com/media/cd63c9_70edb0126a5541398d8eedf2f39204f4~mv2.jpg",
  },
  {
    title: "白黒チラシ",
    description:
      "2色のみで制作。見やすさを重視し、写真にもAI生成を活用。",
    img: "https://static.wixstatic.com/media/cd63c9_6f9e2edc3b524bbbb527c32f964c9072~mv2.jpg",
  },
  {
    title: "サンプルチラシ1",
    description: "質感のあるデザインを重視して制作。",
    img: "https://static.wixstatic.com/media/cd63c9_7708b6c8798842fa98b12a74f3d3f9cf~mv2.jpg",
  },
  {
    title: "サンプルチラシ2",
    description:
      "パースをPhotoshopで水彩画風に加工し、それに合わせた色調を設計。",
    img: "https://static.wixstatic.com/media/cd63c9_f564206bdc724fe8be90669494eaae7f~mv2.jpg",
  },
  {
    title: "唐揚げ屋チラシ1",
    description: "アメリカンなイメージで制作。キャラクターは手書き。",
    img: "https://static.wixstatic.com/media/cd63c9_83ec446b65c3403c8c2d551e3debcfd6~mv2.jpg",
  },
  {
    title: "唐揚げ屋チラシ2",
    description:
      "3D素材やAI生成を活用し、パロディ要素を取り入れて制作。",
    img: "https://static.wixstatic.com/media/cd63c9_6dd6931cf7e64e7299b9bef8c730a18e~mv2.jpg",
  },
  {
    title: "不動産パンフレット 2022",
    description:
      "全24ページの販売主向けパンフレット。福岡の街と円形グラデーションを合成。",
    img: "https://static.wixstatic.com/media/cd63c9_02357b5000044862803c5a68d92c0005~mv2.jpg",
  },
  {
    title: "ネットカフェ広告",
    description:
      "カキフライの商品化に合わせて制作。素材を合成してメインビジュアルを制作。",
    img: "https://static.wixstatic.com/media/cd63c9_eccb07a30dee4a4aa957803a8a42e372~mv2.jpg",
  },
  {
    title: "求人タペストリー",
    description: "ネットカフェのアルバイト募集広告案。",
    img: "https://static.wixstatic.com/media/cd63c9_6e317585a95845249a55cc3776f6d6bc~mv2.jpg",
  },
  {
    title: "ネットカフェポスター",
    description:
      "Webサイトの素材を利用し、Photoshopでアングルなどを調整して制作。",
    img: "https://static.wixstatic.com/media/cd63c9_dbe7b6e24d1546919653fff62ab2ad5a~mv2.png",
  },
  {
    title: "会社案内",
    description: "会社のブランドカラーを崩さないことを重視して制作。",
    img: "https://static.wixstatic.com/media/cd63c9_8088c98750324996b3b8f49b5e82e977~mv2.jpg",
  },
  {
    title: "年賀状挿絵",
    description: "会社の年賀状に使用したイラスト。",
    img: "https://static.wixstatic.com/media/cd63c9_958b95520f804e08bb8f9e2d0caf9e77~mv2.png",
  },
  {
    title: "ネットカフェ挿絵",
    description: "ネットカフェで使用したイラスト。",
    img: "https://static.wixstatic.com/media/cd63c9_38828326c64647cf9c8cfa17875b06c6~mv2.png",
  },
  {
    title: "フリーランス",
    description: "フリーランスで依頼を受けて制作したイラスト。",
    img: "https://static.wixstatic.com/media/cd63c9_391005772c1148419cca2c02b40eac8f~mv2.png",
  },
  {
    title: "オリジナル 2019",
    description:
      "近所の風景を写生。ガッシュブラシを軸に制作し、水の表現を工夫。",
    img: "https://static.wixstatic.com/media/cd63c9_aed33601f6e549a988c32fa1123ccf1c~mv2.png",
  },
  {
    title: "オリジナル",
    description:
      "町のイラスト。CLIP STUDIOの機能を使用し、光をぼかしで表現。",
    img: "https://static.wixstatic.com/media/cd63c9_6e3a2d4795f44664a454ce71c4c71005~mv2.png",
  },
]

function WorkCard({ work, index }: { work: (typeof works)[0]; index: number }) {
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
            HP・EC制作 &amp; 運営実績
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
      {/* AI tools */}
      <Reveal delay={0.1}>
        <div className="mt-16 border-t border-[#1a1a2e]/8 pt-10">
          <p className="text-xs font-['Inter'] tracking-widest text-[#8a8680] uppercase mb-6">
            AIツール開発
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiTools.map((t) => (
              <article
                key={t.no}
                className="border border-[#1a1a2e]/12 p-7"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-['Fraunces'] text-sm text-[#c0392b]">
                    {t.no}
                  </span>
                  <h3 className="font-['Fraunces'] text-xl font-[300] text-[#1a1a2e]">
                    {t.title}
                  </h3>
                </div>
                <p className="text-sm text-[#8a8680] font-['Inter'] font-[300] leading-relaxed mb-5">
                  {t.text}
                </p>
                <div className="flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-['Inter'] text-[#1a1a2e]/70 border border-[#1a1a2e]/15 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
      {/* Graphic / Print Works */}
<Reveal delay={0.1}>
  <div className="mt-24 border-t border-[#1a1a2e]/10 pt-16">
    <div className="flex items-end justify-between mb-12 border-b border-[#1a1a2e]/10 pb-6">
      <h2 className="font-['Fraunces'] text-4xl md:text-6xl font-[300] text-[#1a1a2e]">
        その他
        <br />
        <em className="italic text-[#c0392b]">制作実績</em>
      </h2>

      <span className="text-sm text-[#8a8680] font-['Inter'] mb-2">
        イラスト・パンフレット・チラシ・グラフィック
      </span>
    </div>
  </div>
</Reveal>

<div className="columns-1 md:columns-2 lg:columns-3 gap-6">
  {graphicWorks.map((work, index) => (
    <Reveal key={work.title} delay={index * 0.03}>
      <article className="mb-6 break-inside-avoid overflow-hidden">
        <div className="group relative overflow-hidden bg-[#e8e5df]">
          <img
            src={work.img}
            alt={work.title}
            loading="lazy"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white font-['Fraunces'] text-lg">
              {work.title}
            </h3>

            <p className="text-white/80 text-xs font-['Inter'] mt-1 leading-relaxed">
              {work.description}
            </p>
          </div>
        </div>
      </article>
    </Reveal>
  ))}
</div>
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
            <p className="text-sm text-[#faf9f7]/50 font-['Inter'] font-[300] leading-relaxed max-w-sm">
              Photoshop / Illustrator / Figma / CLIP STUDIO / HTML・CSS・JavaScript / WordPress / 生成AIツール
            </p>
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

// ── Services ──────────────────────────────────────────────────────────────────
const services = [
  {
    no: "01",
    title: "Webサイト制作",
    en: "Web Design",
    text: "コーポレートサイト・LP・店舗サイトなど。WordPressでの構築にも対応し、公開後にご自身で更新できる形でお渡しします。",
    tags: ["デザイン", "コーディング", "WordPress", "レスポンシブ"],
  },
  {
    no: "02",
    title: "サイト運用・更新",
    en: "Maintenance",
    text: "ページ追加・お知らせ更新・バナー差し替えなど、日々の運用をまるごとお任せいただけます。ホテル・飲食・不動産サイトや自社ECサイトでの運用実績あり。",
    tags: ["更新代行", "改善提案", "SEO", "アクセス解析"],
  },
  {
    no: "03",
    title: "グラフィックデザイン",
    en: "Graphic Design",
    text: "チラシ・パンフレット・ポスター・会社案内など。写真加工やAI生成も活用して制作します。",
    tags: ["チラシ", "パンフレット", "写真加工", "名刺"],
  },
  {
    no: "04",
    title: "イラスト制作",
    en: "Illustration",
    text: "広告・Webサイト用の挿絵、キャラクター、年賀状、風景画など。手描きの温かみのあるタッチからデジタルまで対応します。",
    tags: ["挿絵", "キャラクター", "風景", "SNS用"],
  },
]

function Services() {
  return (
    <section id="services" className="px-6 md:px-14 py-28 bg-[#f1eee8]">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#1a1a2e]/10 pb-6">
          <div>
            <p className="text-xs font-['Inter'] tracking-widest text-[#8a8680] uppercase mb-4">
              Services
            </p>
            <h2 className="font-['Fraunces'] text-5xl md:text-7xl font-[300] text-[#1a1a2e]">
              できる
              <em className="italic text-[#c0392b]">こと</em>
            </h2>
          </div>
          <p className="text-sm text-[#8a8680] font-['Inter'] font-[300] leading-relaxed max-w-md">
            Webもグラフィックもイラストも、ひとりで一貫して担当。窓口がひとつなので、ブランドのトーンを揃えたまま、スムーズに制作を進められます。
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a2e]/10 border border-[#1a1a2e]/10">
        {services.map((s, i) => (
          <Reveal key={s.no} delay={i * 0.06} className="bg-[#f1eee8]">
            <motion.div
              className="group h-full p-8 md:p-10 hover:bg-[#faf9f7] transition-colors duration-300"
              data-hover
            >
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-['Fraunces'] text-sm text-[#c0392b]">
                  {s.no}
                </span>
                <span className="font-['Fraunces'] italic text-sm text-[#8a8680]">
                  {s.en}
                </span>
              </div>
              <h3 className="font-['Fraunces'] text-2xl md:text-3xl font-[300] text-[#1a1a2e] mb-4 group-hover:text-[#c0392b] transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-[#8a8680] font-['Inter'] font-[300] leading-relaxed mb-6">
                {s.text}
              </p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-['Inter'] text-[#1a1a2e]/70 border border-[#1a1a2e]/15 px-3 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="px-6 md:px-14 py-28 bg-[#faf9f7]">
      <div className="max-w-2xl mx-auto text-center">
        <Reveal>
          <p className="text-xs font-['Inter'] tracking-widest text-[#8a8680] uppercase mb-4">
            Contact
          </p>
          <h2 className="font-['Fraunces'] text-5xl md:text-7xl font-[300] text-[#1a1a2e] leading-tight mb-8">
            ご依頼に
            <em className="italic text-[#c0392b]">ついて</em>
          </h2>
          <p className="text-sm text-[#8a8680] font-['Inter'] font-[300] leading-relaxed">
            お仕事のご依頼は、クラウドワークスなどのクラウドソーシングサービス経由で承っております。
          </p>
        </Reveal>
      </div>

      {/* Footer */}
      <Reveal delay={0.1}>
        <div className="mt-24 pt-10 border-t border-[#1a1a2e]/10 text-center text-sm text-[#8a8680] font-['Inter']">
          <span className="font-['Fraunces'] text-base text-[#1a1a2e] mr-3">
            KATSUNOSHIN UTSUMI
          </span>
          <span>© 2026</span>
        </div>
      </Reveal>
    </section>
  )
}

// ── Chatbot ───────────────────────────────────────────────────────────────────
type Message = { role: "bot" | "user"; text: string }

const faq: { q: string[]; a: string }[] = [
  {
    q: ["料金", "費用", "値段", "価格", "いくら", "見積", "予算", "納期", "依頼", "連絡", "問い合わせ", "相談", "契約", "支払"],
    a: "お仕事のご依頼は、クラウドワークスなどのクラウドソーシングサービス経由で承っております。料金や納期などの条件は、案件ごとにサービス上でご相談させてください。",
  },
  {
    q: ["頼める", "できる", "対応", "サービス", "何が", "範囲", "スキル", "得意"],
    a: "Webサイト制作（デザイン・コーディング・WordPress構築）、サイトの運用・更新、チラシ・パンフレットなどのグラフィックデザイン、イラスト制作に対応しています。",
  },
  {
    q: ["実績", "制作", "作品", "ポートフォリオ", "事例"],
    a: "ホテル・飲食店・不動産・コワーキングスペースなどのWebサイト制作・運用、自社ECサイト「Nhat Box」の制作・運営、メール下書きなどのAIツール開発、マンションパンフレットや店舗チラシ、イラストなどの実績があります。詳しくはページ内の「制作実績」をご覧ください。",
  },
  {
    q: ["wordpress", "ワードプレス", "更新", "運用", "保守"],
    a: "WordPressでのサイト構築・カスタマイズ・更新・運用に対応しています。",
  },
  {
    q: ["ai", "ＡＩ", "生成", "chatgpt", "claude"],
    a: "PhotoshopのAI生成機能による写真加工や、ChatGPT・Claudeなどを活用した原稿作成・コード作成で、品質を保ちながら制作のスピードアップを図っています。",
  },
  {
    q: ["イラスト", "キャラクター", "挿絵"],
    a: "広告・Webサイト用の挿絵、キャラクター、年賀状、風景画などを制作しています。手描きの温かみのあるタッチを得意としています。",
  },
  {
    q: ["プロフィール", "経歴", "自己紹介", "誰", "どんな人"],
    a: "KATSUNOSHIN UTSUMI（内海勝乃真）です。福岡出身で、現在は株式会社ホテリエでWEBデザイナーとして勤務しています。不動産会社での広告制作、映像制作、イラスト制作などの経験もあります。",
  },
]
function getBotReply(input: string): string {
  const lower = input.toLowerCase()
  for (const { q, a } of faq) {
    if (q.some((kw) => lower.includes(kw))) return a
  }
  return "ご質問ありがとうございます。「対応範囲」「実績」「プロフィール」「ご依頼方法」などについてお答えできます。お気軽にどうぞ！"
}

const QUICK = ["何を頼める？", "実績を見たい", "プロフィールは？", "依頼するには？"]

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "こんにちは！KATSUNOSHIN UTSUMIのポートフォリオへようこそ。\n対応範囲や実績について、お気軽にご質問ください😊\n下のボタンからお気軽にどうぞ！",
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
              Q&amp;A
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
                  <p className="text-[#faf9f7]/50 text-xs font-['Inter']">オンライン · Q&amp;A</p>
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
        <Services />
        <Works />
        <Skills />
        <Contact />
      </main>
      <Chatbot />
    </PasswordGate>
  )
}
