import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types'
import { 
  ArrowBigDownDashIcon, 
  EyeIcon, 
  EyeOffIcon, 
  FullscreenIcon, 
  LaptopIcon, 
  Loader2Icon, 
  MessageSquareIcon, 
  SaveIcon, 
  SmartphoneIcon, 
  TabletIcon, 
  XIcon,
  ChevronLeftIcon,
  MoreVerticalIcon,
  ClockIcon,
  GlobeIcon,
  AlertCircleIcon,
  RefreshCwIcon
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview'
import api from '@/configs/axios'
import { toast } from 'sonner'  // Remove Toaster import
import { authClient } from '@/lib/auth-client'

const Projects = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(true)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>("desktop")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const previewRef = useRef<ProjectPreviewRef>(null)

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/api/user/project/${projectId}`);
      setProject(data.project)
      setIsGenerating(data.project.current_code ? false : true)
      if (data.project.current_code) {
        setLastSaved(new Date())
      }
      setLoading(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
      setLoading(false)
    }
  }

  const saveProject = async () => {
    if (!previewRef.current) return;
    const code = previewRef.current.getCode();
    if (!code) return;
    setIsSaving(true);
    try {
      const { data } = await api.put(`/api/project/save/${projectId}`, { code });
      toast.success(data.message)
      setLastSaved(new Date())
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }
  
  const downloadCode = () => {
    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code) {
      if (isGenerating) {
        toast.error('Please wait for generation to complete')
      }
      return
    }
    const element = document.createElement('a');
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file)
    element.download = "index.html";
    document.body.appendChild(element)
    element.click();
    URL.revokeObjectURL(element.href)
    document.body.removeChild(element)
    toast.success('Code downloaded successfully')
  }

  const togglePublish = async () => {
    try {
      const { data } = await api.get(`/api/user/publish-toggle/${projectId}`);
      toast.success(data.message)
      setProject((prev) => prev ? ({ ...prev, isPublished: !prev.isPublished }) : null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchProject();
    } else if (!isPending && !session?.user) {
      navigate("/")
      toast("Please login to view your projects")
    }
  }, [session?.user])

  useEffect(() => {
    if (project && !project.current_code) {
      const intervalId = setInterval(fetchProject, 10000);
      return () => clearInterval(intervalId)
    }
  }, [project])

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2Icon className='size-8 sm:size-10 animate-spin text-indigo-400 mx-auto mb-4' />
          <p className='text-slate-400 text-sm sm:text-base'>Loading your project...</p>
        </div>
      </div>
    )
  }

  return project ? (
    <div className='h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden'>
      {/* Top Navigation Bar */}
      <div className='border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm'>
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center justify-between px-4 py-2'>
          {/* Left section */}
          <div className='flex items-center gap-4 min-w-[200px]'>
            <button 
              onClick={() => navigate('/')}
              className='p-2 hover:bg-white/5 rounded-lg transition-colors'
              title="Back to Home"
            >
              <ChevronLeftIcon className='w-5 h-5 text-slate-400' />
            </button>
            <img src="/favicon.svg" alt="Prompt2Web" className='h-8 cursor-pointer' onClick={() => navigate('/')} />
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-sm font-medium text-white truncate max-w-[200px]'>{project.name}</h2>
                {project.isPublished ? (
                  <span className='flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full'>
                    <GlobeIcon className='w-3 h-3' />
                    Published
                  </span>
                ) : (
                  <span className='flex items-center gap-1 text-xs text-slate-400 bg-slate-400/10 px-2 py-0.5 rounded-full'>
                    <EyeOffIcon className='w-3 h-3' />
                    Draft
                  </span>
                )}
              </div>
              <div className='flex items-center gap-2 text-xs text-slate-500'>
                <ClockIcon className='w-3 h-3' />
                <span>Last saved {lastSaved ? lastSaved.toLocaleTimeString() : 'never'}</span>
              </div>
            </div>
          </div>

          {/* Device selector */}
          <div className='flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50'>
            <button
              onClick={() => setDevice('phone')}
              className={`p-2 rounded-md transition-all ${device === 'phone' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              title="Phone view"
            >
              <SmartphoneIcon className='w-4 h-4' />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-md transition-all ${device === 'tablet' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              title="Tablet view"
            >
              <TabletIcon className='w-4 h-4' />
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-md transition-all ${device === 'desktop' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              title="Desktop view"
            >
              <LaptopIcon className='w-4 h-4' />
            </button>
          </div>

          {/* Action buttons */}
          <div className='flex items-center gap-2'>
            <button
              onClick={saveProject}
              disabled={isSaving}
              className='flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-all disabled:opacity-50'
            >
              {isSaving ? <Loader2Icon className='w-4 h-4 animate-spin' /> : <SaveIcon className='w-4 h-4' />}
              Save
            </button>
            
            <Link
              to={`/preview/${projectId}`}
              target='_blank'
              className='flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-all'
            >
              <FullscreenIcon className='w-4 h-4' />
              Preview
            </Link>
            
            <button
              onClick={downloadCode}
              className='flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm transition-all shadow-lg shadow-blue-500/25'
            >
              <ArrowBigDownDashIcon className='w-4 h-4' />
              Download
            </button>
            
            <button
              onClick={togglePublish}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all shadow-lg ${
                project.isPublished 
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-500/25' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/25'
              }`}
            >
              {project.isPublished ? <EyeOffIcon className='w-4 h-4' /> : <EyeIcon className='w-4 h-4' />}
              {project.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden'>
          <div className='flex items-center justify-between px-4 py-2'>
            <div className='flex items-center gap-2'>
              <button onClick={() => navigate('/')} className='p-1'>
                <ChevronLeftIcon className='w-5 h-5 text-slate-400' />
              </button>
              <img src="/favicon.svg" alt="Prompt2Web" className='h-7' />
              <div>
                <h2 className='text-sm font-medium text-white max-w-[150px] truncate'>{project.name}</h2>
                <div className='flex items-center gap-1'>
                  {project.isPublished ? (
                    <GlobeIcon className='w-3 h-3 text-green-400' />
                  ) : (
                    <EyeOffIcon className='w-3 h-3 text-slate-400' />
                  )}
                  <span className='text-[10px] text-slate-500'>
                    {lastSaved ? lastSaved.toLocaleTimeString() : 'Not saved'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className='p-2 hover:bg-white/5 rounded-lg'
            >
              <MoreVerticalIcon className='w-5 h-5 text-slate-400' />
            </button>
          </div>

          {/* Mobile device selector */}
          <div className='flex items-center justify-center gap-1 px-4 py-2 border-t border-slate-800/50'>
            <button
              onClick={() => setDevice('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${device === 'phone' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400'}`}
            >
              <SmartphoneIcon className='w-4 h-4' />
              <span className='text-xs'>Phone</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${device === 'tablet' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400'}`}
            >
              <TabletIcon className='w-4 h-4' />
              <span className='text-xs'>Tablet</span>
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${device === 'desktop' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400'}`}
            >
              <LaptopIcon className='w-4 h-4' />
              <span className='text-xs'>Desktop</span>
            </button>
          </div>

          {/* Mobile menu dropdown */}
          {showMobileMenu && (
            <div className='absolute top-16 right-2 left-2 z-50 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-2 animate-in slide-in-from-top-2'>
              <div className='flex flex-col gap-1'>
                <button
                  onClick={() => { saveProject(); setShowMobileMenu(false); }}
                  disabled={isSaving}
                  className='flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-colors'
                >
                  {isSaving ? <Loader2Icon className='w-4 h-4 animate-spin' /> : <SaveIcon className='w-4 h-4' />}
                  <span className='text-sm'>Save</span>
                </button>
                
                <Link
                  to={`/preview/${projectId}`}
                  target='_blank'
                  onClick={() => setShowMobileMenu(false)}
                  className='flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-colors'
                >
                  <FullscreenIcon className='w-4 h-4' />
                  <span className='text-sm'>Preview in new tab</span>
                </Link>
                
                <button
                  onClick={() => { downloadCode(); setShowMobileMenu(false); }}
                  className='flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-colors'
                >
                  <ArrowBigDownDashIcon className='w-4 h-4' />
                  <span className='text-sm'>Download HTML</span>
                </button>
                
                <button
                  onClick={() => { togglePublish(); setShowMobileMenu(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    project.isPublished ? 'text-amber-400' : 'text-indigo-400'
                  }`}
                >
                  {project.isPublished ? <EyeOffIcon className='w-4 h-4' /> : <EyeIcon className='w-4 h-4' />}
                  <span className='text-sm'>{project.isPublished ? 'Unpublish' : 'Publish'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Sidebar */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <Sidebar 
            isMenuOpen={isMenuOpen} 
            project={project} 
            setProject={(p) => setProject(p)} 
            isGenerating={isGenerating} 
            setIsGenerating={setIsGenerating} 
          />
        </div>

        {/* Preview area */}
        <div className='flex-1 p-2 md:p-4 overflow-auto bg-slate-950/50'>
          {/* Generation status */}
          {isGenerating && (
            <div className='mb-2 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <RefreshCwIcon className='w-4 h-4 text-indigo-400 animate-spin' />
                <span className='text-xs text-indigo-400'>AI is generating your website...</span>
              </div>
              <span className='text-[10px] text-slate-500'>This may take a few seconds</span>
            </div>
          )}

          {/* Preview component */}
          <ProjectPreview 
            ref={previewRef} 
            project={project} 
            isGenerating={isGenerating} 
            device={device}
          />
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className='md:hidden fixed bottom-4 left-4 z-50 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg'
      >
        {isMenuOpen ? <XIcon className='w-5 h-5' /> : <MessageSquareIcon className='w-5 h-5' />}
      </button>
    </div>
  ) : (
    <div className='min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center'>
      <div className='text-center'>
        <AlertCircleIcon className='w-12 h-12 text-red-400 mx-auto mb-4' />
        <p className='text-xl font-medium text-gray-200 mb-2'>Unable to load project!</p>
        <button
          onClick={() => navigate('/')}
          className='text-indigo-400 hover:text-indigo-300 transition-colors text-sm'
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}

export default Projects