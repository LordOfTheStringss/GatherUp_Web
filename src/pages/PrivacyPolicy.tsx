import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { CalendarDays, ArrowLeft, Sun, Moon } from 'lucide-react';

export default function PrivacyPolicy() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#12121A] text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30 transition-colors duration-300">

      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-[#1A1A24]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => { navigate('/'); window.scrollTo(0, 0); }} className="flex items-center gap-3 group bg-transparent border-none cursor-pointer p-0">
            <CalendarDays className="w-8 h-8 text-purple-600 dark:text-purple-500" />
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">GatherUp</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-700/50 mb-6 font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            LEGAL
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.1]">
            Privacy Policy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">&amp; KVKK</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Last updated: April 2, 2026
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">

          {/* Intro */}
          <section className="bg-gray-50/80 dark:bg-[#1A1A24] border border-gray-100 dark:border-gray-800/80 rounded-2xl p-8">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              GatherUp ("we", "us", or "our") is committed to protecting your privacy and personal data. This Privacy Policy outlines how we collect, use, store, and protect your information when you use our mobile application and related services. By using GatherUp, you agree to the practices described in this policy.
            </p>
          </section>

          {/* Section 1 — Data Collection */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg shrink-0">
                1
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold">
                Data Collection <span className="text-gray-400 dark:text-gray-500 font-normal text-lg"></span>
              </h2>
            </div>
            <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                When you register for and use GatherUp, we may collect the following categories of personal data:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2">
                <li><strong className="text-gray-800 dark:text-gray-200">Identity Information:</strong> Full name, university email address, profile photo, and student status.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Contact Information:</strong> Email address used for account registration and communications.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Usage Data:</strong> Event creation history, participation records, app interactions, and feature usage analytics.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Device Information:</strong> Device type, operating system, unique device identifiers, and push notification tokens.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Location Data:</strong> Approximate location data used solely for displaying nearby events on the map feature (only when permission is granted).</li>
              </ul>
            </div>
          </section>

          {/* Section 2 — Usage of Information */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shrink-0">
                2
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold">
                Usage of Information <span className="text-gray-400 dark:text-gray-500 font-normal text-lg"></span>
              </h2>
            </div>
            <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                We process your personal data for the following purposes:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2">
                <li>To create and manage your user account and authenticate your identity.</li>
                <li>To enable event creation, discovery, and participation within your community.</li>
                <li>To display relevant events and gatherings on the interactive map near your location.</li>
                <li>To send push notifications about events, updates, and community activity you've subscribed to.</li>
                <li>To maintain platform safety through content moderation and abuse prevention.</li>
                <li>To improve and optimize our services through aggregated, anonymized analytics.</li>
                <li>To comply with legal obligations under applicable data protection legislation.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 — KVKK / GDPR Rights */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold text-lg shrink-0">
                3
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold">
                KVKK / GDPR Rights <span className="text-gray-400 dark:text-gray-500 font-normal text-lg"></span>
              </h2>
            </div>
            <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Under the Turkish Personal Data Protection Law (KVKK, Law No. 6698) and the EU General Data Protection Regulation (GDPR), you are entitled to the following rights:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2">
                <li><strong className="text-gray-800 dark:text-gray-200">Right of Access:</strong> You may request information about whether your personal data is being processed and, if so, request access to it.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Right of Rectification:</strong> You may request the correction of inaccurate or incomplete personal data.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Right of Erasure:</strong> You may request the deletion or destruction of your personal data under the conditions specified by law.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Right to Restrict Processing:</strong> You may request the restriction of processing of your personal data in certain circumstances.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Right to Data Portability:</strong> You may request to receive your personal data in a structured, commonly used, and machine-readable format.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Right to Object:</strong> You may object to the processing of your personal data in certain circumstances, including processing for direct marketing purposes.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Right to Lodge a Complaint:</strong> You may lodge a complaint with the Turkish Personal Data Protection Authority (KVKK Kurumu) or a relevant EU supervisory authority.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 — Contact */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg shrink-0">
                4
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold">
                Contact Us
              </h2>
            </div>
            <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                If you have any questions about this Privacy Policy, wish to exercise your KVKK/GDPR rights, or need to report a data-related concern, please contact us:
              </p>
              <div className="bg-gray-50/80 dark:bg-[#15151E] border border-gray-100 dark:border-gray-800/80 rounded-xl p-6 space-y-3">
                <p><strong className="text-gray-800 dark:text-gray-200">Email:</strong> privacy@gatherup.app</p>
                <p><strong className="text-gray-800 dark:text-gray-200">Address:</strong> GatherUp Headquarters, Ankara, Turkey</p>
                <p><strong className="text-gray-800 dark:text-gray-200">Data Controller:</strong> GatherUp Technology Ltd.</p>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                We aim to respond to all legitimate requests within 30 days. In certain cases, we may ask you to verify your identity before fulfilling your request.
              </p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} GatherUp. All rights reserved.</p>
          <button onClick={() => { navigate('/'); window.scrollTo(0, 0); }} className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors bg-transparent border-none cursor-pointer p-0">
            Back to Home
          </button>
        </div>
      </footer>
    </div>
  );
}
