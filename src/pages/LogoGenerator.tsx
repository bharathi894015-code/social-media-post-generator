import { useState, useRef, useEffect } from 'react';
import { 
  Type, Download, Crown, Zap, Globe, Anchor, 
  Shield, Heart, Sun, Feather, Flame, Cloud, Coffee, Briefcase,
  Box, Compass, Star, Target, Activity, MessageSquare, ShoppingBag, Music
} from 'lucide-react';
import { toPng } from 'html-to-image';

const ICON_LIST = [
  { id: 'crown', component: Crown, name: 'Premium' },
  { id: 'zap', component: Zap, name: 'Energy' },
  { id: 'globe', component: Globe, name: 'Global' },
  { id: 'anchor', component: Anchor, name: 'Trust' },
  { id: 'shield', component: Shield, name: 'Safety' },
  { id: 'heart', component: Heart, name: 'Care' },
  { id: 'feather', component: Feather, name: 'Creative' },
  { id: 'flame', component: Flame, name: 'Power' },
  { id: 'sun', component: Sun, name: 'Bright' },
  { id: 'cloud', component: Cloud, name: 'Tech' },
  { id: 'coffee', component: Coffee, name: 'Cafe' },
  { id: 'briefcase', component: Briefcase, name: 'Business' },
  { id: 'box', component: Box, name: 'Logistics' },
  { id: 'compass', component: Compass, name: 'Guide' },
  { id: 'star', component: Star, name: 'Quality' },
  { id: 'target', component: Target, name: 'Focus' },
  { id: 'activity', component: Activity, name: 'Health' },
  { id: 'message-square', component: MessageSquare, name: 'Social' },
  { id: 'shopping-bag', component: ShoppingBag, name: 'Retail' },
  { id: 'music', component: Music, name: 'Media' },
];

const PRESET_FONTS = [
  { name: 'Modern', style: { fontFamily: 'sans-serif', fontWeight: 'bold' } },
  { name: 'Vintage', style: { fontFamily: "'Playfair Display', serif", fontStyle: 'italic' } },
  { name: 'Tech', style: { fontFamily: "'Orbitron', sans-serif", letterSpacing: '4px' } },
  { name: 'Elegant', style: { fontFamily: "'Playfair Display', serif", fontWeight: '300' } },
  { name: 'Condensed', style: { fontFamily: "'Oswald', sans-serif", fontWeight: '700', textTransform: 'uppercase' } },
  { name: 'Playful', style: { fontFamily: "'Pacifico', cursive" } },
  { name: 'Bold', style: { fontFamily: 'sans-serif', fontWeight: '900', textTransform: 'uppercase' } },
  { name: 'Monospace', style: { fontFamily: 'monospace', opacity: 0.8 } },
];

const COLOR_PALETTES = [
  { name: 'Night Blue', primary: '#1E3A8A', secondary: '#3B82F6', text: '#FFFFFF', bg: '#030712' },
  { name: 'Sunset', primary: '#EA580C', secondary: '#F59E0B', text: '#FFFFFF', bg: '#111827' },
  { name: 'Mint', primary: '#059669', secondary: '#10B981', text: '#1F2937', bg: '#F0FDF4' },
  { name: 'Cyber', primary: '#9333EA', secondary: '#EC4899', text: '#FFFFFF', bg: '#0F172A' },
  { name: 'Gold', primary: '#B45309', secondary: '#D97706', text: '#1F2937', bg: '#FFFBEB' },
  { name: 'Neon Rose', primary: '#F43F5E', secondary: '#8B5CF6', text: '#FFFFFF', bg: '#030712' },
  { name: 'Forest', primary: '#065F46', secondary: '#34D399', text: '#1F2937', bg: '#ECFDF5' },
  { name: 'Deep Space', primary: '#2563EB', secondary: '#D946EF', text: '#FFFFFF', bg: '#000000' },
  { name: 'Pastel Sky', primary: '#60A5FA', secondary: '#F472B6', text: '#1F2937', bg: '#EFF6FF' },
  { name: 'Minimal', primary: '#1F2937', secondary: '#4B5563', text: '#1F2937', bg: '#FFFFFF' },
];

