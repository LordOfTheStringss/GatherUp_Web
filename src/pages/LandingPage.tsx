import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import {
  Calendar, Map, Shield, ChevronRight, ChevronLeft, ArrowRight,
  Twitter, Instagram, Linkedin, CalendarDays, Sun, Moon, Loader2, ImageOff
} from 'lucide-react';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  const mockupScreens = [
    { id: 0, src: '/images/screen1.png', alt: 'Smart Calendar / Schedule Screen' },
    { id: 1, src: '/images/screen2.png', alt: 'OCR Schedule Flow Screen' },
    { id: 2, src: '/images/screen3.png', alt: 'Community / Social Activity Screen' },
    { id: 3, src: '/images/screen4.png', alt: 'Live Map Screen' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Auto-swiping carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % mockupScreens.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(timer);
  }, [mockupScreens.length]);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % mockupScreens.length);
  const prevSlide = () => setCurrentSlide((p) => (p === 0 ? mockupScreens.length - 1 : p - 1));

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#12121A] text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30 transition-colors duration-300">

      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-[#1A1A24]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-8 h-8 text-purple-600 dark:text-purple-500" />
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">GatherUp</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer bg-transparent border-none">Features</button>
              <button onClick={() => document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer bg-transparent border-none">Community</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all shadow-lg shadow-purple-500/25 hidden sm:block whitespace-nowrap"
            >
              Admin Login
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              to="/login"
              className="p-2 sm:hidden text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded-full"
              aria-label="Admin Login"
            >
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 px-6">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-blue-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-700/50 mb-8 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              IT STARTS IN YOUR COMMUNITY
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Discover incredible events around you. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Stop waiting, Start creating.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
              Connect with people who share your passions, anywhere. Create gatherings, explore local events, and build meaningful connections in your city.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl hover:bg-purple-700 transition-transform active:scale-95 font-semibold text-lg shadow-xl shadow-purple-500/25 group"
              >
                Learn More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Phone Mockup Area with Carousel */}
          <div className="relative w-full max-w-[320px] aspect-[10/19] mx-auto z-10 lg:ml-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-[3rem] shadow-2xl flex items-center justify-center border-[8px] border-gray-900 dark:border-black/50 p-2 group">

              <div className="bg-gray-900 dark:bg-black w-full h-full rounded-[2.2rem] relative overflow-hidden flex items-center justify-center">
                {/* iPhone Notch */}
                <div className="absolute top-2 inset-x-0 h-6 bg-black rounded-b-3xl w-1/3 mx-auto z-20" />

                {/* Image Track */}
                <div
                  className="flex w-full h-full transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {mockupScreens.map((screen) => (
                    <div key={screen.id} className="w-full h-full shrink-0 relative flex flex-col items-center justify-center border-r border-gray-900 dark:border-black">
                      {imageErrors[screen.id] ? (
                        <div className="flex flex-col items-center justify-center text-center p-6 text-gray-500 dark:text-gray-400 gap-4">
                          <ImageOff className="w-12 h-12 text-gray-600 dark:text-gray-500 opacity-50" />
                          <div className="text-sm font-semibold max-w-[200px]">
                            Image failed to load
                            <p className="text-xs mt-1 text-gray-600 opacity-70">({screen.src})</p>
                          </div>

                          {/* Fallback spinner to show intentionality */}
                          <Loader2 className="w-5 h-5 animate-spin mt-2 opacity-30" />
                        </div>
                      ) : (
                        <img
                          src={screen.src}
                          alt={screen.alt}
                          onError={() => handleImageError(screen.id)}
                          className="w-full h-full object-contain scale-90 rounded-[2.1rem]"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Left/Right Arrows overlay */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 scale-90 hover:scale-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 scale-90 hover:scale-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                  {mockupScreens.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx
                        ? 'w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Decorative float elements */}
            <div className="absolute -right-8 top-1/4 w-20 h-20 bg-white dark:bg-[#1A1A24] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center animate-bounce duration-3000 delay-100">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <div className="absolute -left-6 bottom-1/4 w-16 h-16 bg-white dark:bg-[#1A1A24] rounded-full shadow-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center animate-bounce duration-3000 delay-300">
              <Map className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50/50 dark:bg-[#15151E]" id="features-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Why GatherUp?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to discover, create, and join events in your community — all in one app.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#1A1A24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-lg shadow-gray-100/50 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Calendar</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Keep track of your events, group activities, and meetups in real time. Never miss a gathering again.</p>
            </div>

            <div className="bg-white dark:bg-[#1A1A24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-lg shadow-gray-100/50 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Live Map</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">See popular spots, ongoing events, and friendly gatherings around you — live on the interactive map.</p>
            </div>

            <div className="bg-white dark:bg-[#1A1A24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-lg shadow-gray-100/50 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Safe Community</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Interact with verified members in a trusted environment. Enjoy the best of social life with complete peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10" id="download-section">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-purple-700 to-indigo-800 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Your city is waiting.</h2>
          <p className="text-purple-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
            The best gatherings happen off-screen. Download GatherUp today and step out into the real world.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <a
              href="#"
              className="flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3.5 rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-xl"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] font-medium opacity-70 uppercase tracking-wider">Download on the</div>
                <div className="text-base font-bold -mt-0.5">App Store</div>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3.5 rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-xl"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.48c.26.14.57.17.86.06l11.31-5.52-3.1-3.1-9.07 8.56zm-.54-1.3V1.81L12.6 11.73l-2.42 2.42-7.54 8.03zm18.53-9.89c.49-.28.79-.8.79-1.35 0-.55-.3-1.07-.79-1.35l-3.77-2.07-3.41 3.41 3.41 3.41 3.77-2.05zM4.18.48L15.3 5.88l-3.09 3.09L3.64.42c.16-.05.34-.03.54.06z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] font-medium opacity-70 uppercase tracking-wider">Get it on</div>
                <div className="text-base font-bold -mt-0.5">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#12121A] border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <CalendarDays className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">GatherUp</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              The smartest, most reliable socialization platform built for everyone. Discover events, meet people, and build your community.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A24] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A24] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A24] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Pages</h4>
            <ul className="space-y-4">
              <li><button onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors bg-transparent border-none cursor-pointer p-0">Features</button></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal & Action */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
            <ul className="space-y-4 mb-8">
              <li><Link to="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            </ul>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group">
              Admin Login
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-gray-500 dark:text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} GatherUp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
