import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const PeekingCharacter = ({ focusedField, isTyping, loginStatus }) => {
  const isSuccess = loginStatus === "success";
  const isError = loginStatus === "error";

  // Force eyes to open fully overriding password cover if there is a status
  const isEmail = focusedField === "email" && !isSuccess && !isError;
  const isPwd = focusedField === "password" && !isSuccess && !isError;

  // Head slight look right & tilt
  const headRotate = isEmail ? 8 : (isError ? -6 : 0);
  const headTranslateX = isEmail ? 6 : (isError ? -2 : 0);
  
  // Eyes looking
  const faceTranslateX = isEmail ? 12 : (isError ? -4 : 0);
  const faceTranslateY = isPwd ? -2 : (isError ? 6 : (isSuccess ? -4 : 0));

  return (
    <svg 
      viewBox="0 0 260 280" 
      className="w-[280px] xl:w-[320px] h-auto drop-shadow-2xl pointer-events-none" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes handsBounce {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
            100% { transform: translateY(0px); }
          }
          @keyframes idleBreathe {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
            100% { transform: translateY(0px); }
          }
          @keyframes headTypingJiggle {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-1px) rotate(1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes headErrorShake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-4px); }
            40% { transform: translateX(4px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
          }
          .hands-typing {
            animation: handsBounce 0.3s infinite ease-in-out;
          }
          .animate-breathe {
            animation: idleBreathe 3s infinite ease-in-out;
          }
          .head-typing {
            animation: headTypingJiggle 0.3s infinite ease-in-out;
          }
          .head-error-shake {
            animation: headErrorShake 0.4s ease-in-out;
          }
        `}
      </style>

      {/* Left Grip Hand */}
      <g style={{ transform: `translateY(${isPwd ? 80 : 0}px)`, transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' }}>
        <path d="M 0 160 C 25 160 30 180 20 200 C 10 210 0 200 0 190" fill="#FFCDB2" />
        <path d="M 0 170 H 15 M 0 180 H 20 M 0 190 H 15" stroke="#E6A889" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Breathing Wrapper */}
      <g className="animate-breathe">
        {/* Soft Modern Body */}
        <path 
          d="M 20 280 C 20 180 50 140 130 140 C 210 140 260 200 260 280 Z" 
          fill="#FCEACD" 
          style={{ transform: `translateY(${isSuccess ? -10 : 0}px)`, transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
        
        {/* Head Group */}
        <g 
          style={{ 
            transform: `translate(${headTranslateX}px, ${isSuccess ? -20 : 0}px) rotate(${headRotate}deg)`, 
            transformOrigin: "120px 140px", 
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
          }}
        >
          <g className={isTyping ? "head-typing" : (isError ? "head-error-shake" : "")}>
            {/* Neck */}
            <rect x="100" y="110" width="40" height="40" fill="#FFCDB2" />

            {/* Flat Solid Head Overlay */}
            <ellipse cx="120" cy="70" rx="60" ry="65" fill="#FFCDB2" />
            <circle cx="60" cy="75" r="14" fill="#F5B99A" />

            {/* Hair Base - Modern flat shapes */}
            <path d="M 50 60 C 50 -10 180 -20 180 50 C 180 70 160 90 140 50 C 120 10 90 20 70 50 C 60 70 50 70 50 60 Z" fill="#6D4C41" />
            <path d="M 130 10 Q 140 -10 150 10 Q 140 0 130 10" fill="#6D4C41" />

            <g 
              style={{ 
                transform: `translate(${faceTranslateX}px, ${faceTranslateY}px)`, 
                transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' 
              }}
            >
              {/* Eyes */}
              <g style={{ transform: `scaleY(${isPwd ? 0.05 : (isSuccess ? 1.05 : (isError ? 0.8 : 1))})`, transformOrigin: 'center 65px', transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)' }}>
                <circle cx="100" cy="65" r="6" fill="#3D2B1F" />
                <circle cx="140" cy="65" r="6" fill="#3D2B1F" />
              </g>

              {/* Eyebrows */}
              <g style={{ transform: `translateY(${isPwd || isSuccess ? -4 : 0}px)`, transition: 'all 0.3s ease-out' }}>
                <path 
                  d={
                    isPwd ? "M 90 50 Q 100 45 110 48 M 130 48 Q 140 45 150 50" : 
                    isError ? "M 90 44 Q 100 50 110 46 M 130 46 Q 140 50 150 44" : 
                    isSuccess ? "M 90 46 Q 100 40 110 46 M 130 46 Q 140 40 150 46" : 
                    "M 90 48 Q 100 43 110 48 M 130 48 Q 140 43 150 48"
                  } 
                  stroke="#3D2B1F" strokeWidth="3" strokeLinecap="round" fill="none" 
                  style={{ transition: 'd 0.3s' }}
                />
              </g>

              {/* Blush */}
              <g style={{ opacity: isPwd || isSuccess ? 0.8 : 0.4, transition: 'opacity 0.4s' }}>
                <circle cx="85" cy="80" r="9" fill="#FF9999" />
                <circle cx="155" cy="80" r="9" fill="#FF9999" />
              </g>

              {/* Smile / Mouth */}
              <path 
                d={
                  isPwd ? "M 115 95 Q 120 95 125 95" : 
                  isError ? "M 110 102 Q 120 92 130 102" : 
                  isSuccess ? "M 105 88 Q 120 115 135 88" : 
                  "M 110 92 Q 120 105 130 92"
                } 
                stroke="#3D2B1F" strokeWidth="3.5" strokeLinecap="round" fill="none" 
                style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }} 
              />
            </g>
          </g>
        </g>

        {/* Arms Smooth Sliding up (No fade jump) */}
        <g 
          className={isTyping ? "hands-typing" : ""}
          style={{ 
            transform: `translateY(${isPwd ? 0 : 220}px)`, 
            transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' 
          }}
        >
          {/* Left hiding arm */}
          <path d="M 80 200 C 80 120 90 80 100 65" fill="none" stroke="#FCEACD" strokeWidth="24" strokeLinecap="round" />
          <circle cx="100" cy="65" r="15" fill="#FFCDB2" />
          <path d="M 92 55 V 50 M 100 53 V 48 M 108 55 V 50" stroke="#E6A889" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Right hiding arm */}
          <path d="M 170 200 C 170 120 160 80 140 65" fill="none" stroke="#FCEACD" strokeWidth="24" strokeLinecap="round" />
          <circle cx="140" cy="65" r="15" fill="#FFCDB2" />
          <path d="M 148 55 V 50 M 140 53 V 48 M 132 55 V 50" stroke="#E6A889" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      </g>
    </svg>
  );
};


export default function Login() {
  const [focusedField, setFocusedField] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loginStatus, setLoginStatus] = useState("idle");
  const typeTimer = useRef(null);
  
  const { login, isAuthed, loading } = useAuth();
  const nav = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const emailRegister = register("email", { required: true });
  const passwordRegister = register("password", { required: true });

  const handlePasswordChange = (e) => {
    setIsTyping(true);
    passwordRegister.onChange(e);
    clearTimeout(typeTimer.current);
    typeTimer.current = setTimeout(() => setIsTyping(false), 300);
  };

  useEffect(() => {
    if (isAuthed) nav("/");
  }, [isAuthed, nav]);

  async function onSubmit(values) {
    setLoginStatus("loading"); // Start loading animation state
    try {
      await login(values.email, values.password);
      setLoginStatus("success");
      toast.success("Welcome back");
      setTimeout(() => nav("/"), 1200); // Allow time for loading/success animation
    } catch (e) {
      setLoginStatus("error");
      toast.error("Invalid credentials");
      // Reset animation back to normal after error
      setTimeout(() => setLoginStatus("idle"), 2000);
    }
  }

  const hideForm = loginStatus === "loading" || loginStatus === "success";

  return (
    <div className="min-h-screen relative bg-[#f8faf9] flex items-center justify-center p-4 sm:p-6 text-gray-800 overflow-y-auto">
      
      {/* Animated Background Blobs */}
      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(40px, -60px) scale(1.1); }
            66% { transform: translate(-30px, 30px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 10s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-5000 {
            animation-delay: 5s;
          }
        `}
      </style>
      
      {/* Top Left Green Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3E8B6F] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.35] animate-blob z-0"></div>
      
      {/* Top Right Orange/Peach Blob */}
      <div className="absolute top-[10%] right-[-5%] w-[450px] h-[450px] bg-[#fcdcb6] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.6] animate-blob animation-delay-2000 z-0"></div>
      
      {/* Bottom Left Soft Teal Blob */}
      <div className="absolute bottom-[-15%] left-[20%] w-[600px] h-[600px] bg-[#a8e6cf] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.4] animate-blob animation-delay-5000 z-0"></div>

      {/* Main Login Card - Adding slight glassmorphism so blobs peek through */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_-15px_rgba(62,139,111,0.2)] overflow-hidden flex min-h-[500px] sm:min-h-[560px] relative z-10 hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] border border-white/50">
        
        {/* LEFT PANEL */}
        <div className="hidden md:flex w-1/2 relative bg-[#FFFDF9]/80 backdrop-blur-sm flex-col items-center justify-center border-r border-gray-100">
          {/* Vertical green strip on the left edge */}
          <div className="absolute left-0 top-8 bottom-8 w-4 bg-[#3E8B6F] rounded-r-2xl z-30"></div>
          
          {/* Visual Background Elements */}
          <div className="absolute w-[120%] h-[80%] right-[-20%] bg-[#FDF1E7] rounded-full blur-3xl opacity-60"></div>
          
          {/* Character Peeking */}
          <div className="absolute left-[-2px] bottom-0 z-20 pointer-events-none origin-bottom-left transition-all duration-300">
            <PeekingCharacter focusedField={focusedField} isTyping={isTyping} loginStatus={loginStatus} />
          </div>
        </div>

        {/* RIGHT PANEL - LOGIN FORM OR ANIMATED LOADER */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-white/60 backdrop-blur-md z-10 relative overflow-hidden">
          
          {/* FORM VIEW */}
          <div className={`transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] w-full flex flex-col justify-center ${hideForm ? 'opacity-0 scale-95 absolute pointer-events-none' : 'opacity-100 scale-100'}`}>
            <div className="text-center md:text-left mb-12 w-full">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">Printing Press<br/>Pricing System</h1>
              <p className="text-[15px] text-slate-500 leading-relaxed font-medium">
                Automate printing cost calculations, generate quotations, and manage jobs efficiently.
              </p>
            </div>

            <form className="space-y-6 max-w-[340px] mx-auto md:mx-0 w-full" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-6 py-4 rounded-[20px] bg-white border border-gray-200 shadow-sm focus:bg-white focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 transition-all duration-300 ease-out text-[15px] text-slate-800 placeholder-slate-400 font-semibold outline-none"
                  {...emailRegister}
                  onFocus={() => setFocusedField("email")}
                  onBlur={(e) => {
                    emailRegister.onBlur(e);
                    setFocusedField(null);
                  }}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-6 py-4 rounded-[20px] bg-white border border-gray-200 shadow-sm focus:bg-white focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 transition-all duration-300 ease-out text-[15px] text-slate-800 placeholder-slate-400 font-semibold outline-none"
                  {...passwordRegister}
                  onChange={handlePasswordChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={(e) => {
                    passwordRegister.onBlur(e);
                    setFocusedField(null);
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 rounded-[20px] bg-gradient-to-r from-[#3E8B6F] to-[#2A6550] hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 text-white font-bold text-[15px] tracking-wide transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[0_8px_20px_rgba(62,139,111,0.3)] hover:shadow-[0_12px_25px_rgba(62,139,111,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 20px rgba(62,139,111,0.3)" }}
              >
                Let's start!
              </button>
            </form>

            <div className="mt-12 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex gap-4 mb-8 justify-center md:justify-start w-full">
                {/* Social login buttons */}
                <button type="button" className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-[#1877F2] hover:bg-white hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.06)] hover:border-transparent transition-all duration-300 ease-out">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" /></svg>
                </button>
                <button type="button" className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-[#DB4437] hover:bg-white hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.06)] hover:border-transparent transition-all duration-300 ease-out">
                   <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 13.9v-3.72h9.36c.14.73.22 1.5.22 2.33 0 6.64-4.5 11.36-11.54 11.36C5.03 23.87 0 18.84 0 12.5S5.03 1.13 11.43 1.13c3.15 0 5.9 1.14 7.97 3.09l-3.23 3.16c-1.12-1.05-2.8-2.12-4.74-2.12-3.88 0-7.07 3.23-7.07 7.24s3.19 7.24 7.07 7.24c4.6 0 6.34-3.23 6.6-5.84H11.99z"/></svg>
                </button>
              </div>
              <p className="text-sm text-gray-400">
                Don't have an account? <span className="text-[#3E8B6F] font-semibold hover:underline cursor-pointer">Sign up</span>
              </p>
            </div>
          </div>

          {/* LOADING AND SUCCESS OVERLAYS */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-white/40 backdrop-blur-sm z-20 ${hideForm ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-12 pointer-events-none'}`}>
             
             {/* Loading State */}
             <div className={`flex flex-col items-center absolute transition-all duration-500 transform ${loginStatus === 'loading' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                    <div className="absolute inset-0 rounded-full border-[4px] border-gray-100"></div>
                    <div className="absolute inset-0 rounded-full border-[4px] border-[#3E8B6F] border-r-transparent border-t-transparent animate-spin"></div>
                    <div className="w-8 h-8 bg-[#3E8B6F] rounded-full animate-pulse opacity-30"></div>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Authenticating</h2>
                <p className="text-gray-500 font-medium mt-2">Checking your credentials</p>
             </div>

             {/* Success State */}
             <div className={`flex flex-col items-center absolute transition-all duration-500 delay-100 transform ${loginStatus === 'success' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                <div className="w-24 h-24 mb-6 rounded-full bg-[#3E8B6F]/10 flex items-center justify-center">
                   <svg className="w-12 h-12 text-[#3E8B6F] animate-[bounce_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"></path>
                   </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Access Granted</h2>
                <p className="text-[#3E8B6F] font-bold mt-2">Entering Workspace...</p>
             </div>
             
          </div>

        </div>
      </div>
    </div>
  );
}
