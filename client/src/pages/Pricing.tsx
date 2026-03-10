import React, { useState } from 'react'
import { appPlans } from '../assets/assets';
import Footer from '../components/Footer';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import api from '@/configs/axios';
import { 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  Zap, 
  Crown, 
  Star,
  ArrowRight,
  Loader2Icon,
  Shield,
  Clock
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
}

const Pricing = () => {
  const { data: session } = authClient.useSession();
  const [plans] = useState<Plan[]>(appPlans);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handlePurchase = async (planId: string) => {
    try {
      if (!session?.user) {
        toast.error("Please login to purchase credits");
        return;
      }
      setLoadingPlan(planId);
      const { data } = await api.post('/api/user/purchase-credits', { planId });
      window.location.href = data.payment_link;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
      setLoadingPlan(null);
    }
  }

  // Plan icons mapping
  const getPlanIcon = (planName: string) => {
    switch(planName.toLowerCase()) {
      case 'free':
        return <Star className="w-6 h-6 text-yellow-400" />;
      case 'pro':
        return <Zap className="w-6 h-6 text-blue-400" />;
      case 'enterprise':
        return <Crown className="w-6 h-6 text-purple-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-400" />;
    }
  };

  // Get gradient colors based on plan
  const getPlanGradient = (planName: string) => {
    switch(planName.toLowerCase()) {
      case 'free':
        return 'from-gray-600 to-gray-700';
      case 'pro':
        return 'from-blue-600 to-indigo-600';
      case 'enterprise':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-indigo-600 to-purple-600';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
          
          {/* Grid overlay - Fixed SVG string */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          />
        </div>

        <div className='relative w-full max-w-7xl mx-auto z-20 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16'>
          
          {/* Header section */}
          <div className='text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16'>
            <div className='inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-4 animate-fade-in'>
              <Sparkles className='w-4 h-4 text-indigo-400' />
              <span className='text-xs sm:text-sm text-slate-300'>Simple, transparent pricing</span>
            </div>
            
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4'>
              Choose Your Perfect Plan
            </h1>
            
            <p className='text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto px-4'>
              Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
            </p>
          </div>

          {/* Billing toggle */}
          <div className='flex justify-center mb-8 sm:mb-12'>
            <div className='bg-white/5 backdrop-blur-sm border border-slate-800 rounded-full p-1'>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual <span className='text-indigo-400 text-[10px] ml-1'>Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing cards grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0'>
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`
                  relative group p-6 sm:p-8 bg-white/5 backdrop-blur-sm 
                  border border-slate-800/50 rounded-2xl 
                  hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 
                  transition-all duration-500
                  ${plan.name.toLowerCase() === 'pro' ? 'lg:scale-105 border-indigo-500/30' : ''}
                `}
              >
                {/* Popular badge for Pro plan */}
                {plan.name.toLowerCase() === 'pro' && (
                  <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                    <span className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg shadow-indigo-500/25'>
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan icon and name */}
                <div className='flex items-center gap-3 mb-4'>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getPlanGradient(plan.name)} bg-opacity-20`}>
                    {getPlanIcon(plan.name)}
                  </div>
                  <h3 className='text-xl sm:text-2xl font-bold text-white'>{plan.name}</h3>
                </div>

                {/* Price */}
                <div className='mb-4'>
                  <div className='flex items-baseline gap-1'>
                    <span className='text-3xl sm:text-4xl font-bold text-white'>{plan.price}</span>
                    <span className='text-sm text-slate-400'> / {plan.credits} credits</span>
                  </div>
                  {billingCycle === 'annual' && plan.name.toLowerCase() !== 'free' && (
                    <p className='text-xs text-indigo-400 mt-1'>Save 20% with annual billing</p>
                  )}
                </div>

                {/* Description */}
                <p className='text-sm text-slate-400 mb-6'>{plan.description}</p>

                {/* Features list */}
                <ul className='space-y-3 mb-8'>
                  {plan.features.map((feature, i) => (
                    <li key={i} className='flex items-start gap-2 text-sm'>
                      <CheckCircle2 className='w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5' />
                      <span className='text-slate-300'>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className={`
                    w-full py-3 px-4 rounded-xl font-medium text-sm sm:text-base
                    transition-all duration-300 active:scale-95
                    flex items-center justify-center gap-2
                    ${plan.name.toLowerCase() === 'free' 
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-slate-700' 
                      : `bg-gradient-to-r ${getPlanGradient(plan.name)} hover:opacity-90 text-white shadow-lg shadow-indigo-500/25`
                    }
                  `}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2Icon className='w-4 h-4 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.name.toLowerCase() === 'free' ? 'Get Started' : 'Buy Now'}
                      <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </>
                  )}
                </button>

                {/* Hover effect overlay */}
                <div className='absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/20 rounded-2xl pointer-events-none transition-all duration-300'></div>
              </div>
            ))}
          </div>

          {/* Credit usage info */}
          <div className='mt-12 sm:mt-16 md:mt-20 text-center'>
            <div className='inline-block bg-white/5 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto'>
              <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6'>
                <div className='flex items-center gap-2'>
                  <Zap className='w-5 h-5 text-yellow-400' />
                  <span className='text-sm text-slate-300'>
                    <span className='font-semibold text-white'>Creation / Revision</span> consumes
                  </span>
                </div>
                <div className='flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-4 py-2'>
                  <span className='text-2xl font-bold text-indigo-400'>5</span>
                  <span className='text-sm text-slate-300'>credits</span>
                </div>
              </div>
              <p className='text-xs text-slate-500 mt-3'>
                Purchase more credits anytime. Unused credits never expire.
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12'>
            <div className='flex items-center gap-2 text-xs sm:text-sm text-slate-500'>
              <Shield className='w-4 h-4 text-green-400' />
              Secure payments
            </div>
            <div className='flex items-center gap-2 text-xs sm:text-sm text-slate-500'>
              <Clock className='w-4 h-4 text-blue-400' />
              Credits never expire
            </div>
            <div className='flex items-center gap-2 text-xs sm:text-sm text-slate-500'>
              <CreditCard className='w-4 h-4 text-purple-400' />
              Multiple payment methods
            </div>
          </div>
        </div>
      </div>

      <Footer />

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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </>
  )
}

export default Pricing