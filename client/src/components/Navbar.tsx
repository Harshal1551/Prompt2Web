import  { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authClient } from '@/lib/auth-client';
import { UserButton } from '@daveyplate/better-auth-ui';
import api from '@/configs/axios';
import { toast } from 'sonner';
import { 
  HomeIcon, 
  FolderIcon, 
  UsersIcon, 
  CreditCardIcon,
  MenuIcon,
  XIcon,
  SparklesIcon,
  CoinsIcon
} from 'lucide-react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [credits, setCredits] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    const { data: session } = authClient.useSession();

    const getCredits = async() => {
      try {
        const { data } = await api.get('/api/user/credits');
        setCredits(data.credits);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error.message);
        console.log(error);
      }
    }

    useEffect(() => {
      if(session?.user){
        getCredits();
      }
    }, [session?.user]);

    // Handle scroll effect
    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
      setMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path: string) => {
      return location.pathname === path;
    };

    const navLinks = [
      { path: '/', label: 'Home', icon: HomeIcon },
      { path: '/projects', label: 'My Projects', icon: FolderIcon },
      { path: '/community', label: 'Community', icon: UsersIcon },
      { path: '/pricing', label: 'Pricing', icon: CreditCardIcon },
    ];

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300
        ${scrolled 
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 py-2' 
          : 'bg-transparent py-4'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to='/' className="flex items-center gap-2 group">
              <img
                src={assets.logo}
                alt="Prompt2Web"
                className="h-7 sm:h-8 md:h-9 transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-300 relative group
                      ${isActive(link.path)
                        ? 'text-white bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                    {isActive(link.path) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right section - Credits & Auth */}
            <div className="flex items-center gap-3">
              {session?.user ? (
                <>
                  {/* Credits Badge */}
                  <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
                    <CoinsIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-300">
                      <span className="font-semibold text-amber-400">{credits}</span> credits
                    </span>
                  </div>

                  {/* Mobile Credits Badge */}
                  <div className="sm:hidden bg-white/10 px-3 py-1.5 rounded-full">
                    <span className="text-xs text-slate-300">
                      <span className="font-semibold text-amber-400">{credits}</span>
                    </span>
                  </div>

                  {/* User Button - Removed classNames prop to avoid type error */}
                  <UserButton size='icon' />
                </>
              ) : (
                <button 
                  onClick={() => navigate('/auth/signin')} 
                  className="group relative px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-300 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" />
                    Get Started
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setMenuOpen(false)}
          ></div>
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <span className="text-sm font-medium text-slate-400">Menu</span>
                <button 
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <XIcon className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 py-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`
                        flex items-center gap-3 px-4 py-3 text-sm transition-colors
                        ${isActive(link.path)
                          ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border-l-2 border-indigo-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* User Info Footer */}
              {session?.user && (
                <div className="p-4 border-t border-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {session.user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {session.user.name || 'User'}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                    <span className="text-xs text-slate-400">Credits</span>
                    <span className="text-sm font-semibold text-amber-400">{credits}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16 sm:h-[72px]"></div>

      {/* Background image (optional) */}
      <img 
        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/hero/bg-gradient-2.png" 
        className="fixed inset-0 -z-10 size-full object-cover opacity-50 pointer-events-none" 
        alt=""
      />
    </>
  )
}

export default Navbar