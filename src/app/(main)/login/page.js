'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { 
  Mail, 
  Lock, 
  Chrome, 
  ArrowLeft, 
  User, 
  ArrowRight, 
  Sparkles, 
  Phone,
  CheckCircle2,
  AtSign,
  Check,
  ChevronDown 
} from 'lucide-react';

const globalCountryCodes = [
  { name: 'Afghanistan', code: '+93' },
  { name: 'Argentina', code: '+54' },
  { name: 'Australia', code: '+61' },
  { name: 'Bangladesh', code: '+880' },
  { name: 'Brazil', code: '+55' },
  { name: 'Canada', code: '+1' },
  { name: 'China', code: '+86' },
  { name: 'Egypt', code: '+20' },
  { name: 'France', code: '+33' },
  { name: 'Germany', code: '+49' },
  { name: 'Indonesia', code: '+62' },
  { name: 'Italy', code: '+39' },
  { name: 'Japan', code: '+81' },
  { name: 'Kenya', code: '+254' },
  { name: 'Mexico', code: '+52' },
  { name: 'Nepal', code: '+977' },
  { name: 'Netherlands', code: '+31' },
  { name: 'New Zealand', code: '+64' },
  { name: 'Nigeria', code: '+234' },
  { name: 'Pakistan', code: '+92' },
  { name: 'Russia', code: '+7' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'Singapore', code: '+65' },
  { name: 'South Africa', code: '+27' },
  { name: 'South Korea', code: '+82' },
  { name: 'Spain', code: '+34' },
  { name: 'Sri Lanka', code: '+94' },
  { name: 'United Arab Emirates', code: '+971' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United States', code: '+1' }
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); 
  const [loginType, setLoginType] = useState('user'); 
  
  // Form States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [otp, setOtp] = useState('');
  
  // Verification & UI States
  const [showOtp, setShowOtp] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  
  const [feedback, setFeedback] = useState('');

  const handleVerifyPhone = () => {
    if (!phone.trim() || phone.length < 5) {
      setFeedback('Please enter a valid mobile number first.');
      return;
    }
    setShowOtp(true);
    setFeedback(`OTP sent to ${countryCode} ${phone}. (Use 1234)`);
  };

  const handleConfirmOtp = () => {
    if (otp === '1234') {
      setIsPhoneVerified(true);
      setShowOtp(false);
      setFeedback('Mobile number verified successfully!');
    } else {
      setFeedback('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback('');

    if (mode === 'login') {
      if (loginType === 'admin') {
        if (username.trim().toLowerCase() === 'admin' && password === 'eus123') {
          setFeedback('Admin Login successful. Redirecting...');
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 700);
        } else {
          setFeedback('Invalid admin username or password.');
        }
      } else {
        if (username.trim() && password.trim()) {
          setFeedback('User Login successful. Redirecting...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 700);
        } else {
          setFeedback('Please enter your username and password.');
        }
      }
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim() || !phone.trim()) {
        setFeedback('Complete all fields to register.');
        return;
      }
      if (!isPhoneVerified) {
        setFeedback('You must verify your mobile number to create an account.');
        return;
      }
      setFeedback(`Registration successful. Welcome ${username}!`);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#FDFDFD] selection:bg-amber-500 selection:text-white font-sans text-slate-900">
      
      {/* LEFT SECTION (IMAGE & BRANDING) */}
      <section className="hidden lg:flex relative min-h-screen bg-slate-950 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="Luxury Architecture"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        
        {/* Subtle animated blurs */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4 animate-[spin_20s_linear_infinite]" />

        <div className="relative z-10 flex flex-col justify-end p-20 pb-28">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest shadow-lg">
              <Sparkles size={14} />
              <span>Exclusive Access</span>
            </div>
            <h2 className="text-6xl font-black text-white leading-[1.1] mt-5 tracking-tight">
              {mode === 'login' ? 'Welcome back to the elite.' : 'Join the future of real estate.'}
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed font-light max-w-xl mt-4">
              Enterprise-grade portfolio management with advanced luxury listing analytics and secure access.
            </p>
          </Reveal>
        </div>
      </section>

      {/* RIGHT SECTION (FORM) */}
      <section className="flex flex-col relative px-6 py-12 md:px-16 lg:px-24 justify-center bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="w-full max-w-xl mx-auto relative z-10">
          
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-amber-600 transition-colors duration-300 group tracking-wide text-sm"
            >
              <div className="p-2 rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-amber-200 transition-colors">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              Back to Home
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.05)] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            
            {/* Top Decorative Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-amber-500 rounded-b-full"></div>

            <Reveal key={mode}>
              <div className="mb-10 mt-2">
                <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-3 tracking-tight">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-slate-500 font-light text-base md:text-lg">
                  {mode === 'login'
                    ? 'Access your customized real estate dashboard.'
                    : 'Create a secure enterprise account to continue.'}
                </p>
              </div>
            </Reveal>

            {mode === 'login' && (
              <Reveal delay={0.05}>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setLoginType('user'); setFeedback(''); }}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                      loginType === 'user' 
                        ? 'bg-white shadow-sm text-slate-900 border border-slate-200' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    User Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginType('admin'); setFeedback(''); }}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                      loginType === 'admin' 
                        ? 'bg-white shadow-sm text-slate-900 border border-slate-200' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Admin Login
                  </button>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.1}>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] mb-8 cursor-pointer shadow-sm hover:shadow-md"
              >
                <Chrome size={20} className="text-red-500" />
                Continue with Google
              </button>
            </Reveal>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <span className="relative px-6 bg-white text-xs text-slate-400 font-bold uppercase tracking-widest block w-fit mx-auto">
                Or use credentials
              </span>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {mode === 'register' && (
                <Reveal delay={0.1}>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                        Full Name
                      </label>
                      <div className="relative group/input">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-amber-500 transition-colors" size={18} />
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          type="text"
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                        Username
                      </label>
                      <div className="relative group/input">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-amber-500 transition-colors" size={18} />
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          type="text"
                          placeholder="johndoe99"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all font-medium text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}

              {mode === 'login' && (
                <Reveal delay={0.1}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                      {loginType === 'admin' ? 'Admin Username' : 'Username'}
                    </label>
                    <div className="relative group/input">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-amber-500 transition-colors" size={18} />
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder={loginType === 'admin' ? 'admin' : 'your_username'}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                </Reveal>
              )}

              {mode === 'register' && (
                <Reveal delay={0.2}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-amber-500 transition-colors" size={18} />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="abc@xyz.com"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all font-medium text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3 ml-2 pt-1">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="newsletter"
                          checked={receiveUpdates}
                          onChange={(e) => setReceiveUpdates(e.target.checked)}
                          className="peer w-5 h-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 checked:border-amber-500 checked:bg-amber-500 transition-all"
                        />
                        <Check size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                      </div>
                      <label htmlFor="newsletter" className="text-sm font-semibold text-slate-600 cursor-pointer select-none">
                        Receive latest updates on email
                      </label>
                    </div>
                  </div>
                </Reveal>
              )}

              {mode === 'register' && (
                <Reveal delay={0.3}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                      Mobile Number
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex flex-1 gap-2">
                        
                        {/* CUSTOM DROPDOWN UI */}
                        <div className="relative w-[100px] shrink-0">
                          <button
                            type="button"
                            disabled={isPhoneVerified}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full h-full flex items-center justify-between px-3 py-4 bg-slate-50 border rounded-2xl outline-none transition-all font-bold text-slate-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                              isDropdownOpen ? 'border-amber-500 bg-white ring-2 ring-amber-500/20' : 'border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white'
                            }`}
                          >
                            <span className="tracking-wide text-sm">{countryCode}</span>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-amber-500' : ''}`} />
                          </button>

                          {isDropdownOpen && !isPhoneVerified && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setIsDropdownOpen(false)} 
                              />
                              <div className="absolute top-[calc(100%+8px)] left-0 w-[240px] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.15)] rounded-2xl overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-2">
                                <div className="max-h-[260px] overflow-y-auto">
                                  <button
                                    type="button"
                                    onClick={() => { setCountryCode('+91'); setIsDropdownOpen(false); }}
                                    className={`w-full text-left px-5 py-3 text-sm font-semibold transition-colors hover:bg-slate-50 flex justify-between items-center ${
                                      countryCode === '+91' ? 'text-amber-600 bg-amber-50/50' : 'text-slate-700'
                                    }`}
                                  >
                                    <span>India</span>
                                    <span className={`${countryCode === '+91' ? 'text-amber-600' : 'text-slate-400'}`}>+91</span>
                                  </button>
                                  
                                  <div className="h-px bg-slate-100 my-1 mx-4" />
                                  
                                  {globalCountryCodes.map((country) => (
                                    <button
                                      key={country.name}
                                      type="button"
                                      onClick={() => { setCountryCode(country.code); setIsDropdownOpen(false); }}
                                      className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors hover:bg-slate-50 flex justify-between items-center ${
                                        countryCode === country.code ? 'text-amber-600 bg-amber-50/50 font-semibold' : 'text-slate-600'
                                      }`}
                                    >
                                      <span className="truncate pr-3">{country.name}</span>
                                      <span className={`shrink-0 ${countryCode === country.code ? 'text-amber-600' : 'text-slate-400'}`}>
                                        {country.code}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* Phone Input */}
                        <div className="relative flex-1 group/input">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-amber-500 transition-colors" size={18} />
                          <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isPhoneVerified}
                            type="tel"
                            placeholder="555-0000"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all disabled:opacity-60 font-medium text-sm"
                          />
                        </div>
                      </div>

                      {!isPhoneVerified ? (
                        <button
                          type="button"
                          onClick={handleVerifyPhone}
                          className="px-6 py-4 sm:py-0 bg-slate-950 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0 border border-slate-800"
                        >
                          Verify
                        </button>
                      ) : (
                        <div className="px-5 py-4 sm:py-0 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded-2xl shrink-0">
                          <CheckCircle2 size={18} />
                          Verified
                        </div>
                      )}
                    </div>
                    
                    {showOtp && !isPhoneVerified && (
                      <div className="flex gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 4-digit OTP"
                          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-center tracking-widest font-bold text-slate-900"
                          maxLength={4}
                        />
                        <button
                          type="button"
                          onClick={handleConfirmOtp}
                          className="px-6 bg-slate-950 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                  </div>
                </Reveal>
              )}

              {/* Password */}
              <Reveal delay={mode === 'register' ? 0.4 : 0.2}>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-amber-500 transition-colors" size={18} />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all font-medium text-sm"
                    />
                  </div>
                  
                  {mode === 'login' && (
                    <div className="text-right pt-1">
                      <Link href="#" className="text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline transition-all cursor-pointer">
                        Forgot Password?
                      </Link>
                    </div>
                  )}
                </div>
              </Reveal>

              {feedback && (
                <div
                  className={`text-sm font-semibold p-3 rounded-lg ${
                    feedback.includes('successful') || feedback.includes('Verified') || feedback.includes('Welcome')
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : feedback.includes('OTP') && !feedback.includes('Invalid')
                      ? 'bg-slate-50 text-slate-700 border border-slate-200'
                      : 'bg-red-50 text-red-600 border border-red-100'
                  } text-center mt-2`}
                >
                  {feedback}
                </div>
              )}

              {/* PRIMARY BUTTON: "Building Rise" Animation */}
              <Reveal delay={mode === 'register' ? 0.5 : 0.3}>
                <button
                  type="submit"
                  className="relative overflow-hidden w-full bg-slate-950 text-white font-bold py-5 rounded-2xl group shadow-xl tracking-wide text-center border border-slate-800 mt-2 cursor-pointer"
                >
                  <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-slate-950 transition-colors duration-300">
                    {mode === 'login' 
                      ? (loginType === 'admin' ? 'Sign In as Admin' : 'Sign In') 
                      : 'Create Account'}
                    <ArrowRight size={20} className="text-amber-400 group-hover:text-slate-950 transition-colors" />
                  </span>
                </button>
              </Reveal>
            </form>

            <Reveal delay={mode === 'register' ? 0.6 : 0.4}>
              <div className="mt-10 pt-8 border-t border-slate-100 text-center space-y-4">
                <p className="text-slate-500 font-light">
                  {mode === 'login' ? 'New to EUS Realty?' : 'Already have an account?'}
                  <br />
                  <button
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setFeedback('');
                      setOtp('');
                      setShowOtp(false);
                      setPassword('');
                      setIsDropdownOpen(false); 
                    }}
                    className="text-amber-600 font-bold hover:text-amber-700 hover:underline transition-all mt-1.5 cursor-pointer tracking-wide"
                  >
                    {mode === 'login' ? 'Register Now' : 'Login to Account'}
                  </button>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}