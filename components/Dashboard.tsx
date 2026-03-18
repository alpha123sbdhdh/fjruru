import React, { useState, useRef, Suspense } from 'react';
import { SERVERS, MEMBERS, COURSES } from '../constants';
import WarRoomAI from './WarRoomAI';
import CareerArchitect from './CareerArchitect';
import StrategyAudits from './StrategyAudits';
import VerifiedBadge from './VerifiedBadge';
import CustomVideoPlayer from './CustomVideoPlayer';
import AdminPortal from './AdminPortal';
import { ErrorBoundary } from './ErrorBoundary';

const CryptoWallet = React.lazy(() => import('./CryptoWallet').then(module => ({ default: module.CryptoWallet })));

import { 
  Crown,
  LogOut,
  Mic, 
  Settings,
  Hash,
  Volume2,
  Lock,
  ChevronDown,
  PlayCircle,
  Video,
  LayoutGrid, 
  X,
  UserPlus,
  ShieldAlert,
  GraduationCap,
  Megaphone,
  LayoutDashboard,
  Trophy,
  Swords,
  BookOpen,
  MessageCircle,
  Radio,
  Search,
  Upload,
  Plus,
  Check,
  FileVideo,
  Loader2,
  Trash2,
  AlertCircle,
  AlertTriangle,
  User,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Terminal,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Users,
  ShoppingCart,
  RotateCw,
  Bookmark,
  ChevronRight,
  Moon,
  Globe,
  Edit2
} from 'lucide-react';
import { ChatMessage, Member, Lesson, Channel, Task, Course, Server } from '../types';

interface DashboardProps {
  onLogout?: () => void;
  id?: string;
}

interface ExtendedChatMessage extends ChatMessage {
  isPinned?: boolean;
  replies?: ExtendedChatMessage[];
  parentId?: string;
  isEdited?: boolean;
  imageUrl?: string;
  senderIsVerified?: boolean;
}

