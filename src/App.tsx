import { useState, useEffect, useRef } from 'react';
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useInView,
    useMotionValue,
    useSpring,
} from 'framer-motion';
import {
    Heart,
    Home,
    Users,
    Star,
    Camera,
    ChevronDown,
    Menu,
    X,
    Shield,
    HandHeart,
    Sparkles,
    Baby,
    GraduationCap,
    TreePine,
    ArrowUp,
    Quote,
    Clock,
    MapPin,
    Phone,
    Mail,
} from 'lucide-react';

/* ============================================================
   GLOBAL STYLES (injected)
   ============================================================ */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

  :root {
    --gold: #C9A96E;
    --gold-light: #E8D5B0;
    --gold-dark: #A07840;
    --cream: #FBF8F3;
    --warm-dark: #1A1410;
    --warm-mid: #2D2318;
    --family-primary: #8B4513;
    --family-accent: #C9A96E;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--warm-dark);
    overflow-x: hidden;
  }

  .font-display { font-family: 'Cormorant Garamond', serif; }
  .font-serif { font-family: 'Playfair Display', serif; }

  /* Grain texture overlay */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 128px;
  }

  /* Decorative line */
  .ornament-line {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ornament-line::before,
  .ornament-line::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }

  /* Parallax shimmer */
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .text-shimmer {
    background: linear-gradient(90deg, var(--gold-dark) 0%, var(--gold) 40%, #F5E6C8 50%, var(--gold) 60%, var(--gold-dark) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(3deg); }
  }
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(-2deg); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 1s; }

  /* Elegant scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

  /* Card hover glow */
  .card-glow:hover {
    box-shadow: 0 0 40px rgba(201, 169, 110, 0.15), 0 20px 60px rgba(26, 20, 16, 0.12);
  }

  /* Mask gradient for images */
  .img-mask { mask-image: linear-gradient(to bottom, black 60%, transparent 100%); }

  /* Decorative diamond */
  .diamond {
    width: 8px;
    height: 8px;
    background: var(--gold);
    transform: rotate(45deg);
    display: inline-block;
  }
