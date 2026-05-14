import { useState, useEffect, useRef } from 'react';
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useInView,
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
            'Anak pertama dalam keluarga ini tumbuh sebagai sosok panutan bagi adik-adiknya, membawa tanggung jawab dengan sikap tenang, kuat, dan penuh keteguhan. Ia selalu berusaha bangkit setiap kali menghadapi kesulitan, menjadikan dirinya contoh nyata bagi adik-adiknya untuk tetap bertahan dan tidak mudah menyerah. Dengan cara hidupnya sendiri, ia menjadi “pahlawan kecil” dalam keluarga—yang melindungi, menguatkan, dan memberi arah tanpa banyak kata, sehingga kehadirannya menjadi teladan dalam setiap langkah kehidupan.',
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
            'Anak kedua perempuan dalam keluarga ini dikenal sebagai sosok yang genius, cerdas, dan cepat memahami berbagai hal. Ia sering menjadi tempat bergantung bagi saudara-saudaranya karena ketenangan dan kemampuannya dalam mencari solusi di setiap situasi. kehadirannya sangat penting dalam keluarga, menjadi penyeimbang dan penguat bagi kakak maupun adiknya, sehingga ia selalu diandalkan dalam banyak keadaan.',
    },
    {
        id: 5,
        name: 'Muhammad Irfandi',
        role: 'Anak Ketiga',
        birthYear: '2003',
        photo: '/images/anak3.jpeg',
        quote: 'Tawa adalah bahasa cinta keluarga kami.',
        hobbies: ['music', 'Guitarist', 'Anime Lovers'],
        description:
            'Anak ketiga dalam keluarga ini adalah sosok yang ceria, hangat, dan mudah berbaur dengan siapa saja. Kehadirannya selalu membawa suasana hidup dalam keluarga, membuat rumah terasa lebih ramai dengan tawa dan keceriaan. Ia menjadi penghubung yang mempererat hubungan antar saudara, karena sifatnya yang terbuka dan mudah dekat dengan semua orang, sehingga keberadaannya memberi warna tersendiri dalam kebersamaan keluarga.',
    },
    {
        id: 6,
        name: 'Muhammad Arifin',
        role: 'Anak Keempat',
        birthYear: '2007',
        photo: '/images/anak4.jpeg',
        quote: ' Dalam kesunyian, jiwa belajar menjadi tenang,dan dari ketenangan lahir kekuatan.',
        hobbies: ['music', 'Playing Games', 'Belajar Hal Baru'],
        description:
            'Seorang anak dengan obsesi yang kuat dan terlihat berbeda dari yang lain. Ia punya cara sendiri dalam memandang hidup, tidak mudah mengikuti arus, dan selalu percaya pada jalannya sendiri meski sering diragukan. Di balik sikapnya yang diam, ada tekad besar yang terus tumbuh, seperti api kecil yang tidak pernah padam.',
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
        role: 'Anak keenam',
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
            'Gadis kecil Pertama kami hadir melengkapi kebahagiaan keluarga kecil.',
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
            'Gadis kecil terakhir kami hadir melengkapi kebahagiaan keluarga kecil ini dengan cinta yang semakin utuh.',
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
    {
        id: 1,
        src: '/images/kebersamaan1.jpeg',
        alt: 'Hari Raya Idul Fitri',
        category: 'Kebersamaan',
    },
    {
        id: 2,
        src: '/images/kebersamaan2.jpeg',
        alt: 'Hari Raya Idul Fitri',
        category: 'Kebersamaan',
    },
    {
        id: 3,
        src: '/images/kebersamaan3.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Kebersamaan',
    },
    {
        id: 4,
        src: '/images/kebersamaan4.jpeg',
        alt: 'liburan keluarga',
        category: 'Kebersamaan',
    },
    {
        id: 5,
        src: '/images/kebersamaan5.jpeg',
        alt: 'Hari Raya Idul Fitri',
        category: 'Kebersamaan',
    },
    {
        id: 6,
        src: '/images/kebersamaan6.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Kebersamaan',
    },
    {
        id: 7,
        src: '/images/kebersamaan7.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Kebersamaan',
    }, 
    {
        id: 8,
        src: '/images/kebersamaan8.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Kebersamaan',
    },
    {
        id: 9,
        src: '/images/kebersamaan9.jpeg',
        alt: 'Wisuda MY GIRL ',
        category: 'Kebersamaan',
    },
    {
        id: 10,
        src: '/images/kebersamaan10.jpeg',
        alt: 'Pasangan Suami dan Istri',
        category: 'Kebersamaan',
    },
    {
        id: 11,
        src: '/images/kebersamaan11.jpeg',
        alt: 'Pasangan Suami dan Istri',
        category: 'Kebersamaan',
    },
    {
        id: 12,
        src: '/images/kebersamaan12.jpeg',
        alt: 'Pasangan Suami dan Istri',
        category: 'Kebersamaan',
    },
    {
        id: 13,
        src: '/images/kebersamaan3.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Liburan',
    },
    {
        id: 14,
        src: '/images/kebersamaan4.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Liburan',
    },
    {
        id: 15,
        src: '/images/kebersamaan6.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Liburan',
    },
    {
        id: 16,
        src: '/images/kebersamaan7.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Liburan',
    },
    {
        id: 17,
        src: '/images/kebersamaan8.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Liburan',
    },
    {
        id: 18,
        src: '/images/liburan.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Liburan',
    },
    {
        id: 19,
        src: '/images/liburan2.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Liburan',
    },
    {
        id: 20,
        src: '/images/liburan3.jpeg',
        alt: 'Liburan Keluarga',
        category: 'Liburan',
    },
    {
        id: 21,
        src: '/images/kebersamaan9.jpeg',
        alt: 'Wisuda MY BUBUB ',
        category: 'Perayaan',
    },
    {
        id: 22,
        src: '/images/perayaan.jpeg',
        alt: 'Wisuda MY BUBUB ',
        category: 'Perayaan',
    },
    {
        id: 23,
        src: '/images/perayaan1.jpeg',
        alt: 'Wisuda MY BUBUB ',
        category: 'Perayaan',
    },
    {
        id: 24,
        src: '/images/perayaan2.jpeg',
        alt: 'Wisuda MY BUBUB ',
        category: 'Perayaan',
    },
    {
        id: 25,
        src: '/images/beuty.jpeg',
        alt: 'MY BUBUB',
        category: 'Elegant Beauty',
    },
    {
        id: 26,
        src: '/images/beuty2.jpeg',
        alt: 'Cantik Banget Cewe GW',
        category: 'Elegant Beauty',
    },
    {
        id: 27,
        src: '/images/beuty3.jpeg',
        alt: 'Soft beauty ',
        category: 'Elegant Beauty',
    },
    {
        id: 28,
        src: '/images/beuty4.jpeg',
        alt: 'Rare beauty',
        category: 'Elegant Beauty',
    },
    {
        id: 29,
        src: '/images/beuty5.jpeg',
        alt: 'Golden beauty ',
        category: 'Elegant Beauty',
    },
    {
        id: 30,
        src: '/images/beuty6.jpeg',
        alt: 'Queen',
        category: 'Elegant Beauty',
    },
    {
        id: 31,
        src: '/images/beuty7.jpeg',
        alt: 'Pure elegance',
        category: 'Elegant Beauty',
    },
    {
        id: 32,
        src: '/images/beuty8.jpeg',
        alt: 'Gorgeous soul',
        category: 'Elegant Beauty',
    },
    {
        id: 33,
        src: '/images/beuty9.jpeg',
        alt: 'Lovely grace',
        category: 'Elegant Beauty',
    },
    {
        id: 34,
        src: '/images/beuty10.jpeg',
        alt: 'Classy woman',
        category: 'Elegant Beauty',
    },
    {
        id: 35,
        src: '/images/beuty11.jpeg',
        alt: 'Elegant lady',
        category: 'Elegant Beauty',
    },
    {
        id: 36,
        src: '/images/beuty12.jpeg',
        alt: 'Elegant lady',
        category: 'Elegant Beauty',
    },
    {
        id: 37,
        src: '/images/beuty13.jpeg',
        alt: 'Elegant lady',
        category: 'Elegant Beauty',
    },
    {
        id: 38,
        src: '/images/beuty14.jpeg',
        alt: 'Elegant lady',
        category: 'Elegant Beauty',
    },
    {
        id: 39,
        src: '/images/perayaan5.jpeg',
        alt: 'Wisuda My Anggel',
        category: 'Perayaan',
    },
     {
        id: 40,
        src: '/images/kebersamaan13.jpeg',
        alt: 'kakak beradik',
        category: 'Kebersamaan',
    },
     {
        id: 41,
        src: '/images/kebersamaan14.jpeg',
        alt: 'kakak beradik',
        category: 'Kebersamaan',
    },
     {
        id: 42,
        src: '/images/man.jpeg',
        alt: 'kakak Pertama',
        category: 'Elegant Man',
    },
     {
        id: 43,
        src: '/images/man2.jpeg',
        alt: 'kakak Pertama',
        category: 'Elegant Man',
    },
     {
        id: 44,
        src: '/images/man3.jpeg',
        alt: 'Cool gentleman',
        category: 'Elegant Man',
    },
     {
        id: 45,
        src: '/images/man4.jpeg',
        alt: 'Strong soul',
        category: 'Elegant Man',
    },
     {
        id: 46,
        src: '/images/man5.jpeg',
        alt: 'Immortal God',
        category: 'Elegant Man',
    },
     {
        id: 47,
        src: '/images/man6.jpeg',
        alt: 'Royal gentleman',
        category: 'Elegant Man',
    },
     {
        id: 48,
        src: '/images/man7.jpeg',
        alt: 'Melayu Culture',
        category: 'Elegant Man',
    },
     {
        id: 49,
        src: '/images/man8.jpeg',
        alt: 'Melayu Culture',
        category: 'Elegant Man',
    },
     {
        id: 50,
        src: '/images/man9.jpeg',
        alt: 'Golden boy',
        category: 'Elegant Man',
    },
     {
        id: 51,
        src: '/images/man10.jpeg',
        alt: 'Trio Power',
        category: 'Elegant Man',
    }, 
     {
        id: 52,
        src: '/images/anak6.jpeg',
        alt: 'Cute',
        category: 'Kebersamaan',
    }, 
];

