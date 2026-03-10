import React, { useEffect, useState } from 'react'
import type { Project } from '../types';
import { 
  Loader2Icon, 
  Search,
  Globe,
  CalendarIcon,
  UserIcon,
  Sparkles,
  Eye,
  Heart,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '@/configs/axios';
import { toast } from 'sonner';

const Community = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const navigate = useNavigate();

  const categories = [
    'all',
    'landing page',
    'portfolio',
    'e-commerce',
    'blog',
    'business',
    'personal'
  ];

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/api/project/published');
      setProjects(data.projects);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.initial_prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      project.initial_prompt.toLowerCase().includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name?.slice(0, 2).toUpperCase() || 'U';
  };

  // Generate random pastel color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-indigo-500 to-indigo-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600'
    ];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
          <div className="absolute bottom-20 -left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-2000"></div>
        </div>

        <div className='relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 2xl:px-32 py-6 sm:py-8 md:py-10'>
          
          {/* Header section */}
          <div className='text-center max-w-3xl mx-auto mb-8 sm:mb-12'>
            <div className='inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-4'>
              <Globe className='w-4 h-4 text-indigo-400' />
              <span className='text-xs sm:text-sm text-slate-300'>Community Showcase</span>
            </div>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-3'>
              Published Projects
            </h1>
            <p className='text-sm sm:text-base text-slate-400'>
              Explore amazing websites created by our community. Get inspired and see what's possible with AI.
            </p>
          </div>

          {/* Filters and Search */}
          <div className='flex flex-col lg:flex-row gap-4 mb-8 sm:mb-10'>
            {/* Search bar */}
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500' />
              <input
                type="text"
                placeholder='Search projects, descriptions, or creators...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-white/5 border border-slate-800 rounded-xl text-sm sm:text-base text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors'
              />
            </div>

            {/* Category filters - horizontal scroll on mobile */}
            <div className='flex overflow-x-auto pb-2 lg:pb-0 lg:flex-wrap gap-2 scrollbar-hide'>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white/5 border border-slate-800 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className='flex items-center justify-between mb-6'>
            <p className='text-xs sm:text-sm text-slate-500'>
              Showing <span className='text-white font-medium'>{filteredProjects.length}</span> projects
            </p>
            <p className='text-xs sm:text-sm text-slate-500'>
              Updated just now
            </p>
          </div>

          {loading ? (
            <div className='flex flex-col items-center justify-center h-[60vh]'>
              <Loader2Icon className='size-8 sm:size-10 animate-spin text-indigo-400 mb-4' />
              <p className='text-slate-400 text-sm sm:text-base'>Loading community projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6'>
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/view/${project.id}`}
                  target='_blank'
                  className='group relative bg-white/5 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300'
                >
                  {/* Preview section */}
                  <div className='relative w-full h-40 sm:h-44 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-slate-800/50 overflow-hidden'>
                    {project.current_code ? (
                      <>
                        <iframe
                          srcDoc={project.current_code}
                          className='absolute top-0 left-0 w-[1024px] h-[768px] origin-top-left pointer-events-none opacity-80'
                          sandbox='allow-scripts allow-same-origin'
                          style={{ transform: 'scale(0.22)' }}
                          title={`preview-${project.id}`}
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent'></div>
                      </>
                    ) : (
                      <div className='flex flex-col items-center justify-center h-full text-slate-600'>
                        <Sparkles className='w-8 h-8 mb-2 opacity-50' />
                        <p className='text-xs'>Preview unavailable</p>
                      </div>
                    )}

                    {/* View count badge */}
                    <div className='absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-2 py-1'>
                      <Eye className='w-3 h-3 text-slate-400' />
                      <span className='text-[10px] text-slate-400'>1.2k</span>
                    </div>

                    {/* Category badge */}
                    <div className='absolute bottom-2 left-2 z-10'>
                      <span className='px-2 py-1 text-[10px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full'>
                        {project.initial_prompt.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className='p-3 sm:p-4'>
                    {/* Title and description */}
                    <div className='mb-3'>
                      <h2 className='text-base sm:text-lg font-semibold text-white line-clamp-1 mb-1'>
                        {project.name}
                      </h2>
                      <p className='text-xs sm:text-sm text-slate-400 line-clamp-2'>
                        {project.initial_prompt}
                      </p>
                    </div>

                    {/* Author and date */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        {/* Avatar */}
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarColor(project.user?.name || '')} flex items-center justify-center text-[10px] font-medium text-white`}>
                          {getInitials(project.user?.name || 'U')}
                        </div>
                        
                        {/* Author name */}
                        <span className='text-xs text-slate-300 font-medium line-clamp-1'>
                          {project.user?.name || 'Anonymous'}
                        </span>
                      </div>

                      {/* Date */}
                      <div className='flex items-center gap-1 text-[10px] text-slate-500'>
                        <CalendarIcon className='w-3 h-3' />
                        <span>{new Date(project.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className='flex items-center gap-3 mt-3 pt-3 border-t border-slate-800/50'>
                      <div className='flex items-center gap-1'>
                        <Heart className='w-3.5 h-3.5 text-pink-400' />
                        <span className='text-xs text-slate-400'>24</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <MessageCircle className='w-3.5 h-3.5 text-slate-400' />
                        <span className='text-xs text-slate-400'>12</span>
                      </div>
                      <div className='flex items-center gap-1 ml-auto'>
                        <ExternalLink className='w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors' />
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay effect */}
                  <div className='absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/20 rounded-xl pointer-events-none transition-all duration-300'></div>
                </Link>
              ))}
            </div>
          ) : (
            // Empty state for no results
            <div className='flex flex-col items-center justify-center py-20'>
              <div className='bg-white/5 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 text-center max-w-md'>
                <div className='w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                  <Search className='w-8 h-8 text-indigo-400' />
                </div>
                <h3 className='text-xl font-semibold text-white mb-2'>No projects found</h3>
                <p className='text-sm text-slate-400 mb-6'>
                  {searchTerm ? `No projects match "${searchTerm}"` : 'No published projects yet'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className='text-indigo-400 hover:text-indigo-300 transition-colors text-sm'
                  >
                    Clear search
                  </button>
                )}
                {!searchTerm && (
                  <button
                    onClick={() => navigate('/')}
                    className='inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300'
                  >
                    <Sparkles className='w-4 h-4' />
                    Create a Project
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Custom styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
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
    </>
  )
}

export default Community