export default function LogoGenerator() {
  const [companyName, setCompanyName] = useState('My Company');
  const [slogan, setSlogan] = useState('The Best In Town');
  const [activeIcon, setActiveIcon] = useState('crown');
  const [activeFont, setActiveFont] = useState('Modern');
  const [activePalette, setActivePalette] = useState(COLOR_PALETTES[0]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Oswald:wght@500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch (e) {
        // Handle if already removed or not found
      }
    };
  }, []);

  const previewsRef = useRef<HTMLDivElement>(null);

  const SelectedIconComponent = ICON_LIST.find(i => i.id === activeIcon)?.component || Crown;
  const SelectedFontStyle = PRESET_FONTS.find(f => f.name === activeFont)?.style || { fontFamily: 'sans-serif', fontWeight: 'bold' };

  const downloadLogo = (id: string) => {
    const node = document.getElementById(id);
    if (node) {
      toPng(node)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `${companyName.replace(/\s+/g, '-').toLowerCase()}-logo.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('oops, something went wrong!', err);
        });
    }
  };

  const layouts = [
    {
      id: 'classic',
      name: 'Classic Stacked',
      render: (palette: typeof COLOR_PALETTES[0], fontStyle: any) => (
        <div 
          id="logo-classic"
          className="aspect-square w-full rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300"
          style={{ backgroundColor: palette.bg }}
        >
          <div className="flex items-center justify-center rounded-full p-4 mb-3" style={{ backgroundColor: `${palette.primary}15` }}>
            <SelectedIconComponent className="h-10 w-10" style={{ color: palette.primary }} />
          </div>
          <h3 className="text-xl text-center mt-2" style={{ ...fontStyle, color: palette.text === '#FFFFFF' ? palette.primary : palette.text }}>
            {companyName}
          </h3>
          {slogan && (
            <p className="text-xs uppercase tracking-wider text-center mt-1 opacity-70" style={{ color: palette.text === '#FFFFFF' ? palette.secondary : palette.text }}>
              {slogan}
            </p>
          )}
        </div>
      )
    },
    {
      id: 'modern-horizon',
      name: 'Modern Horizontal',
      render: (palette: typeof COLOR_PALETTES[0], fontStyle: any) => (
        <div 
          id="logo-horizon"
          className="aspect-square w-full rounded-2xl flex items-center justify-center p-8 transition-all duration-300"
          style={{ backgroundColor: palette.bg }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-xl p-3" style={{ backgroundColor: palette.primary }}>
              <SelectedIconComponent className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl" style={{ ...fontStyle, color: palette.text === '#FFFFFF' ? '#FFFFFF' : palette.text }}>
                {companyName}
              </h3>
              {slogan && (
                <p className="text-xs tracking-wide opacity-60 mt-0.5" style={{ color: palette.text }}>
                  {slogan}
                </p>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'badge',
      name: 'Circular Badge',
      render: (palette: typeof COLOR_PALETTES[0], fontStyle: any) => (
        <div 
          id="logo-badge"
          className="aspect-square w-full rounded-2xl flex items-center justify-center p-8 transition-all duration-300"
          style={{ backgroundColor: palette.bg }}
        >
          <div 
            className="rounded-full border-2 aspect-square w-40 flex flex-col items-center justify-center p-4 relative"
            style={{ borderColor: `${palette.primary}40`, borderStyle: 'dashed' }}
          >
            <div className="absolute inset-2 border rounded-full" style={{ borderColor: palette.primary }} />
            <SelectedIconComponent className="h-8 w-8 mb-1" style={{ color: palette.primary }} />
            <h3 className="text-sm text-center" style={{ ...fontStyle, color: palette.text === '#FFFFFF' ? '#FFFFFF' : palette.text }}>
              {companyName}
            </h3>
            {slogan && (
              <p className="text-[10px] text-center mt-0.5 opacity-60" style={{ color: palette.text }}>
                {slogan}
              </p>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'gradient-text',
      name: 'Gradient Spark',
      render: (palette: typeof COLOR_PALETTES[0], fontStyle: any) => (
        <div 
          id="logo-gradient"
          className="aspect-square w-full rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 relative overflow-hidden"
          style={{ backgroundColor: palette.bg }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl opacity-20" 
               style={{ background: `linear-gradient(45deg, ${palette.primary}, ${palette.secondary})` }} />
          
          <SelectedIconComponent className="h-12 w-12 mb-3 z-10 animate-pulse" style={{ color: palette.secondary }} />
          <h3 className="text-2xl bg-clip-text text-transparent bg-gradient-to-r z-10" 
              style={{ ...fontStyle, backgroundImage: `linear-gradient(to right, ${palette.primary}, ${palette.secondary})` }}>
            {companyName}
          </h3>
        </div>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Logo Designing</h2>
          <p className="text-sm text-gray-400 mt-1">Create a unique identity for your brand in seconds.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Side: Controls */}
        <div className="w-80 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Identity */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Type className="h-4 w-4" /> Identity
            </h4>
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Company Name</label>
              <input 
                type="text" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Slogan (Optional)</label>
              <input 
                type="text" 
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
                placeholder="Enter slogan"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Icon */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Icon</h4>
            <div className="grid grid-cols-4 gap-2">
              {ICON_LIST.map(icon => {
                const Icon = icon.component;
                return (
                  <button
                    key={icon.id}
                    onClick={() => setActiveIcon(icon.id)}
                    className={`p-2.5 rounded-xl border transition flex items-center justify-center hover:bg-gray-50 ${
                      activeIcon === icon.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 text-gray-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Font Style */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Font Style</h4>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_FONTS.map(font => (
                <button
                  key={font.name}
                  onClick={() => setActiveFont(font.name)}
                  className={`px-3 py-2 rounded-xl text-xs border text-center transition hover:bg-gray-50 ${
                    activeFont === font.name ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-gray-50 text-gray-500'
                  }`}
                >
                  <span style={font.style}>{font.name}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Color Palette */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Colors</h4>
            <div className="space-y-2">
              {COLOR_PALETTES.map(palette => (
                <button
                  key={palette.name}
                  onClick={() => setActivePalette(palette)}
                  className={`w-full p-2 rounded-xl border flex items-center justify-between transition hover:shadow-sm ${
                    activePalette.name === palette.name ? 'border-primary' : 'border-gray-50'
                  }`}
                >
                  <span className="text-xs font-medium text-gray-600">{palette.name}</span>
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: palette.bg }} />
                    <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: palette.primary }} />
                    <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: palette.secondary }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Previews */}
        <div className="flex-1 overflow-y-auto">
          <div ref={previewsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            {layouts.map(layout => (
              <div key={layout.id} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 hover:shadow-md transition">
                <div className="group relative">
                  {layout.render(activePalette, SelectedFontStyle)}
                  <div className="absolute inset-0 bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button 
                      onClick={() => downloadLogo(`logo-${layout.id.split('-')[0] === 'modern' ? 'horizon' : layout.id.split('-')[0]}`)} 
                      className="bg-white text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-xl hover:scale-105 transition"
                    >
                      <Download className="h-4 w-4" /> Download
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-semibold text-gray-500">{layout.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