const familyValues = [
    {
        icon: <Heart className="w-8 h-8" />,
        title: 'Kasih Sayang',
        description: 'Cinta tanpa syarat yang mengikat setiap anggota keluarga',
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: 'Kebersamaan',
        description: 'Bersatu kita teguh, bercerai kita runtuh',
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: 'Kejujuran',
        description: 'Kejujuran adalah fondasi dari kepercayaan keluarga',
    },
    {
        icon: <HandHeart className="w-8 h-8" />,
        title: 'Ketulusan',
        description:
            'Memberi tanpa mengharapkan imbalan, mencintai tanpa syarat',
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: 'Gotong Royong',
        description: 'Beban ringan jika dipikul bersama',
    },
    {
        icon: <TreePine className="w-8 h-8" />,
        title: 'Kerendahan Hati',
        description: 'Rendah hati dan selalu bersyukur atas setiap berkat',
    },
];

const galleryCategories = [
    'Semua',
    'Kebersamaan',
    'Liburan',
    'Perayaan',
    'Elegant Beauty',
    'Elegant Man',
];

/* ============================================================
   UTILITY COMPONENTS
   ============================================================ */
function AnimatedCounter({
    target,
    suffix = '',
}: {
    target: number;
    suffix?: string;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    useEffect(() => {
        if (!isInView) return;
        const duration = 2000;
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isInView, target]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

function SectionHeading({
    subtitle,
    title,
    description,
    light = false,
}: {
    subtitle: string;
    title: string;
    description: string;
    light?: boolean;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12 lg:mb-16"
        >
            <span className="inline-block text-family-600 font-semibold text-sm tracking-widest uppercase mb-3">
                {subtitle}
            </span>
            <h2
                className={`text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 ${
                    light ? 'text-white' : 'text-stone-900'
                }`}
            >
                {title}
            </h2>
            <p
                className={`text-base lg:text-lg max-w-2xl mx-auto ${
                    light ? 'text-white/70' : 'text-stone-500'
                }`}
            >
                {description}
            </p>
        </motion.div>
    );
}

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50);
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

    // ✅ FUNGSI BARU UNTUK HANDLE KLIK DI HP
    const handleMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault(); // Cegah scroll bawaan browser
        setIsMobileOpen(false); // Tutup dropdown

        // Tunggu animasi dropdown menutup (sekitar 300ms), LALU scroll manual
        setTimeout(() => {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-stone-900/5'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
                    <a
                        href="#"
                        className={`text-xl lg:text-2xl font-bold font-display transition-colors duration-300 ${
                            isScrolled ? 'text-family-700' : 'text-white'
                        }`}
                    >
                       Kamaruddin Family
                    </a>

                    <div className="hidden md:flex items-center gap-8">
                        {links.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className={`text-sm font-medium transition-colors relative group ${
                                    isScrolled
                                        ? 'text-stone-700 hover:text-family-600'
                                        : 'text-white/90 hover:text-white'
                                }`}
                            >
                                {l.label}
                                <span className={`absolute -bottom-0.5 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full ${
                                    isScrolled ? 'bg-family-500' : 'bg-white'
                                }`} />
                            </a>
                        ))}
                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? (
                            <X
                                className={
                                    isScrolled ? 'text-stone-700' : 'text-white'
                                }
                            />
                        ) : (
                            <Menu
                                className={
                                    isScrolled ? 'text-stone-700' : 'text-white'
                                }
                            />
                        )}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }} // ✅ Tambahkan durasi agar jeda 300ms di atas pas
                        className="md:hidden bg-white/95 backdrop-blur-xl border-t border-stone-100"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {links.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    // ✅ GANTI onClick LAMA DENGAN FUNGSI BARU INI
                                    onClick={(e) => handleMobileLinkClick(e, l.href)}
                                    className="block py-3 text-stone-700 hover:text-family-600 font-medium transition-colors"
                                >
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
   HERO
   ============================================================ */
function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section ref={ref} className="relative h-screen overflow-hidden">
            <motion.div style={{ y }} className="absolute inset-0">
                <img
                    src="/images/hero.jpeg"
                    alt="Family Hero"
                    className="w-full h-[100%] object-cover object-center"
                />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/80" />

            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-10 w-2 h-2 bg-family-400 rounded-full animate-float opacity-60" />
                <div className="absolute top-1/3 right-20 w-3 h-3 bg-family-300 rounded-full animate-float-delayed opacity-40" />
                <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-rose-400 rounded-full animate-float opacity-50" />
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-family-200 rounded-full animate-float-delayed opacity-50" />
            </div>

            <motion.div
                style={{ opacity }}
                className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-family-300 font-medium tracking-widest uppercase text-xs mb-8">
                        <Heart className="w-3.5 h-3.5" /> Selamat Datang di
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.5,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-6xl font-bold font-jap text-white mb-4 sm:mb-6 leading-tight px-2"
                >
                    Keluarga{' '}
                    <span className="text-transparent font-jap bg-clip-text bg-gradient-to-r from-family-300 via-family-400 to-family-500">
                        Kamaruddin
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="text-sm sm:text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed mb-8 sm:mb-10 px-6"
                >
                    &ldquo;Keluarga bukanlah sesuatu yang penting. Keluarga
                    adalah segalanya.&rdquo;
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none sm:w-auto px-6 sm:px-0"
                >
                    <a
                        href="#about"
                        className="relative overflow-hidden bg-family-600 hover:bg-family-700 text-white px-8 py-4 sm:py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-2xl hover:shadow-family-600/40 hover:-translate-y-1 active:scale-95 group text-center"
                    >
                        <span className="relative z-10">Mengenal Kami</span>
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 rounded-full" />
                    </a>
                    <a
                        href="#gallery"
                        className="bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/30 hover:border-white/60 text-white px-8 py-4 sm:py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10 active:scale-95 text-center"
                    >
                        Galeri Foto
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="absolute bottom-8"
                >
                    <a
                        href="#stats"
                        className="flex flex-col items-center text-white/50 hover:text-white/80 transition-colors"
                    >
                        <span className="text-[10px] tracking-[0.2em] uppercase mb-2">
                            Gulir ke bawah
                        </span>
                        <ChevronDown className="w-5 h-5 animate-bounce" />
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}