`;

/* ============================================================
   TYPES
   ============================================================ */
interface FamilyMember {
    id: number;
    name: string;
    role: string;
    birthYear: string;
    photo: string;
    quote: string;
    hobbies: string[];
    description: string;
}

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

interface GalleryImage {
    id: number;
    src: string;
    alt: string;
    category: string;
}

/* ============================================================
   DATA
   ============================================================ */
const familyMembers: FamilyMember[] = [
    {
        id: 1,
        name: 'Kamaruddin',
        role: 'Kepala Keluarga',
        birthYear: '1975',
        photo: '/images/father.jpeg',
        quote: 'Keluarga adalah tempat kita pulang, tempat kita bersandar.',
        hobbies: ['Berkebun', 'Membaca', 'Memancing'],
        description:
            'Seorang ayah yang penuh kebijaksanaan dan selalu menjadi pilar kekuatan bagi seluruh keluarga. Dengan keteguhan hati dan kasih sayang yang tak terbatas, Beliau selalu menginspirasi setiap anggota keluarga untuk menjadi versi terbaik dari diri mereka sendiri.',
    },
    {
        id: 2,
        name: 'Sarinah',
        role: 'Ibu',
        birthYear: '1978',
        photo: '/images/mother.jpeg',
        quote: 'Cinta seorang ibu adalah benang yang menyatukan keluarga.',
        hobbies: ['Memasak', 'Menjahit', 'Berkebun'],
        description:
            'Sosok ibu yang penuh kasih sayang dan selalu membawa kehangatan di setiap sudut rumah. Tangan-tangannya yang lembut selalu siap memeluk, dan senyumnya menjadi pelita di hari-hari yang gelap.',
    },
    {
        id: 3,
        name: 'Ahmad Kurniadi',
        role: 'Anak Pertama',
        birthYear: '1998',
        photo: '/images/anak1.jpeg',
        quote: 'Mimpi besar dimulai dari keluarga yang mendukung.',
        hobbies: ['Editing', 'Memancing', 'Kicau Mania'],
        description:
            'Anak pertama dalam keluarga ini tumbuh sebagai sosok panutan bagi adik-adiknya, membawa tanggung jawab dengan sikap tenang, kuat, dan penuh keteguhan. Ia selalu berusaha bangkit setiap kali menghadapi kesulitan, menjadikan dirinya contoh nyata bagi adik-adiknya untuk tetap bertahan dan tidak mudah menyerah.',
    },
    {
        id: 4,
        name: 'Riskila Anjayani',
        role: 'Anak Kedua',
        birthYear: '2000',
        photo: '/images/anak2.jpeg',
        quote: 'Keluarga adalah karya seni terindah yang pernah ada.',
        hobbies: ['Videografi', 'Editing', 'Menulis'],
        description:
            'Anak kedua perempuan dalam keluarga ini dikenal sebagai sosok yang genius, cerdas, dan cepat memahami berbagai hal. Ia sering menjadi tempat bergantung bagi saudara-saudaranya karena ketenangan dan kemampuannya dalam mencari solusi di setiap situasi.',
    },
    {
        id: 5,
        name: 'Muhammad Irfandi',
        role: 'Anak Ketiga',
        birthYear: '2003',
        photo: '/images/anak3.jpeg',
        quote: 'Tawa adalah bahasa cinta keluarga kami.',
        hobbies: ['Music', 'Guitarist', 'Anime Lovers'],
        description:
            'Anak ketiga dalam keluarga ini adalah sosok yang ceria, hangat, dan mudah berbaur dengan siapa saja. Kehadirannya selalu membawa suasana hidup dalam keluarga, membuat rumah terasa lebih ramai dengan tawa dan keceriaan.',
    },
    {
        id: 6,
        name: 'Muhammad Arifin',
        role: 'Anak Keempat',
        birthYear: '2007',
        photo: '/images/anak4.jpeg',
        quote: 'Dalam kesunyian, jiwa belajar menjadi tenang.',
        hobbies: ['Music', 'Playing Games', 'Belajar Hal Baru'],
        description:
            'Seorang anak dengan obsesi yang kuat dan terlihat berbeda dari yang lain. Ia punya cara sendiri dalam memandang hidup, tidak mudah mengikuti arus, dan selalu percaya pada jalannya sendiri meski sering diragukan.',
    },
    {
        id: 7,
        name: 'Sakinah Tul Husna',
        role: 'Anak Kelima',
        birthYear: '2011',
        photo: '/images/perayaan5.jpeg',
        quote: 'Aku bungsu, aku warna terakhir yang melengkapi keluarga',
        hobbies: ['Fotografi', 'Videografi', 'Editing'],
        description:
            'Si bungsu yang selalu membawa tawa dan keceriaan. Sakinah adalah lem perekat yang selalu membuat keluarga berkumpul dan tertawa bersama. Enerjik dan penuh semangat menjalani hidup.',
    },
    {
        id: 8,
        name: 'Ainun',
        role: 'Anak Keenam',
        birthYear: '',
        photo: '/images/anak6.jpeg',
        quote: 'Main itu adalah tugas paling pentingku.',
        hobbies: ['Bermain', 'Menonton', ''],
        description:
            'Kehadirannya membawa kehangatan tersendiri, memperkuat rasa persaudaraan, serta menunjukkan bahwa keluarga dibentuk bukan hanya dari darah, tetapi juga dari hati yang saling menerima dan menyayangi.',
    },
];

const timelineEvents: TimelineEvent[] = [
    {
        year: '1997',
        title: 'Pernikahan',
        description:
            'Kamaruddin dan Sarinah menyatukan cinta dalam ikatan pernikahan yang penuh berkah.',
        icon: <Star className="w-5 h-5" />,
    },
    {
        year: '1998',
        title: 'Kelahiran Ahmad Kurniadi',
        description:
            'Anak pertama lahir membawa kebahagiaan yang tak terhingga bagi keluarga.',
        icon: <Baby className="w-5 h-5" />,
    },
    {
        year: '2000',
        title: 'Kelahiran Riskila Anjayani',
        description:
            'Gadis kecil pertama kami hadir melengkapi kebahagiaan keluarga kecil.',
        icon: <Baby className="w-5 h-5" />,
    },
    {
        year: '2003',
        title: 'Kelahiran Muhammad Irfandi',
        description:
            'Anak ketiga kami lahir melengkapi tawa dan kekuatan di dalam keluarga kami.',
        icon: <Baby className="w-5 h-5" />,
    },
    {
        year: '2007',
        title: 'Kelahiran Muhammad Arifin',
        description:
            'Anak keempat hadir membawa harapan baru, menguatkan langkah keluarga kecil kami.',
        icon: <Baby className="w-5 h-5" />,
    },
    {
        year: '2011',
        title: 'Kelahiran Sakinah Tul Husna',
        description:
            'Gadis kecil terakhir kami hadir melengkapi kebahagiaan keluarga dengan cinta yang semakin utuh.',
        icon: <Baby className="w-5 h-5" />,
    },
    {
        year: '2025',
        title: 'Wisuda Riskila Anjayani',
        description:
            'Riskila Anjayani menyelesaikan pendidikan sarjananya pada program studi Ilmu Administrasi Negara.',
        icon: <GraduationCap className="w-5 h-5" />,
    },
];

const galleryImages: GalleryImage[] = [
    { id: 1, src: '/images/kebersamaan1.jpeg', alt: 'Hari Raya Idul Fitri', category: 'Kebersamaan' },
    { id: 2, src: '/images/kebersamaan2.jpeg', alt: 'Hari Raya Idul Fitri', category: 'Kebersamaan' },
    { id: 3, src: '/images/kebersamaan3.jpeg', alt: 'Liburan Keluarga', category: 'Kebersamaan' },
    { id: 4, src: '/images/kebersamaan4.jpeg', alt: 'Liburan Keluarga', category: 'Kebersamaan' },
    { id: 5, src: '/images/kebersamaan5.jpeg', alt: 'Hari Raya Idul Fitri', category: 'Kebersamaan' },
    { id: 6, src: '/images/kebersamaan6.jpeg', alt: 'Liburan Keluarga', category: 'Kebersamaan' },
    { id: 7, src: '/images/kebersamaan7.jpeg', alt: 'Liburan Keluarga', category: 'Kebersamaan' },
    { id: 8, src: '/images/kebersamaan8.jpeg', alt: 'Liburan Keluarga', category: 'Kebersamaan' },
    { id: 9, src: '/images/kebersamaan9.jpeg', alt: 'Wisuda MY GIRL', category: 'Kebersamaan' },
    { id: 10, src: '/images/kebersamaan10.jpeg', alt: 'Pasangan Suami dan Istri', category: 'Kebersamaan' },
    { id: 11, src: '/images/kebersamaan11.jpeg', alt: 'Pasangan Suami dan Istri', category: 'Kebersamaan' },
    { id: 12, src: '/images/kebersamaan12.jpeg', alt: 'Pasangan Suami dan Istri', category: 'Kebersamaan' },
    { id: 13, src: '/images/kebersamaan3.jpeg', alt: 'Liburan Keluarga', category: 'Liburan' },
    { id: 14, src: '/images/kebersamaan4.jpeg', alt: 'Liburan Keluarga', category: 'Liburan' },
    { id: 15, src: '/images/kebersamaan6.jpeg', alt: 'Liburan Keluarga', category: 'Liburan' },
    { id: 16, src: '/images/kebersamaan7.jpeg', alt: 'Liburan Keluarga', category: 'Liburan' },
    { id: 17, src: '/images/kebersamaan8.jpeg', alt: 'Liburan Keluarga', category: 'Liburan' },
    { id: 18, src: '/images/liburan.jpeg', alt: 'Liburan Keluarga', category: 'Liburan' },
    { id: 19, src: '/images/liburan2.jpeg', alt: 'Liburan Keluarga', category: 'Liburan' },
    { id: 20, src: '/images/liburan3.jpeg', alt: 'Liburan Keluarga', category: 'Liburan' },
    { id: 21, src: '/images/kebersamaan9.jpeg', alt: 'Wisuda MY BUBUB', category: 'Perayaan' },
    { id: 22, src: '/images/perayaan.jpeg', alt: 'Wisuda MY BUBUB', category: 'Perayaan' },
    { id: 23, src: '/images/perayaan1.jpeg', alt: 'Wisuda MY BUBUB', category: 'Perayaan' },
    { id: 24, src: '/images/perayaan2.jpeg', alt: 'Wisuda MY BUBUB', category: 'Perayaan' },
    { id: 25, src: '/images/beuty.jpeg', alt: 'MY BUBUB', category: 'Elegant Beauty' },
    { id: 26, src: '/images/beuty2.jpeg', alt: 'Cantik Banget Cewe GW', category: 'Elegant Beauty' },
    { id: 27, src: '/images/beuty3.jpeg', alt: 'Soft beauty', category: 'Elegant Beauty' },
    { id: 28, src: '/images/beuty4.jpeg', alt: 'Rare beauty', category: 'Elegant Beauty' },
    { id: 29, src: '/images/beuty5.jpeg', alt: 'Golden beauty', category: 'Elegant Beauty' },
    { id: 30, src: '/images/beuty6.jpeg', alt: 'Queen', category: 'Elegant Beauty' },
    { id: 31, src: '/images/beuty7.jpeg', alt: 'Pure elegance', category: 'Elegant Beauty' },
    { id: 32, src: '/images/beuty8.jpeg', alt: 'Gorgeous soul', category: 'Elegant Beauty' },
    { id: 33, src: '/images/beuty9.jpeg', alt: 'Lovely grace', category: 'Elegant Beauty' },
    { id: 34, src: '/images/beuty10.jpeg', alt: 'Classy woman', category: 'Elegant Beauty' },
    { id: 35, src: '/images/beuty11.jpeg', alt: 'Elegant lady', category: 'Elegant Beauty' },
    { id: 36, src: '/images/beuty12.jpeg', alt: 'Elegant lady', category: 'Elegant Beauty' },
    { id: 37, src: '/images/beuty13.jpeg', alt: 'Elegant lady', category: 'Elegant Beauty' },
    { id: 38, src: '/images/beuty14.jpeg', alt: 'Elegant lady', category: 'Elegant Beauty' },
    { id: 39, src: '/images/perayaan5.jpeg', alt: 'Wisuda My Angel', category: 'Perayaan' },
    { id: 40, src: '/images/kebersamaan13.jpeg', alt: 'Kakak Beradik', category: 'Kebersamaan' },
    { id: 41, src: '/images/kebersamaan14.jpeg', alt: 'Kakak Beradik', category: 'Kebersamaan' },
    { id: 42, src: '/images/man.jpeg', alt: 'Kakak Pertama', category: 'Elegant Man' },
    { id: 43, src: '/images/man2.jpeg', alt: 'Kakak Pertama', category: 'Elegant Man' },
    { id: 44, src: '/images/man3.jpeg', alt: 'Cool Gentleman', category: 'Elegant Man' },
    { id: 45, src: '/images/man4.jpeg', alt: 'Strong Soul', category: 'Elegant Man' },
    { id: 46, src: '/images/man5.jpeg', alt: 'Immortal God', category: 'Elegant Man' },
    { id: 47, src: '/images/man6.jpeg', alt: 'Royal Gentleman', category: 'Elegant Man' },
    { id: 48, src: '/images/man7.jpeg', alt: 'Melayu Culture', category: 'Elegant Man' },
    { id: 49, src: '/images/man8.jpeg', alt: 'Melayu Culture', category: 'Elegant Man' },
    { id: 50, src: '/images/man9.jpeg', alt: 'Golden Boy', category: 'Elegant Man' },
    { id: 51, src: '/images/man10.jpeg', alt: 'Trio Power', category: 'Elegant Man' },
    { id: 52, src: '/images/anak6.jpeg', alt: 'Cute', category: 'Kebersamaan' },
];

const familyValues = [
    { icon: <Heart className="w-7 h-7" />, title: 'Kasih Sayang', description: 'Cinta tanpa syarat yang mengikat setiap anggota keluarga' },
    { icon: <Users className="w-7 h-7" />, title: 'Kebersamaan', description: 'Bersatu kita teguh, bercerai kita runtuh' },
    { icon: <Shield className="w-7 h-7" />, title: 'Kejujuran', description: 'Kejujuran adalah fondasi dari kepercayaan keluarga' },
    { icon: <HandHeart className="w-7 h-7" />, title: 'Ketulusan', description: 'Memberi tanpa mengharapkan imbalan, mencintai tanpa syarat' },
    { icon: <Sparkles className="w-7 h-7" />, title: 'Gotong Royong', description: 'Beban ringan jika dipikul bersama' },
    { icon: <TreePine className="w-7 h-7" />, title: 'Kerendahan Hati', description: 'Rendah hati dan selalu bersyukur atas setiap berkat' },
];

const galleryCategories = ['Semua', 'Kebersamaan', 'Liburan', 'Perayaan', 'Elegant Beauty', 'Elegant Man'];

/* ============================================================
   CURSOR GLOW
   ============================================================ */
function CursorGlow() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 80, damping: 20 });
    const springY = useSpring(y, { stiffness: 80, damping: 20 });

    useEffect(() => {
        const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, [x, y]);

    return (
        <motion.div
            style={{ left: springX, top: springY }}
            className="fixed w-[400px] h-[400px] pointer-events-none z-0 rounded-full"
            css={{ transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
        >
            <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                position: 'absolute', left: '50%', top: '50%'
            }} />
        </motion.div>
    );
}

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    useEffect(() => {
        if (!isInView) return;
        const duration = 2200;
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isInView, target]);

    return <span ref={ref}>{count}{suffix}</span>;
}

/* ============================================================
   SECTION HEADING (enhanced)
   ============================================================ */
function SectionHeading({ subtitle, title, description, light = false }: {
    subtitle: string; title: string; description: string; light?: boolean;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16 lg:mb-20"
        >
            {/* Decorative top */}
            <div className="flex items-center justify-center gap-4 mb-5">
                <span className="block w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
                <span style={{ color: 'var(--gold)', fontFamily: 'DM Sans', fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                    {subtitle}
                </span>
                <span className="block w-16 h-px" style={{ background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
            </div>

            <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 600,
                lineHeight: 1.15,
                color: light ? '#FBF8F3' : 'var(--warm-dark)',
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
            }}>
                {title}
            </h2>

            {/* Ornamental diamond row */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="block w-8 h-px" style={{ background: 'var(--gold-light)' }} />
                <span className="diamond" />
                <span className="block w-8 h-px" style={{ background: 'var(--gold-light)' }} />
            </div>

            <p style={{
                fontSize: '0.95rem',
                maxWidth: '520px',
                margin: '0 auto',
                color: light ? 'rgba(251,248,243,0.65)' : '#6B5A4E',
                lineHeight: 1.8,
                fontWeight: 300
            }}>
                {description}
            </p>
        </motion.div>
    );
}

/* ============================================================
   NAVBAR (enhanced)
   ============================================================ */
function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        { href: '#about', label: 'Tentang' },
        { href: '#members', label: 'Anggota' },
        { href: '#gallery', label: 'Galeri' },
        { href: '#values', label: 'Nilai' },
        { href: '#timeline', label: 'Timeline' },
    ];

    const handleMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsMobileOpen(false);
        setTimeout(() => {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                background: isScrolled ? 'rgba(251,248,243,0.92)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(201,169,110,0.2)' : '1px solid transparent',
                boxShadow: isScrolled ? '0 4px 30px rgba(26,20,16,0.06)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isScrolled ? '68px' : '80px', transition: 'height 0.4s ease' }}>
                    <a href="#" style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.4rem',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        color: isScrolled ? 'var(--warm-dark)' : 'white',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                        display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--gold)', transform: 'rotate(45deg)' }} />
                        Kamaruddin Family
                    </a>

                    <div style={{ display: 'none', gap: '36px' }} className="hidden md:flex items-center">
                        {links.map((l) => (
                            <a key={l.href} href={l.href} style={{
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: isScrolled ? '#4A3728' : 'rgba(255,255,255,0.85)',
                                textDecoration: 'none',
                                transition: 'color 0.3s ease',
                                position: 'relative',
                            }}
                                className="nav-link"
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                                onMouseLeave={e => (e.currentTarget.style.color = isScrolled ? '#4A3728' : 'rgba(255,255,255,0.85)')}
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>

                    <button className="md:hidden" onClick={() => setIsMobileOpen(!isMobileOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isScrolled ? '#4A3728' : 'white' }}>
                        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ background: 'rgba(251,248,243,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(201,169,110,0.2)' }}
                    >
                        <div style={{ padding: '12px 16px 20px' }}>
                            {links.map((l) => (
                                <a key={l.href} href={l.href}
                                    onClick={(e) => handleMobileLinkClick(e, l.href)}
                                    style={{
                                        display: 'block', padding: '14px 0',
                                        fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
                                        color: '#4A3728', textDecoration: 'none',
                                        borderBottom: '1px solid rgba(201,169,110,0.1)'
                                    }}>
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

/* ============================================================
   HERO (enhanced)
   ============================================================ */
function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
    const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <section ref={ref} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            <motion.div style={{ y, scale, position: 'absolute', inset: 0 }}>
                <img src="/images/hero.jpeg" alt="Family Hero"
                    style={{ width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center' }} />
            </motion.div>

            {/* Multi-layer gradient */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(26,20,16,0.75) 0%, rgba(26,20,16,0.4) 50%, rgba(139,69,19,0.5) 100%)'
            }} />
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26,20,16,0.9) 0%, transparent 60%)'
            }} />

            {/* Decorative corner ornaments */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                {/* Top-left ornament */}
                <svg style={{ position: 'absolute', top: 20, left: 20, opacity: 0.3 }} width="80" height="80" viewBox="0 0 80 80">
                    <path d="M10,10 L10,40 M10,10 L40,10" stroke="#C9A96E" strokeWidth="1" fill="none" />
                    <circle cx="10" cy="10" r="3" fill="#C9A96E" />
                </svg>
                {/* Bottom-right ornament */}
                <svg style={{ position: 'absolute', bottom: 20, right: 20, opacity: 0.3 }} width="80" height="80" viewBox="0 0 80 80">
                    <path d="M70,70 L70,40 M70,70 L40,70" stroke="#C9A96E" strokeWidth="1" fill="none" />
                    <circle cx="70" cy="70" r="3" fill="#C9A96E" />
                </svg>

                {/* Floating particles */}
                {[
                    { top: '25%', left: '8%', size: 3, delay: 0 },
                    { top: '35%', right: '12%', size: 4, delay: 1 },
                    { bottom: '35%', left: '20%', size: 2, delay: 2 },
                    { top: '55%', right: '25%', size: 3, delay: 0.5 },
                    { top: '70%', left: '60%', size: 2, delay: 1.5 },
                ].map((p, i) => (
                    <div key={i} className={i % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}
                        style={{
                            position: 'absolute', ...p as any,
                            width: p.size, height: p.size,
                            background: 'var(--gold)', borderRadius: '50%', opacity: 0.5
                        }} />
                ))}
            </div>

            <motion.div style={{ opacity, position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 24px' }}>
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(201,169,110,0.15)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(201,169,110,0.35)',
                        borderRadius: '100px', padding: '8px 22px',
                        color: 'var(--gold-light)', fontSize: '10px', fontWeight: 600,
                        letterSpacing: '0.35em', textTransform: 'uppercase',
                        marginBottom: '28px'
                    }}>
                        <Heart size={12} style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
                        Selamat Datang di
                    </span>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 'clamp(3rem, 10vw, 7rem)',
                        fontWeight: 600,
                        color: 'white',
                        lineHeight: 1.05,
                        letterSpacing: '-0.01em',
                        marginBottom: '20px'
                    }}>
                        Keluarga{' '}
                        <span className="text-shimmer" style={{ display: 'block' }}>Kamaruddin</span>
                    </h1>
                </motion.div>

                {/* Decorative divider */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.85, duration: 0.8 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}
                >
                    <span style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
                    <span className="diamond" />
                    <span style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
                </motion.div>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    style={{
                        color: 'rgba(255,255,255,0.65)',
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                        fontWeight: 300,
                        fontStyle: 'italic',
                        fontFamily: 'Cormorant Garamond, serif',
                        maxWidth: '480px',
                        lineHeight: 1.7,
                        marginBottom: '44px'
                    }}>
                    &ldquo;Keluarga bukanlah sesuatu yang penting.<br />Keluarga adalah segalanya.&rdquo;
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.7 }}
                    style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
                >
                    <a href="#about" style={{
                        background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                        color: 'white',
                        padding: '14px 36px',
                        borderRadius: '100px',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 32px rgba(201,169,110,0.35)',
                        display: 'inline-block'
                    }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 40px rgba(201,169,110,0.5)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(201,169,110,0.35)'; }}
                    >
                        Mengenal Kami
                    </a>
                    <a href="#gallery" style={{
                        background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        color: 'rgba(255,255,255,0.9)',
                        padding: '14px 36px',
                        borderRadius: '100px',
                        fontWeight: 500,
                        fontSize: '0.82rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        display: 'inline-block'
                    }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                    >
                        Galeri Foto
                    </a>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{ position: 'absolute', bottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                >
                    <a href="#stats" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Gulir ke bawah</span>
                        {/* Animated scroll line */}
                        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(201,169,110,0.6), transparent)', position: 'relative', overflow: 'hidden' }}>
                            <motion.div
                                style={{ width: '100%', height: '40%', background: 'var(--gold)', position: 'absolute', top: 0 }}
                                animate={{ top: ['0%', '160%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </div>
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}

/* ============================================================
   STATS (enhanced)
   ============================================================ */
function Stats() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const stats = [
        { icon: <Clock className="w-6 h-6" />, value: 28, suffix: '+', label: 'Tahun Bersama' },
        { icon: <Users className="w-6 h-6" />, value: 7, suffix: '', label: 'Anggota Keluarga' },
        { icon: <Heart className="w-6 h-6" />, value: 2, suffix: '', label: 'Generasi' },
        { icon: <Camera className="w-6 h-6" />, value: 999, suffix: '+', label: 'Kenangan Indah' },
    ];

    return (
        <section id="stats" ref={ref} style={{ position: 'relative', marginTop: '-80px', zIndex: 20, padding: '0 16px' }}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    maxWidth: '900px', margin: '0 auto',
                    background: 'rgba(251,248,243,0.97)', backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    boxShadow: '0 20px 80px rgba(26,20,16,0.12), 0 0 0 1px rgba(201,169,110,0.15)',
                    padding: '48px 40px',
                    position: 'relative', overflow: 'hidden'
                }}
            >
                {/* Decorative corner */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
                    background: 'radial-gradient(circle at top right, rgba(201,169,110,0.1), transparent)', borderRadius: '0 24px 0 0' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '120px', height: '120px',
                    background: 'radial-gradient(circle at bottom left, rgba(201,169,110,0.08), transparent)', borderRadius: '0 0 0 24px' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }} className="md:grid-cols-4-custom">
                    <style>{`@media(min-width:768px){.md\\:grid-cols-4-custom{grid-template-columns:repeat(4,1fr)!important;}}`}</style>
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.15 * i, duration: 0.6 }}
                            style={{ textAlign: 'center', position: 'relative' }}
                        >
                            {i < stats.length - 1 && (
                                <div style={{
                                    position: 'absolute', right: '-16px', top: '20%', height: '60%',
                                    width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.3), transparent)'
                                }} className="hidden md:block" />
                            )}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '52px', height: '52px', borderRadius: '14px',
                                background: 'linear-gradient(135deg, rgba(201,169,110,0.12), rgba(201,169,110,0.06))',
                                border: '1px solid rgba(201,169,110,0.2)',
                                color: 'var(--gold-dark)',
                                marginBottom: '14px'
                            }}>
                                {stat.icon}
                            </div>
                            <div style={{
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '2.5rem', fontWeight: 600,
                                color: 'var(--warm-dark)', lineHeight: 1
                            }}>
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            </div>
                            <div style={{ color: '#8B7355', fontSize: '0.78rem', marginTop: '6px', letterSpacing: '0.05em' }}>
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

/* ============================================================
   ABOUT (enhanced)
   ============================================================ */
function About() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="about" style={{ padding: '100px 0 100px', background: 'var(--cream)' }}>
            <div ref={ref} style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px', alignItems: 'center' }} className="about-grid">
                    <style>{`@media(min-width:1024px){.about-grid{grid-template-columns:1fr 1fr!important;gap:100px!important;}}`}</style>

                    {/* Image side */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        style={{ position: 'relative' }}
                    >
                        {/* Main image */}
                        <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(26,20,16,0.18)', position: 'relative' }}>
                            <img src="/images/family.jpeg" alt="Keluarga Kamaruddin"
                                style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(26,20,16,0.35) 100%)' }} />
                        </div>

                        {/* Floating badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            style={{
                                position: 'absolute', bottom: '-24px', right: '-24px',
                                background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                                borderRadius: '20px', padding: '24px 28px',
                                boxShadow: '0 16px 40px rgba(201,169,110,0.4)',
                                textAlign: 'center'
                            }}
                            className="hidden lg:block"
                        >
                            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 600, color: 'white', lineHeight: 1 }}>28+</p>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Tahun Bersama</p>
                        </motion.div>

                        {/* Decorative frame */}
                        <div style={{
                            position: 'absolute', top: '-16px', left: '-16px', width: '80px', height: '80px',
                            border: '2px solid rgba(201,169,110,0.35)', borderRadius: '12px'
                        }} className="hidden lg:block" />
                    </motion.div>

                    {/* Text side */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <span style={{ width: '28px', height: '1px', background: 'var(--gold)' }} />
                            Tentang Kami
                        </span>

                        <h2 style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 600,
                            color: 'var(--warm-dark)',
                            lineHeight: 1.2,
                            marginBottom: '28px'
                        }}>
                            Cerita Keluarga{' '}
                            <span style={{ color: 'var(--gold-dark)', fontStyle: 'italic' }}>Kamaruddin</span>
                        </h2>

                        <p style={{ color: '#6B5A4E', lineHeight: 1.9, marginBottom: '20px', fontSize: '0.95rem', fontWeight: 300 }}>
                            Terkumpul oleh cinta, diikat oleh kebersamaan. Keluarga Kamaruddin adalah keluarga kecil yang penuh kasih sayang, yang selalu saling mendukung dalam suka maupun duka.
                        </p>
                        <p style={{ color: '#6B5A4E', lineHeight: 1.9, marginBottom: '36px', fontSize: '0.95rem', fontWeight: 300 }}>
                            Berawal dari pertemuan sederhana yang berubah menjadi cinta sejati, kini keluarga ini telah tumbuh menjadi tempat berteduh yang hangat bagi setiap anggotanya. Kami percaya bahwa kebahagiaan sejati ada di dalam kebersamaan.
                        </p>

                        {/* Feature pills */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '40px' }}>
                            {[
                                { icon: <Heart size={16} />, text: 'Penuh Kasih Sayang' },
                                { icon: <Home size={16} />, text: 'Rumah yang Hangat' },
                                { icon: <Users size={16} />, text: 'Saling Mendukung' },
                                { icon: <Star size={16} />, text: 'Selalu Bersyukur' },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '12px 16px',
                                    background: 'rgba(201,169,110,0.08)',
                                    border: '1px solid rgba(201,169,110,0.15)',
                                    borderRadius: '12px',
                                    color: '#5A3E28',
                                    fontSize: '0.82rem', fontWeight: 500
                                }}>
                                    <span style={{ color: 'var(--gold)' }}>{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        <a href="#members" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            background: 'var(--warm-dark)',
                            color: 'var(--gold-light)',
                            padding: '14px 32px',
                            borderRadius: '100px',
                            fontWeight: 500, fontSize: '0.82rem',
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 24px rgba(26,20,16,0.2)'
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 36px rgba(26,20,16,0.3)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(26,20,16,0.2)'; }}
                        >
                            Kenali Anggota Kami
                            <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ============================================================
   MEMBER MODAL (enhanced)
   ============================================================ */
function MemberModal({ member, onClose }: { member: FamilyMember | null; onClose: () => void }) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
    }, [onClose]);

    if (!member) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 50,
                background: 'rgba(26,20,16,0.75)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 30 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                style={{
                    background: 'var(--cream)',
                    borderRadius: '24px',
                    maxWidth: '500px', width: '100%',
                    overflow: 'hidden',
                    boxShadow: '0 40px 100px rgba(26,20,16,0.4)',
                    border: '1px solid rgba(201,169,110,0.2)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ position: 'relative', height: '280px' }}>
                    <img src={member.photo} alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,20,16,0.85) 0%, rgba(26,20,16,0.1) 60%, transparent 100%)' }} />
                    <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
                        <p style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '6px' }}>
                            {member.role} · {member.birthYear}
                        </p>
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 600, color: 'white' }}>
                            {member.name}
                        </h3>
                    </div>
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'rgba(26,20,16,0.4)', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '50%', padding: '8px',
                        color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease'
                    }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '28px 28px 32px' }}>
                    {/* Quote */}
                    <div style={{
                        borderLeft: '2px solid var(--gold)',
                        paddingLeft: '16px', marginBottom: '20px'
                    }}>
                        <p style={{ color: '#8B7355', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', lineHeight: 1.6 }}>
                            "{member.quote}"
                        </p>
                    </div>

                    <p style={{ color: '#6B5A4E', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '24px', fontWeight: 300 }}>
                        {member.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {member.hobbies.filter(h => h).map(hobby => (
                            <span key={hobby} style={{
                                background: 'rgba(201,169,110,0.1)',
                                border: '1px solid rgba(201,169,110,0.25)',
                                color: '#7A5C38',
                                padding: '6px 14px', borderRadius: '100px',
                                fontSize: '0.75rem', fontWeight: 500
                            }}>
                                {hobby}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ============================================================
   FAMILY MEMBERS (enhanced)
   ============================================================ */
function FamilyMembers() {
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const roleGradients: Record<string, string> = {
        'Kepala Keluarga': 'linear-gradient(135deg, #92600F, #C9A96E)',
        'Ibu': 'linear-gradient(135deg, #8B4052, #C97080)',
        'Anak Pertama': 'linear-gradient(135deg, #1A4B7A, #4A90C4)',
        'Anak Kedua': 'linear-gradient(135deg, #5A3080, #9A70C4)',
        'Anak Ketiga': 'linear-gradient(135deg, #1A5A3A, #4A9A6A)',
        'Anak Keempat': 'linear-gradient(135deg, #5A4020, #9A7850)',
        'Anak Kelima': 'linear-gradient(135deg, #3A5A1A, #7A9A4A)',
        'Anak Keenam': 'linear-gradient(135deg, #3A3A7A, #6A6AC4)',
    };

    return (
        <section id="members" style={{ padding: '100px 0', background: '#F5F0EA' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                <SectionHeading
                    subtitle="Anggota Keluarga"
                    title="Keluarga Kami"
                    description="Setiap anggota memiliki cerita dan peran penting dalam menjaga kebersamaan keluarga."
                />

                <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="members-grid">
                    <style>{`@media(min-width:768px){.members-grid{grid-template-columns:repeat(3,1fr)!important;}} @media(min-width:1200px){.members-grid{grid-template-columns:repeat(4,1fr)!important;}}`}</style>

                    {familyMembers.map((member, i) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            onClick={() => setSelectedMember(member)}
                            style={{
                                cursor: 'pointer', borderRadius: '20px', overflow: 'hidden',
                                background: 'white',
                                boxShadow: '0 4px 24px rgba(26,20,16,0.07)',
                                border: '1px solid rgba(201,169,110,0.12)',
                                transition: 'box-shadow 0.4s ease'
                            }}
                            className="card-glow"
                        >
                            <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                                <img src={member.photo} alt={member.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                                    className="member-img"
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,20,16,0.65) 0%, transparent 55%)' }} />
                                <span style={{
                                    position: 'absolute', top: '14px', right: '14px',
                                    background: roleGradients[member.role] || 'linear-gradient(135deg, #92600F, #C9A96E)',
                                    color: 'white', fontSize: '9px', fontWeight: 700,
                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                    padding: '5px 12px', borderRadius: '100px'
                                }}>
                                    {member.role}
                                </span>
                                <div style={{ position: 'absolute', bottom: '14px', left: '18px', right: '18px' }}>
                                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>
                                        {member.name}
                                    </h3>
                                </div>
                            </div>

                            <div style={{ padding: '18px 20px 20px' }}>
                                <p style={{ color: '#8B7355', fontSize: '0.8rem', marginBottom: '14px', lineHeight: 1.6, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    "{member.quote}"
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#B0906A', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                                        {member.birthYear ? `Lahir ${member.birthYear}` : ''}
                                    </span>
                                    <span style={{ color: 'var(--gold-dark)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Lihat Detail →
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
            </AnimatePresence>
        </section>
    );
}

/* ============================================================
   LIGHTBOX (enhanced)
   ============================================================ */
function Lightbox({ image, onClose }: { image: GalleryImage | null; onClose: () => void }) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
    }, [onClose]);

    if (!image) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 50,
                background: 'rgba(10,6,4,0.95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}
            onClick={onClose}
        >
            <motion.img
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.88, opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                src={image.src}
                alt={image.alt}
                style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}
                onClick={e => e.stopPropagation()}
            />
            <button onClick={onClose} style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%', padding: '12px', cursor: 'pointer',
                color: 'rgba(255,255,255,0.7)', display: 'flex', transition: 'all 0.2s ease'
            }}>
                <X size={22} />
            </button>
            <div style={{ position: 'absolute', bottom: '24px', textAlign: 'center', left: '50%', transform: 'translateX(-50%)' }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{image.alt}</p>
                <p style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '4px' }}>{image.category}</p>
            </div>
        </motion.div>
    );
}

/* ============================================================
   GALLERY (enhanced)
   ============================================================ */
function Gallery() {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const filtered = activeCategory === 'Semua' ? galleryImages : galleryImages.filter(img => img.category === activeCategory);

    return (
        <section id="gallery" style={{ padding: '100px 0', background: 'var(--cream)' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                <SectionHeading
                    subtitle="Galeri Foto"
                    title="Momen Berharga"
                    description="Kumpulan foto-foto yang menangkap kebahagiaan dan kebersamaan keluarga Kamaruddin."
                />

                {/* Category Filter */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '48px' }}>
                    {galleryCategories.map(cat => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '10px 22px', borderRadius: '100px',
                                fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.05em',
                                cursor: 'pointer', border: 'none', transition: 'all 0.3s ease',
                                background: activeCategory === cat
                                    ? 'linear-gradient(135deg, var(--gold-dark), var(--gold))'
                                    : 'rgba(201,169,110,0.1)',
                                color: activeCategory === cat ? 'white' : '#7A5C38',
                                boxShadow: activeCategory === cat ? '0 6px 20px rgba(201,169,110,0.35)' : 'none',
                                border: activeCategory === cat ? 'none' : '1px solid rgba(201,169,110,0.2)',
                            }}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Gallery grid */}
                <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="gallery-grid">
                    <style>{`@media(min-width:640px){.gallery-grid{grid-template-columns:repeat(3,1fr)!important;}} @media(min-width:1024px){.gallery-grid{grid-template-columns:repeat(4,1fr)!important;}}`}</style>

                    <AnimatePresence mode="popLayout">
                        {filtered.map((img, i) => (
                            <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ delay: i * 0.04, duration: 0.4 }}
                                onClick={() => setSelectedImage(img)}
                                style={{
                                    position: 'relative', overflow: 'hidden',
                                    borderRadius: '16px', aspectRatio: '1',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 20px rgba(26,20,16,0.08)',
                                    border: '1px solid rgba(201,169,110,0.1)'
                                }}
                            >
                                <img src={img.src} alt={img.alt}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)', display: 'block' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; (e.currentTarget.parentElement?.querySelector('.gallery-overlay') as HTMLElement)?.style && ((e.currentTarget.parentElement?.querySelector('.gallery-overlay') as HTMLElement).style.opacity = '1'); }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget.parentElement?.querySelector('.gallery-overlay') as HTMLElement)?.style && ((e.currentTarget.parentElement?.querySelector('.gallery-overlay') as HTMLElement).style.opacity = '0'); }}
                                />
                                <div className="gallery-overlay" style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to top, rgba(26,20,16,0.75) 0%, rgba(26,20,16,0.1) 60%, transparent 100%)',
                                    opacity: 0, transition: 'opacity 0.4s ease',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div style={{
                                        background: 'rgba(201,169,110,0.2)', backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(201,169,110,0.4)',
                                        borderRadius: '50%', padding: '14px',
                                        color: 'var(--gold-light)'
                                    }}>
                                        <Camera size={20} />
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px' }}>
                                        <p style={{ color: 'white', fontSize: '0.78rem', fontWeight: 500 }}>{img.alt}</p>
                                        <p style={{ color: 'var(--gold-light)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>{img.category}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {selectedImage && <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />}
            </AnimatePresence>
        </section>
    );
}

/* ============================================================
   VALUES (enhanced)
   ============================================================ */
function Values() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="values" style={{
            padding: '100px 0',
            background: 'linear-gradient(135deg, #1A1410 0%, #2D1A0E 50%, #1A1410 100%)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Background decorations */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(201,169,110,0.08), transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(139,69,19,0.1), transparent 70%)', borderRadius: '50%' }} />
                {/* Grid pattern */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.04,
                    backgroundImage: 'linear-gradient(rgba(201,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
            </div>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
                <SectionHeading
                    subtitle="Nilai-Nilai Kami"
                    title="Pondasi Keluarga"
                    description="Nilai-nilai luhur yang menjadi pedoman setiap langkah keluarga Kamaruddin."
                    light
                />

                <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' }} className="values-grid">
                    <style>{`@media(min-width:640px){.values-grid{grid-template-columns:repeat(2,1fr)!important;}} @media(min-width:1024px){.values-grid{grid-template-columns:repeat(3,1fr)!important;}}`}</style>

                    {familyValues.map((value, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            style={{
                                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(201,169,110,0.15)',
                                borderRadius: '20px', padding: '36px 32px',
                                transition: 'all 0.4s ease',
                                position: 'relative', overflow: 'hidden',
                                cursor: 'default'
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.08)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.35)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.15)';
                            }}
                        >
                            {/* Card number */}
                            <div style={{
                                position: 'absolute', top: '20px', right: '24px',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '3rem', fontWeight: 700, color: 'rgba(201,169,110,0.08)', lineHeight: 1
                            }}>
                                {String(i + 1).padStart(2, '0')}
                            </div>

                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.08))',
                                border: '1px solid rgba(201,169,110,0.25)',
                                color: 'var(--gold)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '24px'
                            }}>
                                {value.icon}
                            </div>

                            <h3 style={{
                                fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600,
                                color: 'var(--gold-light)', marginBottom: '12px'
                            }}>
                                {value.title}
                            </h3>
                            <p style={{ color: 'rgba(251,248,243,0.5)', fontSize: '0.88rem', lineHeight: 1.7, fontWeight: 300 }}>
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ============================================================
   TIMELINE (enhanced)
   ============================================================ */
function Timeline() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="timeline" style={{ padding: '100px 0', background: '#F5F0EA' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                <SectionHeading
                    subtitle="Perjalanan Kami"
                    title="Timeline Keluarga"
                    description="Momen-momen penting yang membentuk keluarga Kamaruddin menjadi seperti sekarang."
                />

                <div ref={ref} style={{ position: 'relative' }}>
                    {/* Vertical line */}
                    <div style={{
                        position: 'absolute', left: '24px', top: 0, bottom: 0, width: '1px',
                        background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.4) 10%, rgba(201,169,110,0.4) 90%, transparent)'
                    }} className="timeline-line" />
                    <style>{`@media(min-width:768px){.timeline-line{left:50%!important;transform:translateX(-50%);}}`}</style>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                        {timelineEvents.map((event, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '24px' }}
                                    className={`timeline-item-${isLeft ? 'left' : 'right'}`}
                                >
                                    <style>{`
                                        @media(min-width:768px){
                                            .timeline-item-left{flex-direction:row!important;}
                                            .timeline-item-right{flex-direction:row-reverse!important;}
                                            .timeline-content-left{text-align:right!important;}
                                            .timeline-content-right{text-align:left!important;}
                                        }
                                    `}</style>

                                    {/* Dot */}
                                    <div style={{
                                        position: 'absolute', left: '24px', top: '10px', zIndex: 10,
                                        transform: 'translateX(-50%)'
                                    }} className="timeline-dot">
                                        <style>{`@media(min-width:768px){.timeline-dot{left:50%!important;}}`}</style>
                                        <div style={{
                                            width: '44px', height: '44px',
                                            background: 'white',
                                            border: '3px solid var(--gold)',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--gold-dark)',
                                            boxShadow: '0 4px 16px rgba(201,169,110,0.3)'
                                        }}>
                                            {event.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{ marginLeft: '72px', flex: 1 }} className={`timeline-content-${isLeft ? 'left' : 'right'} timeline-content`}>
                                        <style>{`@media(min-width:768px){.timeline-content{margin-left:0!important;width:calc(50% - 44px)!important;}}`}</style>
                                        <div style={{
                                            background: 'white',
                                            border: '1px solid rgba(201,169,110,0.15)',
                                            borderRadius: '18px',
                                            padding: '24px 28px',
                                            boxShadow: '0 4px 24px rgba(26,20,16,0.06)',
                                            transition: 'box-shadow 0.3s ease'
                                        }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(201,169,110,0.15)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(26,20,16,0.06)'}
                                        >
                                            <span style={{
                                                display: 'inline-block',
                                                background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                                fontFamily: 'Cormorant Garamond, serif',
                                                fontSize: '1.1rem', fontWeight: 700,
                                                marginBottom: '6px'
                                            }}>
                                                {event.year}
                                            </span>
                                            <h3 style={{
                                                fontFamily: 'Cormorant Garamond, serif',
                                                fontSize: '1.2rem', fontWeight: 600,
                                                color: 'var(--warm-dark)', marginBottom: '8px'
                                            }}>
                                                {event.title}
                                            </h3>
                                            <p style={{ color: '#8B7355', fontSize: '0.84rem', lineHeight: 1.7, fontWeight: 300 }}>
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ============================================================
   FAMILY QUOTE (enhanced)
   ============================================================ */
function FamilyQuote() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section style={{ padding: '100px 0', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
            {/* Large decorative quote mark */}
            <div style={{
                position: 'absolute', top: '-20px', left: '-10px',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '280px', fontWeight: 700,
                color: 'rgba(201,169,110,0.06)',
                lineHeight: 1, pointerEvents: 'none', userSelect: 'none'
            }}>
                &ldquo;
            </div>

            <div ref={ref} style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div style={{ marginBottom: '36px' }}>
                        <Quote size={40} style={{ color: 'var(--gold)', opacity: 0.6, margin: '0 auto' }} />
                    </div>

                    <blockquote style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        color: 'var(--warm-dark)',
                        lineHeight: 1.6,
                        marginBottom: '40px'
                    }}>
                        Rumah bukanlah sebuah tempat, rumah adalah{' '}
                        <em style={{ color: 'var(--gold-dark)', fontWeight: 600 }}>perasaan</em>. Dan
                        perasaan itu ada ketika kita bersama{' '}
                        <em style={{ color: 'var(--gold-dark)', fontWeight: 600 }}>keluarga</em>.
                    </blockquote>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                        <span style={{ display: 'block', width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
                        <span className="diamond" />
                        <span style={{ color: '#8B7355', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            Keluarga Kamaruddin
                        </span>
                        <span className="diamond" />
                        <span style={{ display: 'block', width: '60px', height: '1px', background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/* ============================================================
   FOOTER (enhanced)
   ============================================================ */
function Footer() {
    return (
        <footer style={{ background: 'var(--warm-dark)', color: 'white', paddingTop: '80px', paddingBottom: '36px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                {/* Top section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', marginBottom: '60px' }} className="footer-grid">
                    <style>{`@media(min-width:768px){.footer-grid{grid-template-columns:repeat(3,1fr)!important;}}`}</style>

                    <div>
                        <h3 style={{
                            fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 600,
                            color: 'var(--gold-light)', marginBottom: '16px',
                            display: 'flex', alignItems: 'center', gap: '12px'
                        }}>
                            <span className="diamond" />
                            Kamaruddin Family
                        </h3>
                        <p style={{ color: 'rgba(251,248,243,0.4)', fontSize: '0.85rem', lineHeight: 1.8, fontWeight: 300 }}>
                            Keluarga kecil yang penuh kasih sayang, selalu saling mendukung dan mengasihi dalam setiap langkah kehidupan.
                        </p>

                        {/* Golden divider */}
                        <div style={{ marginTop: '24px', width: '48px', height: '2px', background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
                    </div>

                    <div>
                        <h4 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
                            Navigasi
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { href: '#about', label: 'Tentang Kami' },
                                { href: '#members', label: 'Anggota Keluarga' },
                                { href: '#gallery', label: 'Galeri Foto' },
                                { href: '#values', label: 'Nilai-Nilai' },
                                { href: '#timeline', label: 'Timeline' },
                            ].map(link => (
                                <a key={link.href} href={link.href} style={{
                                    color: 'rgba(251,248,243,0.4)', textDecoration: 'none',
                                    fontSize: '0.85rem', transition: 'color 0.2s ease',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(251,248,243,0.4)'}
                                >
                                    <span style={{ width: '16px', height: '1px', background: 'var(--gold)', opacity: 0.4 }} />
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
                            Kontak
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { icon: <MapPin size={15} />, text: 'Jl. Kampung Bagan No. 73, Batam' },
                                { icon: <Phone size={15} />, text: '+62----------' },
                                { icon: <Mail size={15} />, text: 'keluarga@kamaruddin.id' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(251,248,243,0.4)', fontSize: '0.84rem' }}>
                                    <span style={{ color: 'var(--gold)', marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(201,169,110,0.15)',
                    paddingTop: '28px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                    textAlign: 'center'
                }} className="footer-bottom">
                    <style>{`@media(min-width:640px){.footer-bottom{flex-direction:row!important;justify-content:space-between!important;}}`}</style>
                    <p style={{ color: 'rgba(251,248,243,0.25)', fontSize: '0.75rem' }}>
                        © {new Date().getFullYear()} Keluarga Kamaruddin. Dibuat dengan{' '}
                        <Heart size={11} style={{ display: 'inline', verticalAlign: 'middle', color: '#C97080', fill: '#C97080' }} />{' '}
                        dan kebersamaan.
                    </p>
                    <p style={{ color: 'rgba(201,169,110,0.35)', fontSize: '0.75rem' }}>
                        Rumah adalah di mana hati merasa nyaman 🏡
                    </p>
                </div>
            </div>
        </footer>
    );
}

/* ============================================================
   SCROLL TO TOP (enhanced)
   ============================================================ */
function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggle = () => setIsVisible(window.scrollY > 400);
        window.addEventListener('scroll', toggle);
        return () => window.removeEventListener('scroll', toggle);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{
                        position: 'fixed', bottom: '28px', right: '28px', zIndex: 40,
                        background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                        color: 'white', width: '48px', height: '48px',
                        borderRadius: '50%', border: 'none',
                        boxShadow: '0 8px 28px rgba(201,169,110,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowUp size={20} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
    return (
        <>
            <style>{globalStyles}</style>
            <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
                <CursorGlow />
                <Navbar />
                <Hero />
                <Stats />
                <About />
                <FamilyMembers />
                <Gallery />
                <Values />
                <Timeline />
                <FamilyQuote />
                <Footer />
                <ScrollToTop />
            </div>
        </>
    );
}
