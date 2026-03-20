import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Palette, Sparkles, Files, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import Generator from './Generator';
import PosterEditor from './PosterEditor';
import LogoGenerator from './LogoGenerator';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate back to login
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold font-montserrat text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            PostGen AI
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition">
            <LayoutDashboard className="h-5 w-5 text-gray-400" />
            Overview
          </Link>
          <Link to="/generator" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition">
            <Sparkles className="h-5 w-5 text-gray-400" />
            Post Generator
          </Link>
          <Link to="/logo" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition">
            <Palette className="h-5 w-5 text-gray-400" />
            Logo Designing
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
          <div className="bg-primary/5 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">FREE PLAN</span>
              <button className="text-xs text-secondary hover:underline">Upgrade</button>
            </div>
            <p className="text-sm text-gray-500 mt-1">5 posts / day limit</p>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition w-full"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <div className="text-sm text-gray-500">Welcome back!</div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">U</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/logo" element={<LogoGenerator />} />
            <Route path="/editor" element={<PosterEditor />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const DashboardHome = () => {
  const { user } = useAuth();
  const { getPosts, loading } = useFirestore();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getPosts(user.uid).then(setPosts);
    }
  }, [user, getPosts]);

  const totalPosts = posts.length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">Total Posts</h3>
          <p className="text-3xl font-bold mt-2 text-text">{totalPosts}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">Generated This Month</h3>
          <p className="text-3xl font-bold mt-2 text-text">{totalPosts}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">SaaS Plan</h3>
          <p className="text-2xl font-bold mt-2 text-primary">Free</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-text mt-8">Recent Posts</h3>
      {loading && <div className="text-sm text-gray-500 animate-pulse">Loading posts...</div>}
      {!loading && posts.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-sm text-gray-400">
          No posts generated yet. Start creating now!
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition">
             {post.posterImageURL && (
               <img src={post.posterImageURL} alt="Poster" className="aspect-square rounded-xl object-cover w-full bg-gray-50" />
             )}
             <div className="flex items-center justify-between">
               <span className="text-xs font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded-lg">{post.platform || 'Instagram'}</span>
               <span className="text-xs text-gray-400">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}</span>
             </div>
             <p className="text-xs text-gray-700 line-clamp-2">{post.caption || 'No caption'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
