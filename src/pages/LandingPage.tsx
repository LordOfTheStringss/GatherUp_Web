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

            {/* Added Community Link */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Features</a>
              <a href="#community" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Community</a>
            </div>
          </div>

          <div className="flex items-center gap-4">

            {/* Admin Login Button (Between Community and Search) */}
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all shadow-lg shadow-purple-500/25 hidden sm:block whitespace-nowrap"
            >
              Admin Login
            </Link>

            {/* Search Bar placeholder */}
            <div className="hidden lg:flex items-center relative mr-2">
              <input type="text" placeholder="Search..." className="pl-4 pr-4 py-2 bg-gray-100 dark:bg-gray-800/50 border-transparent text-gray-900 dark:text-white rounded-full text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none w-48 transition-all" />
            </div>

            {/* Dark Mode Toggle */}
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
              IT STARTS ON YOUR CAMPUS
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Don't wait for the right time to socialize. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Create it.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
              Discover events on your campus, create your own gatherings, and easily connect with students who share your interests.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="flex items-center justify-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl hover:bg-purple-700 transition-transform active:scale-95 font-semibold text-lg shadow-xl shadow-purple-500/25 group">
                Join the Community
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="flex items-center justify-center gap-3 bg-white dark:bg-[#1A1A24] text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-800 px-8 py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-transform active:scale-95 font-semibold text-lg group">
                Learn More
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
      <section className="py-24 bg-gray-50/50 dark:bg-[#15151E]" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Why GatherUp?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to live out your college experience to the fullest, in one app.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#1A1A24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-lg shadow-gray-100/50 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Calendar</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Keep track of your classes, club activities, and meetups in real time. Never miss an event again.</p>
            </div>

            <div className="bg-white dark:bg-[#1A1A24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-lg shadow-gray-100/50 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Live Map</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">See popular campus locations, ongoing events, and friendly gatherings live on the campus map.</p>
            </div>

            <div className="bg-white dark:bg-[#1A1A24] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-lg shadow-gray-100/50 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Safe Community</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Interact exclusively with verified university students. Enjoy the best of social life with peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10" id="cta">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-purple-700 to-indigo-800 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Ready to join your campus?</h2>
          <p className="text-purple-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
            Learn more about how GatherUp brings students together and helps you explore your university experience.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button className="bg-white text-purple-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 hover:-translate-y-1 transition-transform shadow-xl">
              Join the Community
            </button>
            <button className="bg-purple-800/50 backdrop-blur text-white border border-purple-400/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-800/70 hover:-translate-y-1 transition-transform">
              Learn More
            </button>
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
              The smartest, most reliable socialization platform built specifically for students. Elevate your college experience with us.
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
              <li><a href="#features" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#cta" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">How it Works</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal & Action */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
            <ul className="space-y-4 mb-8">
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Terms of Service</a></li>
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
