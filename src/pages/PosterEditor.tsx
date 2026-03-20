import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import { toPng, toJpeg } from 'html-to-image';
import { 
  Type, Palette, ImageIcon, AlignLeft, AlignCenter, AlignRight, 
  Download, Copy, Save, Loader2, ArrowLeft, Upload, Check 
} from 'lucide-react';

export default function PosterEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveBrandKit, savePost } = useFirestore();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initial data from navigation state if available
  const initialData = location.state || {
    quote: "CONSISTENCY\nBEATS\nTALENT",
    subtitle: "Daily Motivation",
    tone: "Motivational",
    style: "Modern"
  };

  // Canvas State Controls
  const [quote, setQuote] = useState(initialData.quote);
  const [subtitle, setSubtitle] = useState(initialData.subtitle);
  const [title, setTitle] = useState(initialData.title || '');
  const [fontFamily, setFontFamily] = useState('Montserrat');
  const [fontSize, setFontSize] = useState(48);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textColor, setTextColor] = useState('#FFFFFF');
  
  // Background State Controls
  const [bgType, setBgType] = useState<'solid' | 'gradient' | 'image'>('gradient');
  const [bgColor, setBgColor] = useState('#6C63FF');
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #6C63FF 0%, #4A90E2 100%)');
  const [bgImage, setBgImage] = useState('');

  // Logo & Watermark
  const [showLogo, setShowLogo] = useState(true);
  const [logoURL, setLogoURL] = useState('');
  const [showWatermark, setShowWatermark] = useState(true);

  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'templates'>('edit');

  const templates = [
    {
      name: "Corporate Glow",
      bgType: "gradient", bgGradient: "linear-gradient(135deg, #6C63FF 0%, #4A90E2 100%)",
      textColor: "#FFFFFF", fontFamily: "Montserrat", textAlign: "center", fontSize: 48
    },
    {
      name: "Neon Midnight",
      bgType: "solid", bgColor: "#0F172A",
      textColor: "#38BDF8", fontFamily: "Inter", textAlign: "center", fontSize: 52
    },
    {
      name: "Sunset Classic",
      bgType: "gradient", bgGradient: "linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)",
      textColor: "#FFFFFF", fontFamily: "Playfair Display", textAlign: "center", fontSize: 56
    },
    {
      name: "Minimalist Ivory",
      bgType: "solid", bgColor: "#F8FAFC",
      textColor: "#1E293B", fontFamily: "Inter", textAlign: "left", fontSize: 40
    }
  ];

  const applyTemplate = (t: any) => {
    setBgType(t.bgType);
    if (t.bgColor) setBgColor(t.bgColor);
    if (t.bgGradient) setBgGradient(t.bgGradient);
    setTextColor(t.textColor);
    setFontFamily(t.fontFamily);
    setTextAlign(t.textAlign);
    setFontSize(t.fontSize || 48);
  };

  // Load Brand Kit & Image Settings from state if available
  useEffect(() => {
    if (location.state) {
      const state = location.state;
      if (state.brandKit?.logoURL) setLogoURL(state.brandKit.logoURL);
      if (state.brandKit?.primaryColor) setBgColor(state.brandKit.primaryColor);
      
      if (state.includeImage) {
        setBgType('image');
        if (state.manualImageUrl) {
          setBgImage(state.manualImageUrl);
        }
      }
    }
  }, [location.state]);

  const handleDownload = async (format: 'png' | 'jpg') => {
    if (!canvasRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = format === 'png' 
        ? await toPng(canvasRef.current, { cacheBust: true })
        : await toJpeg(canvasRef.current, { quality: 0.95 });
      
      const link = document.createElement('a');
      link.download = `poster-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = async () => {
    if (!canvasRef.current || !user) return alert('User not logged in or canvas not ready');
    setSaving(true);
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const { storage } = await import('../lib/firebase');
    
    try {
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      
      const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}.png`);
      const snapshot = await uploadBytes(imageRef, blob);
      const posterImageURL = await getDownloadURL(snapshot.ref);

      await savePost({
        userId: user.uid,
        title,
        quote,
        subtitle,
        caption: location.state?.caption || "",
        hashtags: location.state?.hashtags || "",
        posterImageURL,
        platform: location.state?.platform || 'Instagram',
        style: fontFamily
      });

      alert("Post saved successfully to your dashboard!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const fonts = ['Montserrat', 'Poppins', 'Inter', 'Lora', 'Playfair Display'];

  // Style helper for Canvas background
  const getCanvasBgStyle = () => {
    if (bgType === 'solid') return { backgroundColor: bgColor };
    if (bgType === 'gradient') return { backgroundImage: bgGradient };
    if (bgType === 'image') return { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return {};
  };

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden -m-8">
      {/* Left Control Panel */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h3 className="font-semibold text-text">Editor</h3>
          </div>
          <div className="flex gap-1 bg-gray-50 p-1 rounded-xl text-xs font-medium border border-gray-100">
            <button 
              onClick={() => setActiveTab('edit')} 
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'edit' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
            >Controls</button>
            <button 
              onClick={() => setActiveTab('templates')} 
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'templates' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
            >Templates</button>
          </div>
        </div>

        <div className="p-4 space-y-5 flex-1">
          {activeTab === 'templates' ? (
            <div className="grid grid-cols-2 gap-3">
              {templates.map((t, idx) => (
                <button 
                  key={idx} 
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center p-3 text-center border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden group"
                  style={{ background: t.bgType === 'gradient' ? t.bgGradient : t.bgColor }}
                >
                  <span className="text-white text-3xl font-black opacity-10 absolute inset-0 flex items-center justify-center">A</span>
                  <span className="text-[10px] font-bold tracking-wide z-10" style={{ color: t.textColor, fontFamily: t.fontFamily }}>
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <>
          {/* Text Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
              <Type className="h-4 w-4" /> Text
            </h4>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary"
                placeholder="Optional Headline/Title"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Quote Text</label>
              <textarea 
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary resize-none h-24"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Subtitle</label>
              <input 
                type="text" 
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Typography Control */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Style & Font
            </h4>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Font Family</label>
              <select 
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-transparent"
              >
                {fonts.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Text Size ({fontSize}px)</label>
              <input 
                type="range" min="24" max="80" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-primary" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500 block">Text Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={textColor} 
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-8 w-8 p-0 border-0 rounded cursor-pointer"
                />
                <input 
                  type="text" value={textColor.toUpperCase()} 
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500 block">Alignment</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden text-gray-600">
                <button 
                  onClick={() => setTextAlign('left')}
                  className={`flex-1 p-2 flex justify-center hover:bg-gray-50 ${textAlign === 'left' ? 'bg-primary/5 text-primary' : ''}`}
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setTextAlign('center')}
                  className={`flex-1 p-2 flex justify-center border-l hover:bg-gray-50 border-gray-200 ${textAlign === 'center' ? 'bg-primary/5 text-primary' : ''}`}
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setTextAlign('right')}
                  className={`flex-1 p-2 flex justify-center border-l hover:bg-gray-50 border-gray-200 ${textAlign === 'right' ? 'bg-primary/5 text-primary' : ''}`}
                >
                  <AlignRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Background Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Background
            </h4>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden text-xs font-medium">
              <button onClick={() => setBgType('solid')} className={`flex-1 p-2 text-center ${bgType === 'solid' ? 'bg-gray-100' : ''}`}>Solid</button>
              <button onClick={() => setBgType('gradient')} className={`flex-1 p-2 text-center border-l border-gray-200 ${bgType === 'gradient' ? 'bg-gray-100' : ''}`}>Gradient</button>
              <button onClick={() => setBgType('image')} className={`flex-1 p-2 text-center border-l border-gray-200 ${bgType === 'image' ? 'bg-gray-100' : ''}`}>Image</button>
            </div>

            {bgType === 'image' && (
              <div className="space-y-1">
                <label className="text-xs text-gray-500 block">Upload Background</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setBgImage(URL.createObjectURL(file));
                  }}
                  className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
              </div>
            )}

            {bgType === 'solid' && (
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-8 cursor-pointer rounded-lg" />
            )}

            {bgType === 'gradient' && (
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Dynamic Gradients</label>
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => setBgGradient('linear-gradient(135deg, #6C63FF 0%, #4A90E2 100%)')} className="h-6 rounded bg-gradient-to-br from-[#6C63FF] to-[#4A90E2] border border-gray-100"></button>
                  <button onClick={() => setBgGradient('linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)')} className="h-6 rounded bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] border border-gray-100"></button>
                  <button onClick={() => setBgGradient('linear-gradient(135deg, #11998e 0%, #38ef7d 100%)')} className="h-6 rounded bg-gradient-to-br from-[#11998e] to-[#38ef7d] border border-gray-100"></button>
                  <button onClick={() => setBgGradient('linear-gradient(135deg, #FDC830 0%, #F37335 100%)')} className="h-6 rounded bg-gradient-to-br from-[#FDC830] to-[#F37335] border border-gray-100"></button>
                </div>
              </div>
            )}
          </div>
          </>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2 bg-gray-50/50">
          <button 
            onClick={() => handleDownload('png')}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-black transition shadow-sm"
          >
            {downloading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />} PNG
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white rounded-xl text-xs font-medium hover:bg-opacity-90 transition shadow-sm disabled:opacity-70"
          >
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Save
          </button>
        </div>
      </div>

      {/* Right Canvas Area */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8 overflow-auto">
        <div 
          ref={canvasRef}
          style={{ ...getCanvasBgStyle(), width: '1080px', height: '1080px' }}
          className="shadow-2xl flex flex-col items-center justify-center p-16 text-center relative max-w-full max-h-full scale-fit aspect-square origin-center"
          // We'll scale it using standard CSS fit constraints or transform later if needed.
          // For simple fit in wrapper, use standard width utilities, but exact dimensions are best for capture.
        >
          {/* Watermark Logo */}
          {showLogo && logoURL && (
            <img src={logoURL} alt="Logo" className="absolute top-8 left-8 h-12 w-auto object-contain" />
          )}

          <div className="z-10 space-y-2" style={{ textAlign: textAlign, color: textColor }}>
            {title && (
              <h2 className="text-3xl font-bold tracking-wide uppercase opacity-95" style={{ fontFamily: fontFamily }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl font-semibold tracking-wider opacity-80 uppercase" style={{ fontFamily: fontFamily }}>
                {subtitle}
              </p>
            )}
            <h1 
              style={{ fontFamily: fontFamily, fontSize: `${fontSize}px`, color: textColor }} 
              className="font-black leading-tight tracking-tight whitespace-pre-line"
            >
              {quote}
            </h1>
          </div>

          {showWatermark && (
            <p className="absolute bottom-8 right-8 text-xs font-semibold uppercase tracking-wider opacity-40 text-white" style={{ fontFamily: fontFamily }}>
              @PostGenAI
            </p>
          )}

          <div className="absolute inset-0 bg-black opacity-5"></div>
        </div>
      </div>
    </div>
  );
}
