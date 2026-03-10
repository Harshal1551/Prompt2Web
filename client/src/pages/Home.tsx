import api from '@/configs/axios';
import { authClient } from '@/lib/auth-client';
import { Loader2Icon, Sparkles, ArrowRight, Zap, Shield, Code2 } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Home = () => {
  const {data: session} = authClient.useSession()
  const navigate = useNavigate();

  const [input, setInput] = React.useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(!session?.user){
        return toast.error('Please sign in to create a project')
      } else if(!input.trim()){
        return toast.error('Please enter a message')
      }
    setLoading(true)
    const {data} = await api.post('/api/user/project', {initial_prompt: input});
    setLoading(false);
    navigate(`/projects/${data.projectId}`)
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message || error.message);
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* Background decorative elements - adjusted for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 md:opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 md:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 md:opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <section className="relative flex flex-col items-center text-white text-sm pb-16 md:pb-20 px-4 sm:px-6 font-poppins max-w-7xl mx-auto">
        
        {/* Main heading with gradient - responsive text */}
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight sm:leading-tight md:leading-[1.2] lg:leading-[85px] mt-6 sm:mt-8 font-bold max-w-5xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent px-2">
          Turn thoughts into websites instantly, with AI.
        </h1>

        {/* Subheading - responsive text */}
        <p className="text-center text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mt-3 sm:mt-4 px-2">
          Create, customize and publish faster than ever with AI Site Builder. 
          No coding required, just your ideas.
        </p>

        {/* Feature pills - better mobile wrap */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 px-2">
          <span className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-slate-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-300">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" /> Lightning Fast
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-slate-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-300">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /> Production Ready
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-slate-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-300">
            <Code2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" /> Tailwind CSS
          </span>
        </div>

        {/* Main input form - mobile optimized */}
        <form 
          onSubmit={onSubmitHandler} 
          className="relative w-full max-w-3xl mt-8 sm:mt-10 md:mt-12 group px-2"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#CB52D4] to-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-3 sm:p-4 focus-within:border-indigo-500/50 transition-all duration-300">
            
            {/* Textarea - adjusted height for mobile */}
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)} 
              className="w-full bg-transparent outline-none text-slate-300 placeholder-slate-600 resize-none min-h-[100px] sm:min-h-[120px] p-2 text-sm sm:text-base" 
              rows={4} 
              placeholder="Describe your website in detail... e.g., 'A modern landing page for a tech startup with a hero section, features grid, and contact form'" 
              required 
              maxLength={500}
            />
            
            {/* Character count */}
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-slate-600 bg-slate-900/50 px-2 py-1 rounded-full">
              {input.length}/500
            </div>

            {/* Action buttons - stacked on mobile */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-2 sm:mt-4">
              <div className="text-xs text-slate-600 flex items-center bg-slate-800/30 px-3 py-1.5 rounded-full">
                <Sparkles className="inline w-3 h-3 mr-1 text-indigo-400 flex-shrink-0" />
                <span>AI will generate a complete website</span>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto ml-0 sm:ml-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#CB52D4] to-indigo-600 hover:from-[#b842c0] hover:to-indigo-700 rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base group"
              >
                {!loading ? (
                  <>
                    Create with AI
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    Creating <Loader2Icon className='animate-spin size-4 text-white ml-2' />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Trust indicators - responsive grid for mobile */}
        <div className="w-full mt-12 sm:mt-16 md:mt-20">
          <p className="text-center text-xs sm:text-sm text-slate-500 uppercase tracking-wider mb-6 sm:mb-8 md:mb-10 font-medium">
            Trusted by teams from
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center justify-items-center px-2">
            {/* Framer Logo */}
            <div className="opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0">
              <svg width="80" height="28" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 sm:w-24 md:w-28">
                <path d="M20 0L0 20V0H20ZM20 10L10 20H20V10ZM20 30L0 10V30H20Z" fill="#FFFFFF"/>
                <text x="30" y="22" fill="#FFFFFF" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="600">FRAMER</text>
              </svg>
            </div>

            {/* Huawei Logo */}
            <div className="opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0">
              <svg width="80" height="28" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 sm:w-24 md:w-28">
                <circle cx="18" cy="16" r="10" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
                <path d="M18 6V12M18 20V26M8 16H14M22 16H28" stroke="#FFFFFF" strokeWidth="1.5"/>
                <text x="38" y="22" fill="#FFFFFF" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="600">HUAWEI</text>
              </svg>
            </div>

            {/* Instagram Logo */}
            <div className="opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0">
              <svg width="80" height="28" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 sm:w-24 md:w-28">
                <rect x="6" y="6" width="20" height="20" rx="5" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
                <circle cx="16" cy="16" r="4" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
                <circle cx="24" cy="8" r="1.5" fill="#FFFFFF"/>
                <text x="36" y="22" fill="#FFFFFF" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="600">INSTAGRAM</text>
              </svg>
            </div>

            {/* Microsoft Logo */}
            <div className="opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0">
              <svg width="80" height="28" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 sm:w-24 md:w-28">
                <rect x="6" y="6" width="7" height="7" fill="#F25022"/>
                <rect x="15" y="6" width="7" height="7" fill="#7FBA00"/>
                <rect x="6" y="15" width="7" height="7" fill="#00A4EF"/>
                <rect x="15" y="15" width="7" height="7" fill="#FFB900"/>
                <text x="32" y="22" fill="#FFFFFF" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="600">Microsoft</text>
              </svg>
            </div>

            {/* Walmart Logo */}
            <div className="opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 col-span-2 sm:col-span-1">
              <svg width="80" height="28" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 sm:w-24 md:w-28">
                <path d="M22 5L28 19H16L22 5Z" fill="#FFC220"/>
                <path d="M22 13L26 23H18L22 13Z" fill="#FFC220"/>
                <path d="M22 21L26 31H18L22 21Z" fill="#FFC220"/>
                <text x="36" y="24" fill="#FFFFFF" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="600">Walmart</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Stats section - responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-12 sm:mt-16 md:mt-20 p-4 sm:p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-slate-800/50 w-full mx-2">
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">10k+</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">Websites Created</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">50k+</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">98%</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">24/7</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">AI Support</div>
          </div>
        </div>
      </section>

      {/* Add custom animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Home