/* ============================================================
   STATS
   ============================================================ */
function Stats() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const stats = [
        {
            icon: <Clock className="w-6 h-6" />,
            value: 28,
            suffix: '+',
            label: 'Tahun Bersama',
        },
        {
            icon: <Users className="w-6 h-6" />,
            value: 7,
            suffix: '',
            label: 'Anggota Keluarga',
        },
        {
            icon: <Heart className="w-6 h-6" />,
            value: 2,
            suffix: '',
            label: 'Generasi',
        },
        {
            icon: <Camera className="w-6 h-6" />,
            value: 999,
            suffix: '+',
            label: 'Kenangan Indah',
        },
    ];

    return (
        <section id="stats" ref={ref} className="relative -mt-16 sm:-mt-20 z-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-stone-900/10 p-6 sm:p-8 md:p-12"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.1 * i, duration: 0.5 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-family-50 text-family-600 mb-3">
                                {stat.icon}
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-stone-900 font-display">
                                {stat.suffix === '+' ? (
                                    <AnimatedCounter
                                        target={stat.value}
                                        suffix={stat.suffix}
                                    />
                                ) : (
                                    <AnimatedCounter target={stat.value} />
                                )}
                            </div>
                            <div className="text-stone-500 text-sm mt-1">
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
   ABOUT
   ============================================================ */
function About() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="about" className="py-16 sm:py-20 lg:py-28 bg-white">
            <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10">
                            <img
                                src="/images/family.jpeg"
                                alt="Keluarga Kamaruddin"
                                className="w-full h-[240px] sm:h-[280px] lg:h-[350px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-family-900/30 to-transparent" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-family-600 text-white rounded-2xl p-5 shadow-xl hidden lg:block">
                            <p className="text-3xl font-bold font-display">
                                28+
                            </p>
                            <p className="text-family-200 text-sm">
                                Tahun Bersama
                            </p>
                        </div>
                        <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-family-200 rounded-2xl hidden lg:block" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="text-family-600 font-semibold text-sm tracking-widest uppercase">
                            Tentang Kami
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-stone-900 mt-3 mb-6">
                            Cerita Keluarga{' '}
                            <span className="text-family-600">Kamaruddin</span>
                        </h2>
                        <p className="text-stone-600 text-base lg:text-lg leading-relaxed mb-6">
                            Terkumpul oleh cinta, diikat oleh kebersamaan.
                            Keluarga Kamaruddin adalah keluarga kecil yang penuh
                            kasih sayang, yang selalu saling mendukung dalam
                            suka maupun duka.
                        </p>
                        <p className="text-stone-600 text-base lg:text-lg leading-relaxed mb-8">
                            Berawal dari pertemuan sederhana yang berubah
                            menjadi cinta sejati, kini keluarga ini telah tumbuh
                            menjadi tempat berteduh yang hangat bagi setiap
                            anggotanya. Kami percaya bahwa kebahagiaan sejati
                            ada di dalam kebersamaan.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {[
                                {
                                    icon: <Heart className="w-5 h-5" />,
                                    text: 'Penuh Kasih Sayang',
                                },
                                {
                                    icon: <Home className="w-5 h-5" />,
                                    text: 'Rumah yang Hangat',
                                },
                                {
                                    icon: <Users className="w-5 h-5" />,
                                    text: 'Saling Mendukung',
                                },
                                {
                                    icon: <Star className="w-5 h-5" />,
                                    text: 'Selalu Bersyukur',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 text-stone-700 group/item cursor-default"
                                >
                                    <span className="text-family-500 group-hover/item:text-family-600 group-hover/item:scale-110 transition-all duration-200">
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-medium group-hover/item:text-family-800 transition-colors duration-200">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <a
                            href="#members"
                            className="relative overflow-hidden inline-flex items-center gap-2 bg-family-600 hover:bg-family-700 text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-2xl hover:shadow-family-600/30 hover:-translate-y-1 active:scale-95 group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Kenali Anggota Kami
                                <ChevronDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 rounded-full" />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ============================================================
   MEMBER MODAL
   ============================================================ */
function MemberModal({
    member,
    onClose,
}: {
    member: FamilyMember | null;
    onClose: () => void;
}) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    if (!member) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 60 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 60 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative h-52 sm:h-64 md:h-72 flex-shrink-0">
                    {/* Drag handle for mobile */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-stone-300 rounded-full z-10 sm:hidden" />
                    <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-5 left-6 right-6">
                        <h3 className="text-2xl font-bold text-white font-display">
                            {member.name}
                        </h3>
                        <p className="text-family-300 font-medium text-sm">
                            {member.role}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/30 hover:bg-black/60 rounded-full p-2 transition-all duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5 sm:p-6 md:p-8 overflow-y-auto flex-1">
                    <p className="text-stone-500 italic text-sm mb-4 border-l-2 border-family-300 pl-4">
                        {member.quote}
                    </p>
                    <p className="text-stone-600 text-sm leading-relaxed mb-5">
                        {member.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {member.hobbies.map((hobby) => (
                            <span
                                key={hobby}
                                className="bg-family-50 hover:bg-family-100 text-family-700 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 cursor-default"
                            >
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
   FAMILY MEMBERS
   ============================================================ */
function FamilyMembers() {
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
        null,
    );
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const roleColors: Record<string, string> = {
        'Kepala Keluarga': 'from-amber-500 to-amber-600',
        Ibu: 'from-rose-400 to-rose-500',
        'Anak Pertama': 'from-blue-400 to-blue-500',
        'Anak Kedua': 'from-purple-400 to-purple-500',
        'Anak Ketiga': 'from-emerald-400 to-emerald-500',
    };

    return (
        <section id="members" className="py-16 sm:py-20 lg:py-28 bg-stone-50 pb-24 md:pb-20">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <SectionHeading
                    subtitle="Anggota Keluarga"
                    title="Keluarga Kami"
                    description="Setiap anggota memiliki cerita dan peran penting dalam menjaga kebersamaan keluarga."
                />

                <div
                    ref={ref}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                >
                    {familyMembers.map((member, i) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                delay: i * 0.1,
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            whileHover={{
                                y: -12,
                                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedMember(member)}
                            className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg shadow-stone-900/5 hover:shadow-2xl hover:shadow-family-900/15 transition-all duration-500 relative"
                        >
                            {/* Shine sweep effect */}
                            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-3xl">
                                <div className="absolute -inset-x-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 group-hover:translate-x-[350%] transition-transform duration-1000 ease-out" />
                            </div>
                            <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                                <img
                                    src={member.photo}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80 transition-all duration-500" />
                                <div className="absolute top-4 right-4">
                                    <span
                                        className={`inline-block bg-gradient-to-r ${
                                            roleColors[member.role] ||
                                            'from-amber-500 to-amber-600'
                                        } text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg`}
                                    >
                                        {member.role}
                                    </span>
                                </div>
                                {/* Hover overlay: view detail prompt */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="bg-white/15 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-white text-sm font-semibold tracking-wide">Lihat Profil</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-5 right-5">
                                    <h3 className="text-xl font-bold text-white font-display group-hover:text-family-200 transition-colors duration-300">
                                        {member.name}
                                    </h3>
                                </div>
                            </div>
                            <div className="p-5">
                                <p className="text-stone-500 text-sm mb-3 line-clamp-2 group-hover:text-stone-700 transition-colors duration-300">
                                    {member.quote}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-stone-400 text-xs">
                                        Lahir {member.birthYear}
                                    </span>
                                    <span className="text-family-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                                        Lihat Detail <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedMember && (
                    <MemberModal
                        member={selectedMember}
                        onClose={() => setSelectedMember(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function Lightbox({
    image,
    onClose,
}: {
    image: GalleryImage | null;
    onClose: () => void;
}) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!image) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.img
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                src={image.src}
                alt={image.alt}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />
            <button
                onClick={onClose}
                className="absolute top-5 right-5 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
            >
                <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                <p className="text-white/80 text-sm font-medium">{image.alt}</p>
                <p className="text-white/50 text-xs">{image.category}</p>
            </div>
        </motion.div>
    );
}

/* ============================================================
   GALLERY
   ============================================================ */
function Gallery() {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(
        null,
    );
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const filtered =
        activeCategory === 'Semua'
            ? galleryImages
            : galleryImages.filter((img) => img.category === activeCategory);

    return (
        <section id="gallery" className="py-16 sm:py-20 lg:py-28 bg-white pb-24 md:pb-20">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <SectionHeading
                    subtitle="Galeri Foto"
                    title="Momen Berharga"
                    description="Kumpulan foto-foto yang menangkap kebahagiaan dan kebersamaan keluarga Kamaruddin."
                />

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8 px-2">
                    {galleryCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 active:scale-95 ${
                                activeCategory === cat
                                    ? 'bg-family-600 text-white shadow-lg shadow-family-600/30 scale-105'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:scale-105 hover:shadow-md'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div
                    ref={ref}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((img, i) => (
                            <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={
                                    isInView ? { opacity: 1, scale: 1 } : {}
                                }
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                whileHover={{
                                    scale: 1.04,
                                    zIndex: 10,
                                    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                                }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelectedImage(img)}
                                className="group cursor-pointer relative overflow-hidden rounded-2xl aspect-square shadow-md hover:shadow-2xl hover:shadow-stone-900/20 transition-shadow duration-300"
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
                                />
                                {/* Multi-layer overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                                <div className="absolute inset-0 bg-family-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                {/* Camera icon center */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="bg-white/20 backdrop-blur-md rounded-full p-3.5 transform scale-75 group-hover:scale-100 transition-transform duration-300 border border-white/30">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                {/* Bottom text */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
                                    <p className="text-white text-sm font-medium line-clamp-1 drop-shadow">
                                        {img.alt}
                                    </p>
                                    <p className="text-white/60 text-xs">
                                        {img.category}
                                    </p>
                                </div>
                                {/* Top-right category badge */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    <span className="bg-black/40 backdrop-blur-sm text-white/90 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                        {img.category}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <Lightbox
                        image={selectedImage}
                        onClose={() => setSelectedImage(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

/* ============================================================
   VALUES
   ============================================================ */
function Values() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section
            id="values"
            className="py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-family-800 via-family-900 to-stone-900 relative overflow-hidden pb-24 md:pb-20"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-family-400 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionHeading
                    subtitle="Nilai-Nilai Kami"
                    title="Pondasi Keluarga"
                    description="Nilai-nilai luhur yang menjadi pedoman setiap langkah keluarga Kamaruddin."
                    light
                />

                <div
                    ref={ref}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {familyValues.map((value, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                delay: i * 0.1,
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                            }}
                            className="bg-white/5 hover:bg-white/12 backdrop-blur-md border border-white/10 hover:border-family-400/50 rounded-2xl p-7 transition-all duration-500 group relative overflow-hidden cursor-default"
                        >
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-family-400/20 to-transparent" />
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-family-500/20 text-family-400 flex items-center justify-center mb-5 group-hover:bg-family-400/30 group-hover:text-family-300 group-hover:scale-110 transition-all duration-300 relative">
                                <div className="absolute inset-0 rounded-xl bg-family-400/10 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-0 transition-all duration-500" />
                                {value.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white font-display mb-2 group-hover:text-family-200 transition-colors duration-300 relative">
                                {value.title}
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300 relative">
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
   TIMELINE
   ============================================================ */
function Timeline() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="timeline" className="py-16 sm:py-20 lg:py-28 bg-stone-50 pb-24 md:pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    subtitle="Perjalanan Kami"
                    title="Timeline Keluarga"
                    description="Momen-momen penting yang membentuk keluarga Kamaruddin menjadi seperti sekarang."
                />

                <div ref={ref} className="relative">
                    {/* Vertical line - always on left on mobile */}
                    <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-family-300 via-family-400 to-family-200 md:-translate-x-0.5 opacity-50" />

                    <div className="space-y-8 sm:space-y-10">
                        {timelineEvents.map((event, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{
                                        opacity: 0,
                                        x: -30,
                                    }}
                                    animate={
                                        isInView ? { opacity: 1, x: 0 } : {}
                                    }
                                    transition={{
                                        delay: i * 0.1,
                                        duration: 0.6,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className={`relative flex items-start gap-6 md:gap-0 ${
                                        isLeft
                                            ? 'md:flex-row'
                                            : 'md:flex-row-reverse'
                                    }`}
                                >
                                    {/* Dot */}
                                    <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-10 group/dot">
                                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white border-4 border-family-500 rounded-full flex items-center justify-center text-family-600 shadow-md hover:shadow-family-500/40 hover:shadow-lg hover:border-family-400 hover:scale-110 transition-all duration-300 cursor-default">
                                            {event.icon}
                                            <div className="absolute inset-0 rounded-full border-4 border-family-400/50 scale-125 opacity-0 hover:opacity-100 hover:scale-150 transition-all duration-500" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div
                                        className={`ml-16 sm:ml-20 md:ml-0 md:w-[calc(50%-40px)] w-full ${
                                            isLeft
                                                ? 'md:pr-0 md:text-right'
                                                : 'md:pl-0 md:text-left'
                                        }`}
                                    >
                                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-stone-900/5 hover:shadow-2xl hover:shadow-family-500/10 transition-all duration-400 group/card border border-transparent hover:border-family-100">
                                            <span className="inline-block text-family-600 font-bold text-sm mb-1 group-hover/card:text-family-500 transition-colors">
                                                {event.year}
                                            </span>
                                            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display mb-1 group-hover/card:text-family-800 transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-stone-500 text-sm leading-relaxed">
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
   FAMILY QUOTE
   ============================================================ */
function FamilyQuote() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute top-10 left-10 text-[300px] font-display font-bold text-stone-900 leading-none select-none">
                    &ldquo;
                </div>
            </div>
            <div
                ref={ref}
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Quote className="w-12 h-12 text-family-300 mx-auto mb-8" />
                    <blockquote className="text-xl sm:text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-stone-800 leading-relaxed mb-8">
                        Rumah bukanlah sebuah tempat, rumah adalah{' '}
                        <span className="text-family-600">perasaan</span>. Dan
                        perasaan itu ada ketika kita bersama{' '}
                        <span className="text-family-600">keluarga</span>.
                    </blockquote>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-0.5 bg-family-400 rounded-full" />
                        <span className="text-stone-500 font-medium text-sm">
                            Keluarga Kamaruddin
                        </span>
                        <div className="w-12 h-0.5 bg-family-400 rounded-full" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
    return (
        <footer className="bg-stone-900 text-white pt-14 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
                    <div>
                        <h3 className="text-2xl font-bold font-display mb-4">
                            Kamaruddin Family
                        </h3>
                        <p className="text-stone-400 text-sm leading-relaxed">
                            Keluarga kecil yang penuh kasih sayang, selalu
                            saling mendukung dan mengasihi dalam setiap langkah
                            kehidupan.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold tracking-widest uppercase text-family-400 mb-4">
                            Navigasi
                        </h4>
                        <div className="space-y-2">
                            {[
                                { href: '#about', label: 'Tentang Kami' },
                                { href: '#members', label: 'Anggota Keluarga' },
                                { href: '#gallery', label: 'Galeri Foto' },
                                { href: '#values', label: 'Nilai-Nilai' },
                                { href: '#timeline', label: 'Timeline' },
                            ].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="block text-stone-400 hover:text-family-400 hover:translate-x-1.5 text-sm transition-all duration-200"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold tracking-widest uppercase text-family-400 mb-4">
                            Kontak
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-stone-400 text-sm">
                                <MapPin className="w-4 h-4 text-family-500 shrink-0" />
                                <span>
                                    Jl. Kampung Bagan No. 73, Batam
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-stone-400 text-sm">
                                <Phone className="w-4 h-4 text-family-500 shrink-0" />
                                <span>+62----------</span>
                            </div>
                            <div className="flex items-center gap-3 text-stone-400 text-sm">
                                <Mail className="w-4 h-4 text-family-500 shrink-0" />
                                <span>keluarga@kamaruddin.id</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-stone-500 text-xs">
                        © {new Date().getFullYear()} Keluarga Kamaruddin. Dibuat
                        dengan{' '}
                        <Heart className="w-3 h-3 inline text-rose-500 fill-rose-500" />{' '}
                        dan kebersamaan.
                    </p>
                    <p className="text-stone-600 text-xs">
                        Rumah adalah di mana hati merasa nyaman 🏡
                    </p>
                </div>
            </div>
        </footer>
    );
}

/* ============================================================
   SCROLL TO TOP
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
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 bg-family-600 hover:bg-family-500 text-white w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-xl shadow-family-600/40 flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:shadow-family-500/50"
                >
                    <ArrowUp className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

    return (
        <motion.div
            style={{ scaleX, transformOrigin: 'left' }}
            className="fixed top-0 left-0 right-0 h-1 z-[60] bg-gradient-to-r from-family-400 via-family-500 to-rose-400"
        />
    );
}

/* ============================================================
   TOUCH RIPPLE OVERLAY
   ============================================================ */
interface Ripple {
    id: number;
    x: number;
    y: number;
}

function TouchRippleOverlay() {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    useEffect(() => {
        const handleTouch = (e: TouchEvent) => {
            const touch = e.touches[0];
            const newRipple: Ripple = {
                id: Date.now(),
                x: touch.clientX,
                y: touch.clientY,
            };
            setRipples(prev => [...prev.slice(-4), newRipple]);
            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== newRipple.id));
            }, 800);
        };
        window.addEventListener('touchstart', handleTouch, { passive: true });
        return () => window.removeEventListener('touchstart', handleTouch);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[55]">
            <AnimatePresence>
                {ripples.map(ripple => (
                    <motion.div
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 4, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        style={{
                            position: 'fixed',
                            left: ripple.x - 30,
                            top: ripple.y - 30,
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(180,130,90,0.35) 0%, transparent 70%)',
                            border: '1.5px solid rgba(180,130,90,0.25)',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}


/* ============================================================
   MOBILE BOTTOM NAV
   ============================================================ */
function MobileBottomNav() {
    const links = [
        { href: '#about', label: 'Tentang', icon: <Home className="w-5 h-5" /> },
        { href: '#members', label: 'Anggota', icon: <Users className="w-5 h-5" /> },
        { href: '#gallery', label: 'Galeri', icon: <Camera className="w-5 h-5" /> },
        { href: '#values', label: 'Nilai', icon: <Heart className="w-5 h-5" /> },
        { href: '#timeline', label: 'Timeline', icon: <Star className="w-5 h-5" /> },
    ];

    const [active, setActive] = useState('');

    useEffect(() => {
        const sections = links.map(l => document.querySelector(l.href));
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActive('#' + entry.target.id);
                    }
                });
            },
            { threshold: 0.4 }
        );
        sections.forEach(s => s && observer.observe(s));
        return () => observer.disconnect();
    }, []);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="bg-white/90 backdrop-blur-xl border-t border-stone-100 shadow-2xl shadow-stone-900/20 px-2 pb-safe">
                <div className="flex items-center justify-around py-2">
                    {links.map(link => {
                        const isActive = active === link.href;
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-90"
                                onClick={() => setActive(link.href)}
                            >
                                <motion.span
                                    animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    className={`transition-colors duration-200 ${isActive ? 'text-family-600' : 'text-stone-400'}`}
                                >
                                    {link.icon}
                                </motion.span>
                                <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-family-600' : 'text-stone-400'}`}>
                                    {link.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute -top-0.5 w-6 h-0.5 bg-family-500 rounded-full"
                                    />
                                )}
                            </a>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
    return (
        <div className="min-h-screen bg-stone-50 overflow-x-hidden">
            <ScrollProgressBar />
            <TouchRippleOverlay />
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
            <MobileBottomNav />
            <ScrollToTop />
        </div>
    );
}