const CoursePlayer: React.FC<{ 
    activeChannel: Channel; 
    lessons: Lesson[]; 
    onToggleMobileMenu: () => void;
    isAdmin: boolean;
    onOpenUpload: () => void;
    onDeleteLesson: (lessonId: string) => void;
    onEditLesson: (lessonId: string, updatedData: Partial<Lesson>) => void;
    isEnrolled: boolean;
    onEnroll: () => void;
    completedLessons: string[];
    onToggleLessonComplete: (lessonId: string) => void;
}> = ({ activeChannel, lessons, onToggleMobileMenu, isAdmin, onOpenUpload, onDeleteLesson, onEditLesson, isEnrolled, onEnroll, completedLessons, onToggleLessonComplete }) => {
    const [isLessonDropdownOpen, setIsLessonDropdownOpen] = useState(false);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    const handleEditClick = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingLesson) {
            onEditLesson(editingLesson.id, editingLesson);
            setIsEditModalOpen(false);
            setEditingLesson(null);
        }
    };

    const hasLessons = lessons.length > 0;
    const currentLesson = hasLessons ? (lessons[currentLessonIndex] || lessons[0]) : null;

    // Reset lesson index if we switch channels and the current index is out of bounds
    React.useEffect(() => {
        if (currentLessonIndex >= lessons.length) {
            setCurrentLessonIndex(0);
        }
    }, [lessons, currentLessonIndex]);

    if (!isEnrolled && !isAdmin) {
        return (
            <div className="flex flex-col h-full bg-[#09090b] text-white overflow-y-auto">
                <div className="md:hidden h-[60px] flex items-center px-4 border-b border-white/10 bg-[#18181b] shrink-0 sticky top-0 z-30">
                    <button onClick={onToggleMobileMenu} className="mr-4 text-gray-400 hover:text-white">
                        <LayoutGrid size={24} />
                    </button>
                    <span className="font-bold text-sm truncate">{activeChannel.name}</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 border border-[#D4AF37]/20">
                        <Lock size={40} className="text-[#D4AF37]" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Module Locked</h2>
                    <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                        You are not enrolled in this tactical training module. Access to these briefings is restricted to authorized personnel only.
                    </p>
                    <button 
                        onClick={onEnroll}
                        className="px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#E5C048] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    >
                        Enroll in Course
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#09090b] text-white overflow-y-auto">
             <div className="md:hidden h-[60px] flex items-center px-4 border-b border-white/10 bg-[#18181b] shrink-0 sticky top-0 z-30">
                <button onClick={onToggleMobileMenu} className="mr-4 text-gray-400 hover:text-white">
                    <LayoutGrid size={24} />
                </button>
                <span className="font-bold text-sm truncate">{activeChannel.name}</span>
            </div>

            <div className="max-w-4xl mx-auto w-full p-4 md:p-6 space-y-6">
                
                <div className="flex items-center justify-between mb-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                        <GraduationCap size={14} className="text-purple-400" />
                        <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">Academy Module</span>
                    </div>
                    {isAdmin && (
                        <button 
                            onClick={onOpenUpload}
                            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-full text-xs font-bold hover:bg-[#E5C048] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        >
                            <Upload size={14} /> Upload Video
                        </button>
                    )}
                </div>

                {hasLessons && currentLesson ? (
                    <>
                        <CustomVideoPlayer 
                            key={currentLesson.id + currentLesson.videoUrl} 
                            src={currentLesson.videoUrl} 
                            title={currentLesson.title}
                        />
                        
                        <div className="space-y-4 border-b border-white/5 pb-6">
                            <div className="relative">
                                <button 
                                    onClick={() => setIsLessonDropdownOpen(!isLessonDropdownOpen)}
                                    className="flex items-center gap-3 group text-left w-full"
                                >
                                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                                        {currentLesson.title}
                                    </h1>
                                    <ChevronDown 
                                        size={24} 
                                        className={`text-gray-500 transition-transform duration-300 ${isLessonDropdownOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} 
                                    />
                                </button>

                                {isLessonDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-full md:w-[400px] bg-[#18181b] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                                        <div className="p-3">
                                            <div className="text-[10px] uppercase font-bold text-gray-500 mb-2 px-2">Module Lessons</div>
                                            {lessons.map((lesson, idx) => (
                                                <div 
                                                    key={lesson.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-[#27272a] cursor-pointer group ${currentLessonIndex === idx ? 'bg-white/5' : ''}`}
                                                    onClick={() => {
                                                        setCurrentLessonIndex(idx);
                                                        setIsLessonDropdownOpen(false);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] ${currentLessonIndex === idx ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#09090b] text-gray-400 border-white/10 group-hover:text-white group-hover:border-[#D4AF37]'}`}>
                                                            {idx + 1}
                                                        </div>
                                                        <span className={`text-sm font-medium ${currentLessonIndex === idx ? 'text-[#D4AF37]' : 'text-gray-200 group-hover:text-white'}`}>{lesson.title}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-600 font-mono">{lesson.duration}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                {currentLesson.description}
                            </p>
                        </div>

                        <div className="space-y-4">
                             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Full Curriculum</h3>
                             
                             <div className="bg-[#18181b] rounded-xl border border-white/5 overflow-hidden">
                                <div className="p-4 bg-[#27272a]/50 border-b border-white/5 flex items-center justify-between">
                                    <span className="font-bold text-white text-sm">{activeChannel.name}</span>
                                    <span className="text-xs text-gray-500">{lessons.length} Lessons</span>
                                </div>
                                <div>
                                     {lessons.map((lesson, idx) => (
                                         <div 
                                            key={lesson.id} 
                                            className={`flex items-center gap-4 p-4 hover:bg-white/5 group border-b border-white/5 last:border-0 ${currentLessonIndex === idx ? 'bg-white/5' : ''}`}
                                         >
                                             <div 
                                                onClick={() => setCurrentLessonIndex(idx)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${currentLessonIndex === idx ? 'bg-[#D4AF37] text-black' : 'bg-[#09090b] text-gray-500 hover:text-white transition-colors'}`}
                                             >
                                                 {currentLessonIndex === idx ? <Video size={14} /> : <Lock size={14} />}
                                             </div>
                                             <div 
                                                onClick={() => setCurrentLessonIndex(idx)}
                                                className="flex-1 cursor-pointer"
                                             >
                                                 <div className={`text-sm font-medium ${currentLessonIndex === idx ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'}`}>
                                                     {lesson.title}
                                                 </div>
                                                 <div className="text-xs text-gray-600 mt-0.5">Duration: {lesson.duration}</div>
                                             </div>
                                             <div className="flex items-center gap-4">
                                                 {completedLessons.includes(lesson.id) ? (
                                                     <button 
                                                         onClick={(e) => {
                                                             e.stopPropagation();
                                                             onToggleLessonComplete(lesson.id);
                                                         }}
                                                         className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                                                         title="Mark as incomplete"
                                                     >
                                                         <Check size={14} />
                                                     </button>
                                                 ) : (
                                                     <button 
                                                         onClick={(e) => {
                                                             e.stopPropagation();
                                                             onToggleLessonComplete(lesson.id);
                                                         }}
                                                         className="w-6 h-6 rounded-full border border-gray-600 text-gray-600 flex items-center justify-center hover:border-green-500 hover:text-green-500 transition-colors"
                                                         title="Mark as complete"
                                                     >
                                                         <Check size={14} className="opacity-0 hover:opacity-100" />
                                                     </button>
                                                 )}
                                                 {currentLessonIndex === idx && (
                                                     <div className="px-2 py-1 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37]">PLAYING</div>
                                                 )}
                                                 {isAdmin && (
                                                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                         <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditClick(lesson);
                                                            }}
                                                            className="p-2 text-gray-600 hover:text-blue-500 transition-all hover:bg-blue-500/10 rounded-lg"
                                                            title="Edit Module"
                                                         >
                                                             <Edit2 size={16} />
                                                         </button>
                                                         <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
                                                                    onDeleteLesson(lesson.id);
                                                                }
                                                            }}
                                                            className="p-2 text-gray-600 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
                                                            title="Delete Module"
                                                         >
                                                             <Trash2 size={16} />
                                                         </button>
                                                     </div>
                                                 )}
                                             </div>
                                         </div>
                                     ))}
                                </div>
                             </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center border border-dashed border-white/10 rounded-3xl bg-[#121212]/50 animate-fade-in-up">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <AlertCircle size={32} className="text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Module Empty</h2>
                        <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                            No tactical briefings have been deployed to this sector of the Academy yet.
                        </p>
                        {isAdmin ? (
                            <button 
                                onClick={onOpenUpload}
                                className="px-6 py-3 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#E5C048] transition-all"
                            >
                                Initiate Briefing Upload
                            </button>
                        ) : (
                            <div className="px-4 py-2 bg-white/5 rounded-full border border-white/5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Awaiting Admin Deployment</span>
                            </div>
                        )}
                    </div>
                )}
                <div className="h-10"></div>
            </div>

            {/* Edit Lesson Modal */}
            {isEditModalOpen && editingLesson && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-[#181C25] rounded-xl overflow-hidden shadow-2xl animate-fade-in-up flex flex-col text-white font-sans border border-white/5">
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <h2 className="text-lg font-semibold">Edit Module</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Module Title</label>
                                <input 
                                    type="text" 
                                    value={editingLesson.title} 
                                    onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})}
                                    className="w-full bg-[#09090b] text-white text-sm rounded-lg p-3 border border-white/10 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                    placeholder="Enter module title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea 
                                    value={editingLesson.description} 
                                    onChange={(e) => setEditingLesson({...editingLesson, description: e.target.value})}
                                    className="w-full bg-[#09090b] text-white text-sm rounded-lg p-3 border border-white/10 focus:border-[#D4AF37] focus:outline-none transition-colors h-24 resize-none"
                                    placeholder="Enter module description"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Video URL</label>
                                <input 
                                    type="text" 
                                    value={editingLesson.videoUrl} 
                                    onChange={(e) => setEditingLesson({...editingLesson, videoUrl: e.target.value})}
                                    className="w-full bg-[#09090b] text-white text-sm rounded-lg p-3 border border-white/10 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                    placeholder="Enter video URL"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Duration</label>
                                <input 
                                    type="text" 
                                    value={editingLesson.duration} 
                                    onChange={(e) => setEditingLesson({...editingLesson, duration: e.target.value})}
                                    className="w-full bg-[#09090b] text-white text-sm rounded-lg p-3 border border-white/10 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                    placeholder="e.g. 10:00"
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2 bg-[#D4AF37] text-black text-sm font-bold rounded-lg hover:bg-[#E5C048] transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const TaskBoard: React.FC<{ 
    onToggleMobileMenu: () => void;
    tasks: Task[];
    onAddTask: (title: string) => void;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
}> = ({ onToggleMobileMenu, tasks, onAddTask, onToggleTask, onDeleteTask }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        onAddTask(newTaskTitle);
        setNewTaskTitle('');
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    return (
        <div className="flex flex-col h-full bg-[#09090b] text-white overflow-y-auto">
            <div className="md:hidden h-[60px] flex items-center px-4 border-b border-white/10 bg-[#18181b] shrink-0 sticky top-0 z-30">
                <button onClick={onToggleMobileMenu} className="mr-4 text-gray-400 hover:text-white">
                    <LayoutGrid size={24} />
                </button>
                <span className="font-bold text-sm truncate">Active Missions</span>
            </div>

            <div className="max-w-4xl mx-auto w-full p-4 md:p-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                            <Shield size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Mission Control</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Tactical Objectives</h1>
                        <p className="text-gray-500 max-w-md">Track your progress and dominate your daily goals. No excuses.</p>
                    </div>
                    <div className="bg-[#18181b] border border-white/5 p-6 rounded-2xl min-w-[200px]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progress</span>
                            <span className="text-xs font-bold text-[#D4AF37]">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                            <div className="h-full bg-[#D4AF37] transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="mt-3 text-[10px] text-gray-600 font-medium">
                            {completedCount} of {tasks.length} objectives secured
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="relative group">
                    <input 
                        type="text" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Define new mission objective..."
                        className="w-full bg-[#18181b] border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all shadow-2xl"
                    />
                    <button 
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#D4AF37] text-black rounded-xl flex items-center justify-center hover:bg-[#E5C048] transition-all"
                    >
                        <Plus size={20} />
                    </button>
                </form>

                <div className="space-y-3">
                    {tasks.length > 0 ? (
                        tasks.sort((a, b) => Number(a.completed) - Number(b.completed)).map(task => (
                            <div 
                                key={task.id}
                                className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all ${task.completed ? 'bg-black/40 border-white/5 opacity-60' : 'bg-[#18181b] border-white/10 hover:border-[#D4AF37]/30'}`}
                            >
                                <button 
                                    onClick={() => onToggleTask(task.id)}
                                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-gray-600 hover:border-[#D4AF37]'}`}
                                >
                                    {task.completed && <CheckCircle2 size={14} />}
                                </button>
                                <div className="flex-1">
                                    <h3 className={`text-base font-medium transition-all ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 text-[10px] text-gray-600">
                                            <Calendar size={10} />
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onDeleteTask(task.id)}
                                    className="p-2 text-gray-600 hover:text-red-500 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[32px]">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy size={32} className="text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Active Missions</h3>
                            <p className="text-gray-500">Define your objectives and start dominating.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const CourseCatalog: React.FC<{
    onToggleMobileMenu: () => void;
    enrolledCourseIds: string[];
    onEnroll: (courseId: string) => void;
    courses: Course[];
    isAdmin: boolean;
    onEditCourse: (course: Course) => void;
    bookmarks: string[];
    onToggleBookmark: (courseId: string) => void;
    completedLessons: string[];
    academyLessons: Record<string, Lesson[]>;
}> = ({ onToggleMobileMenu, enrolledCourseIds, onEnroll, courses, isAdmin, onEditCourse, bookmarks, onToggleBookmark, completedLessons, academyLessons }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'bookmarks'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             course.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeTab === 'in-progress') {
            return matchesSearch && enrolledCourseIds.includes(course.id);
        }
        if (activeTab === 'bookmarks') {
            return matchesSearch && bookmarks.includes(course.id);
        }
        return matchesSearch;
    });

    return (
        <div className="flex flex-col h-full bg-[#09090b] text-white overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#09090b] shrink-0 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button onClick={onToggleMobileMenu} className="md:hidden text-gray-400 hover:text-white">
                        <LayoutGrid size={24} />
                    </button>
                    <div className="flex items-center gap-3">
                        <ShoppingCart size={32} className="text-[#D4AF37]" />
                        <div>
                            <div className="text-xs text-gray-400">Learning Center</div>
                            <h1 className="text-2xl font-bold text-white leading-tight">Academy</h1>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative cursor-pointer">
                        <Bell size={20} className="text-gray-400 hover:text-white transition-colors" />
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#09090b]">3</div>
                    </div>
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search lessons" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border border-white/10 rounded-md py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-white/30 w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto w-full p-6 space-y-6">
                {/* Tabs */}
                <div className="grid grid-cols-3 gap-4">
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-md font-semibold text-sm transition-all ${activeTab === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                    >
                        <LayoutGrid size={16} /> Categories
                    </button>
                    <button 
                        onClick={() => setActiveTab('in-progress')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-md font-semibold text-sm transition-all ${activeTab === 'in-progress' ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                    >
                        <RotateCw size={16} /> In Progress
                    </button>
                    <button 
                        onClick={() => setActiveTab('bookmarks')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-md font-semibold text-sm transition-all ${activeTab === 'bookmarks' ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                    >
                        <Bookmark size={16} /> Bookmarks
                    </button>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCourses.map(course => {
                        const isEnrolled = enrolledCourseIds.includes(course.id);
                        const isBookmarked = bookmarks.includes(course.id);
                        return (
                            <div key={course.id} className="bg-[#18181b] border border-white/5 rounded-lg p-6 flex flex-col hover:border-white/10 transition-all group relative">
                                <button 
                                    onClick={() => onToggleBookmark(course.id)}
                                    className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${isBookmarked ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-gray-500 hover:text-white bg-black/20'}`}
                                >
                                    <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                                </button>
                                
                                <div className="flex items-start gap-4 mb-8">
                                    <div className="text-4xl shrink-0 mt-1">
                                        {course.thumbnail}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white mb-1 truncate">{course.title}</h3>
                                        <p className="text-sm text-gray-400 leading-snug line-clamp-2">{course.description}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{course.lessonsCount} Lessons</span>
                                        <span>{course.duration}</span>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#D4AF37]" style={{ width: isEnrolled ? `${Math.round((completedLessons.filter(lId => academyLessons[course.id]?.some(l => l.id === lId)).length / (course.lessonsCount || 1)) * 100)}%` : '0%' }}></div>
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">{isEnrolled ? `${Math.round((completedLessons.filter(lId => academyLessons[course.id]?.some(l => l.id === lId)).length / (course.lessonsCount || 1)) * 100)}%` : '0%'} complete</div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        {isAdmin && (
                                            <button 
                                                onClick={() => onEditCourse(course)}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => onEnroll(course.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-all ml-auto ${isEnrolled ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                                        >
                                            {isEnrolled ? 'Continue' : 'Start Course'} <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {filteredCourses.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, id }) => {
  const [servers, setServers] = useState<Server[]>(() => {
    const saved = localStorage.getItem('servers');
    let baseServers = saved ? JSON.parse(saved) : SERVERS;
    
    // Ensure enrolled courses are in the sidebar
    const enrolledIds = JSON.parse(localStorage.getItem('enrolledCourseIds') || '[]');
    const allCourses = JSON.parse(localStorage.getItem('courses') || JSON.stringify(COURSES));
    
    if (enrolledIds.length > 0) {
        baseServers = baseServers.map((s: Server) => {
            if (s.id === 'academy-server') {
                let myCoursesCat = s.categories.find(cat => cat.id === 'aca-my-courses');
                if (!myCoursesCat) {
                    myCoursesCat = { id: 'aca-my-courses', name: 'MY TRAINING', channels: [] };
                    // Insert after DISCOVERY
                    const discoveryIdx = s.categories.findIndex(cat => cat.id === 'aca-browse');
                    s.categories.splice(discoveryIdx + 1, 0, myCoursesCat);
                }
                
                enrolledIds.forEach((id: string) => {
                    const course = allCourses.find((c: Course) => c.id === id);
                    if (course && !myCoursesCat!.channels.find(ch => ch.id === `course-${id}`)) {
                        myCoursesCat!.channels.push({
                            id: `course-${id}`,
                            name: course.title,
                            type: 'video',
                            courseId: id,
                            description: course.description
                        });
                    }
                });
            }
            return s;
        });
    }
    
    return baseServers;
  });

  const updateServers = (newServers: Server[] | ((prev: Server[]) => Server[])) => {
    setServers(prev => {
      const updated = typeof newServers === 'function' ? newServers(prev) : newServers;
      localStorage.setItem('servers', JSON.stringify(updated));
      return updated;
    });
  };

  const [activeServerId, setActiveServerId] = useState<string>(servers[0].id);
  const [activeChannelId, setActiveChannelId] = useState<string>(servers[0].categories[0].channels[0].id);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [channelSearchQuery, setChannelSearchQuery] = useState('');
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [selectedUsersForNewMessage, setSelectedUsersForNewMessage] = useState<string[]>([]);
  const [dmChannels, setDmChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('dmChannels');
    return saved ? JSON.parse(saved) : [];
  });

  const updateDmChannels = (newChannels: Channel[] | ((prev: Channel[]) => Channel[])) => {
    setDmChannels(prev => {
      const updated = typeof newChannels === 'function' ? newChannels(prev) : newChannels;
      localStorage.setItem('dmChannels', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCreateDM = (userId: string) => {
    const existing = dmChannels.find(c => c.recipientId === userId);
    if (existing) {
      setActiveChannelId(existing.id);
    } else {
      const user = MEMBERS.find(m => m.id === userId);
      if (!user) return;
      const newChannel: Channel = {
        id: `dm-${userId}-${Date.now()}`,
        name: user.name,
        type: 'dm',
        recipientId: userId,
        description: `Direct message with ${user.name}`
      };
      updateDmChannels(prev => [...prev, newChannel]);
      setActiveChannelId(newChannel.id);
    }
    setIsNewMessageModalOpen(false);
    setSelectedUsersForNewMessage([]);
  };

  const handleCreateGroup = () => {
    if (selectedUsersForNewMessage.length === 0) return;
    
    if (selectedUsersForNewMessage.length === 1) {
      handleCreateDM(selectedUsersForNewMessage[0]);
      return;
    }

    const members = [...selectedUsersForNewMessage];
    const memberNames = members.map(id => MEMBERS.find(m => m.id === id)?.name).filter(Boolean);
    const newChannel: Channel = {
      id: `group-${Date.now()}`,
      name: memberNames.join(', ').slice(0, 30) + (memberNames.join(', ').length > 30 ? '...' : ''),
      type: 'group',
      members: members,
      description: `Group chat with ${memberNames.join(', ')}`
    };
    updateDmChannels(prev => [...prev, newChannel]);
    setActiveChannelId(newChannel.id);
    setIsNewMessageModalOpen(false);
    setSelectedUsersForNewMessage([]);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [notifySettings, setNotifySettings] = useState({ alerts: true, mentions: false, sound: false, muted: false });

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotifySettings(prev => ({ ...prev, alerts: true }));
    }
  };
  
  // User Profile Data
  const [profileData, setProfileData] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return {
        callsign: parsed.username || 'Recruit #8492',
        bio: parsed.bio || 'Just getting started in the Arena.',
        status: 'online',
        ghostMode: false,
        avatar: parsed.avatar
      };
    }
    return {
      callsign: 'Recruit #8492',
      bio: 'Just getting started in the Arena.',
      status: 'online',
      ghostMode: false,
      avatar: undefined
    };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', bio: '', avatar: '' });

  const handleEditProfileClick = () => {
    setEditForm({ 
      username: profileData.callsign, 
      bio: profileData.bio,
      avatar: profileData.avatar || ''
    });
    setIsEditingProfile(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update localStorage for persistence across reloads and for WarRoomAI
    const savedUser = localStorage.getItem('user');
    const userObj = savedUser ? JSON.parse(savedUser) : { id: 'user-' + Date.now() };
    
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userObj.id,
          username: editForm.username,
          bio: editForm.bio,
          avatar: editForm.avatar
        })
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        const updatedProfile = { 
          ...profileData, 
          callsign: updatedUser.username, 
          bio: updatedUser.bio,
          avatar: updatedUser.avatar
        };
        setProfileData(updatedProfile);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setIsEditingProfile(false);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Connection error');
    }
  };

  // User Role Logic
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAdmin = currentUser && ['Admin', 'General', 'Co-Admin'].includes(currentUser.role);

  const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', description: '', videoUrl: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];
  const activeChannel = [...activeServer.categories.flatMap(c => c.channels), ...dmChannels].find(ch => ch.id === activeChannelId) || activeServer.categories[0].channels[0];

  const [channelHistories, setChannelHistories] = useState<Record<string, ExtendedChatMessage[]>>(() => {
    const saved = localStorage.getItem('channelHistories');
    return saved ? JSON.parse(saved) : {};
  });

  const updateChannelHistory = (channelId: string, messages: ExtendedChatMessage[]) => {
      setChannelHistories(prev => {
          const newState = { ...prev, [channelId]: messages };
          localStorage.setItem('channelHistories', JSON.stringify(newState));
          return newState;
      });
  };

  const [readUpdateTrigger, setReadUpdateTrigger] = useState(0);
  const handleReadUpdate = () => setReadUpdateTrigger(prev => prev + 1);

  const getUnreadCount = (channelId: string) => {
    if (channelId === activeChannelId) return 0;
    const history = channelHistories[channelId] || [];
    const saved = localStorage.getItem(`lastRead_${channelId}`);
    const lastRead = saved ? parseInt(saved) : 0;
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    
    return history.filter(m => 
      m.senderName !== currentUser?.username && 
      new Date(m.timestamp).getTime() > lastRead
    ).length;
  };

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const updateTasks = (newTasks: Task[] | ((prev: Task[]) => Task[])) => {
      setTasks(prev => {
          const updated = typeof newTasks === 'function' ? newTasks(prev) : newTasks;
          localStorage.setItem('tasks', JSON.stringify(updated));
          return updated;
      });
  };

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('enrolledCourseIds');
    return saved ? JSON.parse(saved) : [];
  });

  const updateEnrolledCourseIds = (newIds: string[] | ((prev: string[]) => string[])) => {
      setEnrolledCourseIds(prev => {
          const updated = typeof newIds === 'function' ? newIds(prev) : newIds;
          localStorage.setItem('enrolledCourseIds', JSON.stringify(updated));
          return updated;
      });
  };

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('completedLessons');
    return saved ? JSON.parse(saved) : [];
  });

  const updateCompletedLessons = (newIds: string[] | ((prev: string[]) => string[])) => {
      setCompletedLessons(prev => {
          const updated = typeof newIds === 'function' ? newIds(prev) : newIds;
          localStorage.setItem('completedLessons', JSON.stringify(updated));
          return updated;
      });
  };

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : COURSES;
  });

  const updateCourses = (newCourses: Course[] | ((prev: Course[]) => Course[])) => {
    setCourses(prev => {
      const updated = typeof newCourses === 'function' ? newCourses(prev) : newCourses;
      localStorage.setItem('courses', JSON.stringify(updated));
      return updated;
    });
  };

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleBookmark = (courseId: string) => {
    setBookmarks(prev => {
      const updated = prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId];
      localStorage.setItem('bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const [isCourseEditModalOpen, setIsCourseEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleEditCourseClick = (course: Course) => {
    setEditingCourse(course);
    setIsCourseEditModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
        updateCourses(prev => prev.map(c => c.id === editingCourse.id ? editingCourse : c));
        
        // Update channel name if it exists
        updateServers(prev => prev.map(s => {
            if (s.id === 'academy-server') {
                return {
                    ...s,
                    categories: s.categories.map(cat => ({
                        ...cat,
                        channels: cat.channels.map(ch => 
                            ch.courseId === editingCourse.id ? { ...ch, name: editingCourse.title, description: editingCourse.description } : ch
                        )
                    }))
                };
            }
            return s;
        }));
        
        setIsCourseEditModalOpen(false);
        setEditingCourse(null);
    }
  };

  const [academyLessons, setAcademyLessons] = useState<Record<string, Lesson[]>>(() => {
    const saved = localStorage.getItem('academyLessons');
    return saved ? JSON.parse(saved) : {};
  });

  const updateAcademyLessons = (newLessons: Record<string, Lesson[]> | ((prev: Record<string, Lesson[]>) => Record<string, Lesson[]>)) => {
      setAcademyLessons(prev => {
          const updated = typeof newLessons === 'function' ? newLessons(prev) : newLessons;
          localStorage.setItem('academyLessons', JSON.stringify(updated));
          return updated;
      });
  };

  const handleDeleteLesson = (lessonId: string) => {
    updateAcademyLessons(prev => ({
        ...prev,
        [activeChannelId]: (prev[activeChannelId] || []).filter(l => l.id !== lessonId)
    }));
  };

  const handleEditLesson = (lessonId: string, updatedData: Partial<Lesson>) => {
    updateAcademyLessons(prev => ({
        ...prev,
        [activeChannelId]: (prev[activeChannelId] || []).map(l => 
            l.id === lessonId ? { ...l, ...updatedData } : l
        )
    }));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title) return;

    setIsUploading(true);

    const videoFile = videoInputRef.current?.files?.[0];
    let finalVideoUrl = uploadData.videoUrl || sampleVideoUrl;

    if (videoFile) {
        finalVideoUrl = URL.createObjectURL(videoFile);
    }

    setTimeout(() => {
        const newLesson: Lesson = {
            id: Date.now().toString(),
            title: uploadData.title,
            description: uploadData.description,
            videoUrl: finalVideoUrl,
            duration: '10:00'
        };

        updateAcademyLessons(prev => ({
            ...prev,
            [activeChannelId]: [...(prev[activeChannelId] || []), newLesson]
        }));

        setIsUploading(false);
        setIsUploadModalOpen(false);
        setUploadData({ title: '', description: '', videoUrl: '' });
        setSelectedFileName(null);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setSelectedFileName(file ? file.name : null);
  };

  const filteredCategories = activeServer.categories.map(category => {
    if (!channelSearchQuery.trim()) return category;
    const matchingChannels = category.channels.filter(channel => 
        channel.name.toLowerCase().includes(channelSearchQuery.toLowerCase()) || 
        (channel.description && channel.description.toLowerCase().includes(channelSearchQuery.toLowerCase()))
    );
    if (matchingChannels.length > 0) return { ...category, channels: matchingChannels };
    if (category.name.toLowerCase().includes(channelSearchQuery.toLowerCase())) return category;
    return null;
  }).filter(Boolean) as typeof activeServer.categories;

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };
  
  const handleChannelSelect = (channelId: string) => {
      setActiveChannelId(channelId);
      setIsMobileMenuOpen(false);
  };

  const handleServerSelect = (serverId: string) => {
      const server = servers.find(s => s.id === serverId);
      if (server) {
          setActiveServerId(serverId);
          setActiveChannelId(server.categories[0].channels[0].id);
          setChannelSearchQuery('');
      }
  };

  const handleAddTask = (title: string) => {
      const newTask: Task = {
          id: Date.now().toString(),
          title,
          completed: false,
          createdAt: new Date()
      };
      updateTasks(prev => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
      updateTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
      updateTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleEnroll = (courseId: string) => {
      if (!enrolledCourseIds.includes(courseId)) {
          updateEnrolledCourseIds(prev => [...prev, courseId]);
          
          // Add channel to Academy server
          const course = courses.find(c => c.id === courseId);
          if (course) {
              const newChannel: Channel = {
                  id: `course-${courseId}`,
                  name: course.title,
                  type: 'video',
                  courseId: courseId,
                  description: course.description
              };
              
              updateServers(prev => prev.map(s => {
                  if (s.id === 'academy-server') {
                      let categories = [...s.categories];
                      let myCoursesCat = categories.find(cat => cat.id === 'aca-my-courses');
                      
                      if (!myCoursesCat) {
                          myCoursesCat = { id: 'aca-my-courses', name: 'MY TRAINING', channels: [] };
                          const discoveryIdx = categories.findIndex(cat => cat.id === 'aca-browse');
                          categories.splice(discoveryIdx + 1, 0, myCoursesCat);
                      }
                      
                      if (!myCoursesCat.channels.find(ch => ch.id === newChannel.id)) {
                          myCoursesCat.channels = [...myCoursesCat.channels, newChannel];
                      }
                      
                      return { ...s, categories };
                  }
                  return s;
              }));
              
              setActiveChannelId(newChannel.id);
          }
      } else {
          // Already enrolled, just switch to the channel
          setActiveChannelId(`course-${courseId}`);
      }
      setIsMobileMenuOpen(false);
  };

  const handleToggleLessonComplete = (lessonId: string) => {
      updateCompletedLessons(prev => 
          prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
      );
  };
  
  const getChannelIcon = (type: string, name: string, id: string) => {
    if (type === 'dm') {
      const channel = dmChannels.find(c => c.id === id);
      const user = MEMBERS.find(m => m.id === channel?.recipientId);
      if (user) {
        return (
          <div className="relative">
            <img src={user.avatar} className="w-4 h-4 rounded-full" />
            <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-[#18181b] ${user.status === 'online' ? 'bg-emerald-500' : user.status === 'dnd' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
          </div>
        );
      }
      return <User size={16} />;
    }
    if (type === 'group') return <Users size={16} className="text-purple-400" />;
    if (id.includes('wins')) return <Trophy size={16} className="text-[#D4AF37]" />;
    if (id.includes('war-room')) return <Swords size={16} className="text-red-500" />;
    if (id.includes('announcements')) return <Megaphone size={16} className="text-blue-400" />;
    if (id.includes('general')) return <MessageCircle size={16} />;
    if (id.includes('lounge')) return <Radio size={16} />;
    if (type === 'tasks') return <CheckCircle2 size={16} className="text-emerald-400" />;
    if (type === 'catalog') return <BookOpen size={16} className="text-[#D4AF37]" />;
    if (type === 'strategy-board') return <AlertTriangle size={16} className="text-amber-400" />;
    switch (type) {
        case 'voice': return <Mic size={16} />;
        case 'announcement': return <Megaphone size={16} />;
        case 'board': return <LayoutDashboard size={16} />;
        case 'video': return <PlayCircle size={16} className="text-purple-400" />;
        default: return <Hash size={16} />;
    }
  };

  return (
    <div id={id} className="fixed inset-0 w-full h-[100dvh] bg-[#000000] overflow-hidden flex items-center justify-center z-[100]">
      {isAdminPortalOpen ? (
        <AdminPortal 
          currentUser={currentUser} 
          onBack={() => setIsAdminPortalOpen(false)} 
        />
      ) : (
        <>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#18181b] rounded-full blur-[180px] opacity-20"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#27272a] rounded-full blur-[180px] opacity-20"></div>
      </div>

      <div className="flex h-full w-full max-w-[1800px] mx-auto bg-[#000000] md:border-x md:border-white/5 relative shadow-2xl">
        {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}/>
        )}

                {/* Sidebar Navigation */}
                <div className={`fixed inset-y-0 left-0 z-50 flex h-full transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="w-[72px] bg-[#18181b] flex flex-col items-center py-4 gap-3 border-r border-black/20 h-full">
                        {servers.map((server) => {
                            const isActive = server.id === activeServerId;
                            return (
                                <div key={server.id} className="relative group flex items-center justify-center w-full">
                                    <div className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 ${isActive ? 'h-10' : 'h-0 group-hover:h-4'}`}></div>
                                    <button onClick={() => handleServerSelect(server.id)} className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-300 relative ${isActive ? 'rounded-[16px]' : 'group-hover:rounded-[16px]'}`}>
                                        <div className={`w-full h-full flex items-center justify-center transition-colors ${isActive ? 'bg-[#27272a]' : 'bg-[#242f3d] group-hover:bg-[#27272a]'}`}>
                                            <server.iconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                        </div>
                                    </button>
                                </div>
                            )
                        })}
                <div className="mt-auto w-8 h-[1px] bg-white/10 rounded-full"></div>
                <button 
                    onClick={() => isAdmin && setIsAdminPortalOpen(true)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAdmin ? 'text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black' : 'text-gray-600 cursor-not-allowed'}`}
                >
                    <ShieldAlert size={20} />
                </button>
            </div>

            {/* Channels Sidebar */}
            <div className="w-[260px] bg-[#18181b] flex flex-col border-r border-black/20 h-full">
                <div className="h-[60px] p-4 border-b border-black/10 flex items-center justify-between shadow-sm shrink-0">
                    <h2 className="font-bold text-white truncate text-lg">{activeServer.name}</h2>
                </div>
                <div className="px-4 py-3 shrink-0">
                    <div className="relative group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input type="text" placeholder="Find channel..." value={channelSearchQuery} onChange={(e) => setChannelSearchQuery(e.target.value)} className="w-full bg-[#09090b] text-white text-xs rounded-lg py-2 pl-8 pr-3 focus:outline-none placeholder-gray-600 border border-white/5"/>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin scrollbar-thumb-white/10">
                    {/* Direct Messages Section */}
                    <div className="mb-4">
                        <div className="px-2 mb-1 flex items-center justify-between group cursor-pointer text-gray-400 hover:text-white">
                            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
                                <MessageCircle size={10} />
                                DIRECT MESSAGES
                            </div>
                            <button onClick={() => setIsNewMessageModalOpen(true)} className="p-1 hover:bg-white/5 rounded transition-colors">
                                <Plus size={12} />
                            </button>
                        </div>
                        <div className="space-y-[2px] mt-1">
                            {dmChannels.map(channel => (
                                <div key={channel.id} onClick={() => handleChannelSelect(channel.id)} className={`group px-2 mx-1 py-[6px] flex items-center gap-2.5 cursor-pointer transition-all rounded-md ${channel.id === activeChannelId ? 'bg-[#27272a] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                                    <div className="relative shrink-0">
                                        {getChannelIcon(channel.type, channel.name, channel.id)}
                                        {getUnreadCount(channel.id) > 0 && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#18181b]"></div>
                                        )}
                                    </div>
                                    <span className={`text-[14px] truncate flex-1 ${getUnreadCount(channel.id) > 0 ? 'font-bold text-white' : ''}`}>{channel.name}</span>
                                    {getUnreadCount(channel.id) > 0 && (
                                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {getUnreadCount(channel.id)}
                                        </span>
                                    )}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateDmChannels(prev => prev.filter(c => c.id !== channel.id));
                                            if (activeChannelId === channel.id) {
                                                setActiveChannelId(SERVERS[0].categories[0].channels[0].id);
                                            }
                                        }}
                                        className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {dmChannels.length === 0 && (
                                <div className="px-3 py-2 text-[10px] text-gray-600 italic">No active messages</div>
                            )}
                        </div>
                    </div>

                    {filteredCategories.map(category => (
                        <div key={category.id} className="mb-4">
                            <div onClick={() => toggleCategory(category.id)} className="px-2 mb-1 flex items-center justify-between group cursor-pointer text-gray-400 hover:text-white">
                                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
                                    <ChevronDown size={10} className={`transform transition-transform ${expandedCategories[category.id] ? '-rotate-90' : ''}`} />
                                    {category.name}
                                </div>
                                {isAdmin && <Plus size={10} className="opacity-0 group-hover:opacity-100" />}
                            </div>
                            {!expandedCategories[category.id] && (
                                <div className="space-y-[2px] mt-1">
                                    {category.channels.map(channel => (
                                        <div key={channel.id} onClick={() => handleChannelSelect(channel.id)} className={`group px-2 mx-1 py-[6px] flex items-center gap-2.5 cursor-pointer transition-all rounded-md ${channel.id === activeChannelId ? 'bg-[#27272a] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                                            <div className="relative shrink-0">
                                                {getChannelIcon(channel.type, channel.name, channel.id)}
                                                {getUnreadCount(channel.id) > 0 && (
                                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#18181b]"></div>
                                                )}
                                            </div>
                                            <span className={`text-[14px] truncate flex-1 ${getUnreadCount(channel.id) > 0 ? 'font-bold text-white' : ''}`}>{channel.name}</span>
                                            {getUnreadCount(channel.id) > 0 && (
                                                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                    {getUnreadCount(channel.id)}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-[#09090b] flex items-center gap-3 border-t border-black/10 shrink-0">
                    <div className="relative">
                        <img 
                            src={profileData.avatar || `https://ui-avatars.com/api/?name=${isAdmin ? 'Admin' : 'Recruit'}&background=${isAdmin ? 'D4AF37' : '27272a'}&color=${isAdmin ? '000' : 'fff'}`} 
                            className="w-10 h-10 rounded-full object-cover border border-white/10" 
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 ${profileData.ghostMode ? 'bg-gray-500' : 'bg-emerald-500'} rounded-full border-2 border-[#09090b]`}></div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[14px] font-bold text-white truncate">{isAdmin ? 'ADMIN COMMAND' : profileData.callsign}</span>
                        <span className="text-[11px] text-gray-400">{isAdmin ? 'Superuser' : profileData.ghostMode ? 'Invis' : 'Online'}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/10" title="Account Settings"><Settings size={16} /></button>
                        <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-400 rounded hover:bg-white/10" title="Log Out"><LogOut size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 bg-[#09090b] flex flex-col relative z-10 overflow-hidden w-full">
             {activeChannel.type === 'video' ? (
                 <CoursePlayer 
                    activeChannel={activeChannel}
                    lessons={academyLessons[activeChannel.id] || []} 
                    onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
                    isAdmin={isAdmin}
                    onOpenUpload={() => setIsUploadModalOpen(true)}
                    onDeleteLesson={handleDeleteLesson}
                    onEditLesson={handleEditLesson}
                    isEnrolled={activeChannel.courseId ? enrolledCourseIds.includes(activeChannel.courseId) : true}
                    onEnroll={() => activeChannel.courseId && handleEnroll(activeChannel.courseId)}
                    completedLessons={completedLessons}
                    onToggleLessonComplete={handleToggleLessonComplete}
                 />
             ) : activeChannel.type === 'tasks' ? (
                 <TaskBoard 
                    onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
                    tasks={tasks}
                    onAddTask={handleAddTask}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                 />
             ) : activeChannel.type === 'catalog' ? (
                 <CourseCatalog 
                    onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
                    enrolledCourseIds={enrolledCourseIds}
                    onEnroll={handleEnroll}
                    courses={courses}
                    isAdmin={isAdmin}
                    onEditCourse={handleEditCourseClick}
                    bookmarks={bookmarks}
                    onToggleBookmark={toggleBookmark}
                    completedLessons={completedLessons}
                    academyLessons={academyLessons}
                 />
             ) : activeChannel.type === 'strategy-board' ? (
                 <StrategyAudits onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />
             ) : activeChannel.id === 'career-architect' ? (
                 <CareerArchitect onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />
             ) : activeChannel.type === 'wallet' ? (
                 <ErrorBoundary>
                    <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading Wallet...</div>}>
                        <CryptoWallet />
                    </Suspense>
                </ErrorBoundary>
             ) : (
                 <WarRoomAI 
                    key={activeChannel.id} 
                    channelId={activeChannel.id}
                    channelName={activeChannel.name}
                    channelDescription={activeChannel.description || `Tactical feed active`}
                    initialMessages={channelHistories[activeChannel.id] || []}
                    onMessagesUpdate={(msgs) => updateChannelHistory(activeChannel.id, msgs)}
                    onReadUpdate={handleReadUpdate}
                    onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
                    notifySettings={notifySettings}
                    videoBackground={activeChannel.id.includes('announcements') ? "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connection-3126-large.mp4" : undefined}
                    channelType={activeChannel.type}
                 />
             )}
        </div>
      </div>

      {/* New Message Modal */}
      {isNewMessageModalOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsNewMessageModalOpen(false)}></div>
              <div className="relative w-full max-w-[440px] bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                  <div className="p-6 border-b border-white/5">
                      <div className="flex items-center justify-between mb-1">
                          <h2 className="text-xl font-bold text-white">Select Friends</h2>
                          <button onClick={() => setIsNewMessageModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                              <X size={20} />
                          </button>
                      </div>
                      <p className="text-gray-500 text-xs">You can add more friends to create a group chat.</p>
                  </div>

                  <div className="p-2 max-h-[400px] overflow-y-auto">
                      <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Members</div>
                      {MEMBERS.map(member => (
                          <div 
                            key={member.id}
                            onClick={() => {
                                if (selectedUsersForNewMessage.includes(member.id)) {
                                    setSelectedUsersForNewMessage(prev => prev.filter(id => id !== member.id));
                                } else {
                                    setSelectedUsersForNewMessage(prev => [...prev, member.id]);
                                }
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedUsersForNewMessage.includes(member.id) ? 'bg-white/10' : 'hover:bg-white/5'}`}
                          >
                              <div className="relative">
                                  <img src={member.avatar} className="w-10 h-10 rounded-full" alt={member.name} />
                                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#18181b] ${member.status === 'online' ? 'bg-emerald-500' : member.status === 'dnd' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="font-bold text-sm text-white truncate">{member.name}</div>
                                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">{member.role}</div>
                              </div>
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedUsersForNewMessage.includes(member.id) ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-white/10 text-transparent'}`}>
                                  <Check size={12} strokeWidth={4} />
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="p-4 bg-[#09090b] border-t border-white/5 flex gap-3">
                      <button 
                        onClick={() => setIsNewMessageModalOpen(false)}
                        className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={selectedUsersForNewMessage.length > 1 ? handleCreateGroup : () => selectedUsersForNewMessage.length === 1 && handleCreateDM(selectedUsersForNewMessage[0])}
                        disabled={selectedUsersForNewMessage.length === 0}
                        className={`flex-[2] py-3 rounded-xl font-bold text-sm transition-all ${selectedUsersForNewMessage.length > 0 ? 'bg-[#D4AF37] text-black hover:bg-[#E5C048]' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                      >
                          {selectedUsersForNewMessage.length > 1 ? `Create Group (${selectedUsersForNewMessage.length})` : 'Start Chat'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Account Settings Modal */}
      {isSettingsOpen && (
          <div className="fixed inset-0 z-[300] flex justify-end">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
              <div className="relative w-full max-w-[400px] h-full bg-[#181C25] shadow-2xl animate-slide-in-right flex flex-col text-white font-sans border-l border-white/5">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        {isEditingProfile && (
                            <button onClick={() => setIsEditingProfile(false)} className="text-gray-400 hover:text-white mr-1">
                                <ChevronRight size={20} className="rotate-180" />
                            </button>
                        )}
                        <h2 className="text-lg font-semibold">{isEditingProfile ? 'Edit Profile' : 'Settings'}</h2>
                      </div>
                      <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                          <X size={20} />
                      </button>
                  </div>

                  {isEditingProfile ? (
                      <div className="p-6 flex-1 overflow-y-auto">
                          <form onSubmit={handleSaveProfile} className="space-y-6">
                              <div className="flex justify-center mb-6">
                                  <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                      <div className="w-24 h-24 rounded-full bg-[#323232] flex items-center justify-center text-3xl font-medium text-white overflow-hidden border-2 border-white/10 group-hover:border-[#D4AF37] transition-colors">
                                          {editForm.avatar ? <img src={editForm.avatar} alt="Avatar" className="w-full h-full object-cover" /> : "WA"}
                                      </div>
                                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Edit2 size={20} className="text-white" />
                                      </div>
                                      <input 
                                         id="avatar-upload"
                                         type="file"
                                         accept="image/*"
                                         className="hidden"
                                         onChange={handleAvatarChange}
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-[11px] font-bold text-[#3B82F6] tracking-wider uppercase mb-2">Username</label>
                                  <input 
                                      type="text" 
                                      value={editForm.username}
                                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                      className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50"
                                      placeholder="Enter username"
                                  />
                              </div>

                              <div>
                                  <label className="block text-[11px] font-bold text-[#3B82F6] tracking-wider uppercase mb-2">Bio</label>
                                  <textarea 
                                      value={editForm.bio}
                                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                      className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 h-24 resize-none"
                                      placeholder="Tell us about yourself"
                                  />
                              </div>

                              <button 
                                  type="submit"
                                  className="w-full py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-[#E5C048] transition-all shadow-lg mt-4"
                              >
                                  Save Changes
                              </button>
                          </form>
                      </div>
                  ) : (
                    <>
                      {/* Profile Section */}
                      <div className="p-5 flex items-center gap-4 border-b border-white/5">
                          <div className="relative">
                              <div className="w-16 h-16 rounded-full bg-[#323232] flex items-center justify-center text-2xl font-medium text-white overflow-hidden">
                                  {profileData.avatar ? <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" /> : "WA"}
                              </div>
                              <div className={`absolute bottom-0 right-0 w-4 h-4 ${profileData.ghostMode ? 'bg-gray-500' : 'bg-emerald-500'} border-2 border-[#181C25] rounded-full`}></div>
                          </div>
                          <div>
                              <h3 className="text-lg font-medium text-white">{profileData.callsign}</h3>
                              <p className="text-sm text-gray-400 truncate max-w-[200px]">{profileData.bio}</p>
                          </div>
                      </div>

                      <div className="flex-1 overflow-y-auto">
                          {/* Account Section */}
                          <div className="p-5">
                              <div className="text-[11px] font-bold text-[#3B82F6] tracking-wider uppercase mb-4">ACCOUNT</div>
                              
                              <button onClick={handleEditProfileClick} className="w-full flex items-center justify-between py-3 group">
                                  <div className="flex items-center gap-4">
                                      <User size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                                      <div className="text-left">
                                          <div className="text-[15px] font-medium text-white">Edit Profile</div>
                                          <div className="text-sm text-gray-400">Name, username, bio</div>
                                      </div>
                                  </div>
                                  <ChevronRight size={20} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
                              </button>

                          <div className="w-full flex items-center justify-between py-3 mt-2">
                              <div className="flex items-center gap-4">
                                  {profileData.ghostMode ? <EyeOff size={22} className="text-gray-400" /> : <Eye size={22} className="text-gray-400" />}
                                  <div className="text-left">
                                      <div className="text-[15px] font-medium text-white">Ghost Mode</div>
                                      <div className="text-sm text-gray-400">{profileData.ghostMode ? 'On' : 'Off'}</div>
                                  </div>
                              </div>
                              <div 
                                  className={`w-12 h-6 rounded-full relative flex items-center px-1 cursor-pointer transition-colors ${profileData.ghostMode ? 'bg-[#3B82F6]' : 'bg-gray-600'}`}
                                  onClick={() => setProfileData({...profileData, ghostMode: !profileData.ghostMode})}
                              >
                                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${profileData.ghostMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                              </div>
                          </div>
                      </div>

                      {/* Notifications Section */}
                      <div className="p-5 pt-2 border-t border-white/5">
                          <div className="text-[11px] font-bold text-[#3B82F6] tracking-wider uppercase mb-4">NOTIFICATIONS</div>

                          <div className="w-full flex items-center justify-between py-3">
                              <div className="flex items-center gap-4">
                                  <Bell size={22} className="text-gray-400" />
                                  <div className="text-left">
                                      <div className="text-[15px] font-medium text-white">Desktop Alerts</div>
                                      <div className="text-sm text-gray-400">Push notifications</div>
                                  </div>
                              </div>
                              <button 
                                  onClick={() => {
                                      if (!notifySettings.alerts) requestNotificationPermission();
                                      setNotifySettings(prev => ({ ...prev, alerts: !prev.alerts }));
                                  }}
                                  className={`w-12 h-6 rounded-full relative flex items-center px-1 cursor-pointer transition-colors ${notifySettings.alerts ? 'bg-[#3B82F6]' : 'bg-gray-600'}`}
                              >
                                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifySettings.alerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
                              </button>
                          </div>

                          <div className="w-full flex items-center justify-between py-3 mt-2">
                              <div className="flex items-center gap-4">
                                  <Volume2 size={22} className="text-gray-400" />
                                  <div className="text-left">
                                      <div className="text-[15px] font-medium text-white">Sound</div>
                                      <div className="text-sm text-gray-400">Play sound on message</div>
                                  </div>
                              </div>
                              <button 
                                  onClick={() => setNotifySettings(prev => ({ ...prev, sound: !prev.sound }))}
                                  className={`w-12 h-6 rounded-full relative flex items-center px-1 cursor-pointer transition-colors ${notifySettings.sound ? 'bg-[#3B82F6]' : 'bg-gray-600'}`}
                              >
                                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifySettings.sound ? 'translate-x-6' : 'translate-x-0'}`}></div>
                              </button>
                          </div>

                          <div className="w-full flex items-center justify-between py-3 mt-2">
                              <div className="flex items-center gap-4">
                                  <Hash size={22} className="text-gray-400" />
                                  <div className="text-left">
                                      <div className="text-[15px] font-medium text-white">Mentions Only</div>
                                      <div className="text-sm text-gray-400">Only notify when mentioned</div>
                                  </div>
                              </div>
                              <button 
                                  onClick={() => setNotifySettings(prev => ({ ...prev, mentions: !prev.mentions }))}
                                  className={`w-12 h-6 rounded-full relative flex items-center px-1 cursor-pointer transition-colors ${notifySettings.mentions ? 'bg-[#3B82F6]' : 'bg-gray-600'}`}
                              >
                                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifySettings.mentions ? 'translate-x-6' : 'translate-x-0'}`}></div>
                              </button>
                          </div>
                      </div>

                      {/* Appearance Section */}
                      <div className="p-5 pt-2 border-t border-white/5">
                          <div className="text-[11px] font-bold text-[#3B82F6] tracking-wider uppercase mb-4">APPEARANCE</div>
                          
                          <div className="w-full flex items-center justify-between py-3">
                              <div className="flex items-center gap-4">
                                  <Moon size={22} className="text-gray-400" />
                                  <div className="text-left">
                                      <div className="text-[15px] font-medium text-white">Dark Mode</div>
                                      <div className="text-sm text-gray-400">On</div>
                                  </div>
                              </div>
                              <div className="w-12 h-6 bg-[#3B82F6] rounded-full relative flex items-center px-1 cursor-pointer">
                                  <div className="w-4 h-4 bg-white rounded-full translate-x-6 transition-transform"></div>
                              </div>
                          </div>

                          <button className="w-full flex items-center justify-between py-3 mt-2 group">
                              <div className="flex items-center gap-4">
                                  <Globe size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                                  <div className="text-left">
                                      <div className="text-[15px] font-medium text-white">Language</div>
                                      <div className="text-sm text-gray-400">🇺🇸 English</div>
                                  </div>
                              </div>
                              <ChevronRight size={20} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
                          </button>
                      </div>
                  </div>
                  </>
                  )}

                  {/* Footer */}
                  <div className="p-4 border-t border-white/5 text-center bg-[#151921]">
                      <span className="text-sm text-gray-500">The Arena v1.0.0</span>
                  </div>
              </div>
          </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsUploadModalOpen(false)}></div>
              <div className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-fade-in-up">
                  <div className="p-8">
                      <div className="flex justify-between items-center mb-8">
                          <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                                  <FileVideo className="text-[#D4AF37]" size={24} />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-white">Upload New Lesson</h3>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Command Control</p>
                              </div>
                          </div>
                          <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                      </div>

                      <form onSubmit={handleUploadSubmit} className="space-y-6">
                          <div>
                              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Lesson Title</label>
                              <input 
                                  required
                                  value={uploadData.title}
                                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                                  className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50" 
                                  placeholder="e.g. Master Your Focus"
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Description</label>
                              <textarea 
                                  required
                                  value={uploadData.description}
                                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                                  className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 h-24 resize-none" 
                                  placeholder="What will the recruits learn?"
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Video File</label>
                              <div 
                                onClick={() => videoInputRef.current?.click()}
                                className="w-full h-32 bg-[#09090b] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37]/30 transition-all overflow-hidden"
                              >
                                  {selectedFileName ? (
                                      <div className="flex flex-col items-center px-4">
                                          <FileVideo size={32} className="text-[#D4AF37] mb-2" />
                                          <span className="text-xs text-white font-medium text-center truncate w-full">{selectedFileName}</span>
                                          <span className="text-[10px] text-gray-500 mt-1">Ready for deployment</span>
                                      </div>
                                  ) : (
                                      <>
                                          <Upload size={24} className="text-gray-600 mb-2" />
                                          <span className="text-xs text-gray-500">Click to upload .mp4 or .mov</span>
                                      </>
                                  )}
                                  <input 
                                    type="file" 
                                    ref={videoInputRef} 
                                    className="hidden" 
                                    accept="video/*" 
                                    onChange={handleFileChange}
                                  />
                              </div>
                          </div>
                          <div className="pt-2">
                                <button 
                                    type="submit"
                                    disabled={isUploading}
                                    className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-[#E5C048] flex items-center justify-center gap-2 transition-all shadow-lg"
                                >
                                    {isUploading ? <Loader2 className="animate-spin" /> : 'Deploy Lesson to Academy'}
                                </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      )}

      {/* Course Edit Modal */}
      {isCourseEditModalOpen && editingCourse && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsCourseEditModalOpen(false)}></div>
              <div className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-fade-in-up">
                  <div className="p-8">
                      <div className="flex justify-between items-center mb-8">
                          <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                                  <Edit2 className="text-[#D4AF37]" size={24} />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-white">Edit Course</h3>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Academy Management</p>
                              </div>
                          </div>
                          <button onClick={() => setIsCourseEditModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                      </div>

                      <form onSubmit={handleSaveCourse} className="space-y-6">
                          <div>
                              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Course Title</label>
                              <input 
                                  required
                                  value={editingCourse.title}
                                  onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                                  className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50" 
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Description</label>
                              <textarea 
                                  required
                                  value={editingCourse.description}
                                  onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                                  className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 h-24 resize-none" 
                              />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Thumbnail (Emoji)</label>
                                  <input 
                                      value={editingCourse.thumbnail}
                                      onChange={(e) => setEditingCourse({...editingCourse, thumbnail: e.target.value})}
                                      className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50" 
                                  />
                              </div>
                              <div>
                                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Category</label>
                                  <input 
                                      value={editingCourse.category}
                                      onChange={(e) => setEditingCourse({...editingCourse, category: e.target.value})}
                                      className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50" 
                                  />
                              </div>
                          </div>
                          <div className="pt-2">
                                <button 
                                    type="submit"
                                    className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-[#E5C048] transition-all shadow-lg"
                                >
                                    Save Course Changes
                                </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
