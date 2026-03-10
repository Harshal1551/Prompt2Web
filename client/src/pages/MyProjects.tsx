import  { useEffect, useState } from 'react'
import type { Project } from '../types';
import { 
  Loader2Icon, 
  PlusIcon, 
  TrashIcon, 
  EyeIcon,
  Code2,
  CalendarIcon,
  ExternalLink,
  Sparkles,
  Search,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '@/configs/axios';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

const MyProjects = () => {
  const {data: session, isPending} = authClient.useSession()
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchProjects = async () =>{
    try {
      const {data} = await api.get('/api/user/projects')
      setProjects(data.projects)
      setLoading(false)
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message)
      setLoading(false)
    }
  }

  const deleteProject = async (projectId:string) => {
    try {
      setDeletingId(projectId);
      const confirm = window.confirm('Are you sure you want to delete this project?');
      if(!confirm) {
        setDeletingId(null);
        return;
      }
      const {data} = await api.delete(`/api/project/${projectId}`)
      toast.success(data.message)
      fetchProjects()
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(()=>{
    if(session?.user && !isPending){
      fetchProjects()
    }else if(!isPending && !session?.user){
      navigate('/');
      toast('Please login to view your projects');
    }
  },[session?.user, isPending]);

  // Filter projects based on search
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.initial_prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </div>

        <div className='relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 2xl:px-32 py-6 sm:py-8 md:py-10'>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-[80vh]'>
              <Loader2Icon className='size-8 sm:size-10 animate-spin text-indigo-400 mb-4' />
              <p className='text-slate-400 text-sm sm:text-base'>Loading your projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className='py-4 sm:py-6 md:py-8 min-h-[80vh]'>
              
              {/* Header with title and search */}
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10'>
                <div>
                  <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent'>
                    My Projects
                  </h1>
                  <p className='text-xs sm:text-sm text-slate-500 mt-1'>
                    You have {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
                  </p>
                </div>
                
                <div className='flex flex-col sm:flex-row gap-3'>
                  {/* Search bar */}
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500' />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-full sm:w-64 pl-10 pr-4 py-2 bg-white/5 border border-slate-800 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors'
                    />
                  </div>
                  
                  <button 
                    onClick={()=> navigate('/')} 
                    className='flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 sm:px-5 py-2 rounded-xl transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-500/25'
                  >
                    <PlusIcon size={18} />
                    <span className='text-sm sm:text-base'>New Project</span>
                  </button>
                </div>
              </div>

              {/* Projects grid */}
              {filteredProjects.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6'>
                  {filteredProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className='group relative bg-white/5 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer'
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      {/* Preview section */}
                      <div className='relative w-full h-36 sm:h-40 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-slate-800/50 overflow-hidden'>
                        {project.current_code ? (
                          <div className='relative w-full h-full'>
                            <iframe 
                              srcDoc={project.current_code}
                              className='absolute top-0 left-0 w-[1024px] h-[768px] origin-top-left pointer-events-none opacity-80'
                              sandbox='allow-scripts allow-same-origin'
                              style={{ transform: 'scale(0.2)' }}
                              title={`preview-${project.id}`}
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent'></div>
                          </div>
                        ) : (
                          <div className='flex flex-col items-center justify-center h-full text-slate-600'>
                            <Code2 className='w-8 h-8 mb-2 opacity-50' />
                            <p className='text-xs'>No preview available</p>
                          </div>
                        )}
                        
                        {/* Project type badge */}
                        <div className='absolute top-2 left-2 z-10'>
                          <span className='px-2 py-1 text-[10px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full'>
                            Website
                          </span>
                        </div>
                      </div>

                      {/* Content section */}
                      <div className='p-3 sm:p-4'>
                        <div className='mb-2'>
                          <h2 className='text-base sm:text-lg font-semibold text-white line-clamp-1 mb-1'>
                            {project.name}
                          </h2>
                          <p className='text-xs sm:text-sm text-slate-400 line-clamp-2'>
                            {project.initial_prompt}
                          </p>
                        </div>

                        {/* Date and actions */}
                        <div className='flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50'>
                          <div className='flex items-center gap-1 text-xs text-slate-500'>
                            <CalendarIcon className='w-3 h-3' />
                            <span>{new Date(project.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}</span>
                          </div>

                          <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => navigate(`/preview/${project.id}`)}
                              className='p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors'
                              title="Preview"
                            >
                              <EyeIcon className='w-3.5 h-3.5' />
                            </button>
                            <button
                              onClick={() => navigate(`/projects/${project.id}`)}
                              className='p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors'
                              title="Open"
                            >
                              <ExternalLink className='w-3.5 h-3.5' />
                            </button>
                            <button
                              onClick={() => deleteProject(project.id)}
                              disabled={deletingId === project.id}
                              className='p-1.5 bg-white/5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50'
                              title="Delete"
                            >
                              {deletingId === project.id ? (
                                <Loader2Icon className='w-3.5 h-3.5 animate-spin' />
                              ) : (
                                <TrashIcon className='w-3.5 h-3.5' />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Hover overlay effect */}
                      <div className='absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/20 rounded-xl pointer-events-none transition-all duration-300'></div>
                    </div>
                  ))}
                </div>
              ) : (
                // No search results
                <div className='flex flex-col items-center justify-center py-20'>
                  <div className='bg-white/5 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 text-center max-w-md'>
                    <Search className='w-12 h-12 text-slate-600 mx-auto mb-4' />
                    <h3 className='text-xl font-semibold text-white mb-2'>No projects found</h3>
                    <p className='text-sm text-slate-400 mb-6'>
                      No projects match your search "{searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className='inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors'
                    >
                      <XCircle className='w-4 h-4' />
                      Clear search
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Empty state
            <div className='flex flex-col items-center justify-center min-h-[80vh]'>
              <div className='bg-white/5 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto'>
                <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Sparkles className='w-8 h-8 sm:w-10 sm:h-10 text-indigo-400' />
                </div>
                <h1 className='text-2xl sm:text-3xl font-bold text-white mb-3'>
                  No projects yet
                </h1>
                <p className='text-sm sm:text-base text-slate-400 mb-8 max-w-md'>
                  Start bringing your ideas to life! Create your first AI-powered website in seconds.
                </p>
                <button 
                  onClick={()=> navigate('/')} 
                  className='inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-500/25'
                >
                  <PlusIcon size={20} />
                  Create Your First Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MyProjects