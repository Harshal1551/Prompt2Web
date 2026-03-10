import { AccountSettingsCards, ChangePasswordCard, DeleteAccountCard } from "@daveyplate/better-auth-ui"
import { 
  UserIcon, 
  AlertTriangleIcon,
  ChevronLeftIcon,
  LockIcon
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Settings = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'danger'>('account')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
            aria-label="Go back"
          >
            <ChevronLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden mb-6">
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === 'account'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white/5 border border-slate-800 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Account
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white/5 border border-slate-800 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LockIcon className="w-4 h-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('danger')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === 'danger'
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-white/5 border border-slate-800 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <AlertTriangleIcon className="w-4 h-4" />
              Danger Zone
            </button>
          </div>
        </div>

        {/* Desktop Sidebar and Content Layout */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4 sticky top-24">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'account'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  Account Settings
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'security'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <LockIcon className="w-4 h-4" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('danger')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'danger'
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25'
                      : 'text-slate-400 hover:bg-white/5 hover:text-red-400'
                  }`}
                >
                  <AlertTriangleIcon className="w-4 h-4" />
                  Danger Zone
                </button>
              </div>

              {/* User info card */}
              <div className="mt-6 pt-6 border-t border-slate-800/50">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">Your Account</p>
                    <p className="text-xs text-slate-500 truncate">Manage your profile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Account Settings */}
            <div className={activeTab === 'account' ? 'block' : 'hidden md:block'}>
              <div className="bg-white/5 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                    <UserIcon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Account Information</h2>
                    <p className="text-xs text-slate-500">Manage your personal information</p>
                  </div>
                </div>
                
                <AccountSettingsCards />
              </div>
            </div>

            {/* Security Settings */}
            <div className={`${activeTab === 'security' ? 'block' : 'hidden md:block'} mt-6`}>
              <div className="bg-white/5 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <LockIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Security Settings</h2>
                    <p className="text-xs text-slate-500">Update your password and security preferences</p>
                  </div>
                </div>

                <ChangePasswordCard />

                {/* Two Factor Authentication */}
                <div className="mt-6 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white transition-colors">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className={`${activeTab === 'danger' ? 'block' : 'hidden md:block'} mt-6`}>
              <div className="bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20">
                    <AlertTriangleIcon className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Danger Zone</h2>
                    <p className="text-xs text-slate-500">Irreversible actions for your account</p>
                  </div>
                </div>

                <DeleteAccountCard />

                {/* Warning message */}
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-xs text-red-400">
                    ⚠️ This action is permanent and cannot be undone. All your projects and data will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@prompt2web.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              support@prompt2web.com
            </a>
          </p>
        </div>
      </div>

      {/* Custom animations */}
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default Settings