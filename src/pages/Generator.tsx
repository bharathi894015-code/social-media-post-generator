import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Instagram, Facebook, Twitter, Linkedin, Loader2, ArrowRight, Download, Save } from 'lucide-react';

export default function Generator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBrandKit, savePost } = useFirestore();

  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Motivational');
  const [style, setStyle] = useState('Modern');
  const [brandKit, setBrandKit] = useState<any>(null);

  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    caption: string;
    hashtags: string;
    quote: string;
  } | null>(null);

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [savingPost, setSavingPost] = useState(false);

  const [includeImage, setIncludeImage] = useState(false);
  const [imageType, setImageType] = useState<'ai' | 'manual'>('ai');
  const [manualImageUrls, setManualImageUrls] = useState<string[]>([]);
  const [selectedManualImageUrl, setSelectedManualImageUrl] = useState<string>('');

  const getAiImagePlaceholder = (keyword: string) => {
    const mapping: { [key: string]: string[] } = {
      business: [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1556742208-999815fca738?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&auto=format&fit=crop&q=80'
      ],
      money: [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1556742208-999815fca738?w=1080&auto=format&fit=crop&q=80'
      ],
      fitness: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1627483298606-cf54c61779a9?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1080&auto=format&fit=crop&q=80'
      ],
      gym: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1627483298606-cf54c61779a9?w=1080&auto=format&fit=crop&q=80'
      ],
      beach: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80'
      ],
      tech: [
        'https://images.unsplash.com/photo-1518770662638-d78369463643?auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1080&auto=format&fit=crop&w=1080'
      ],
      nature: [
        'https://images.unsplash.com/photo-1472214222509-38e536098904?auto=format&fit=crop&w=1080&q=80',
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1080&auto=format&fit=crop&w=1080',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&auto=format&fit=crop&w=1080'
      ],
      fruit: [
        'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=1080&auto=format&fit=crop&q=80'
      ],
      food: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1080&auto=format&fit=crop&q=80'
      ],
      music: [
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1080&auto=format&fit=crop&q=80'
      ]
    };

    const key = keyword.toLowerCase().trim();
    for (const k in mapping) {
      if (key.includes(k)) {
        const urls = mapping[k];
        return urls[Math.floor(Math.random() * urls.length)];
      }
    }
    
    // For completely unknown keywords, return a random Picsum image as an fallback
    return `https://picsum.photos/1080/1080?random=${Math.floor(Math.random() * 1000)}`;
  };

  const getAiQuotePlaceholder = (keyword: string) => {
    const mapping: { [key: string]: string[] } = {
      fitness: [
        'NO EXCUSES\nJUST\nRESULTS',
        'TRAIN HARD\nSTAY\nHUMBLE',
        'SWEAT TODAY\nSHINE\nTOMORROW',
        'BUILD\nYOUR\nSTRENGTH'
      ],
      gym: [
        'NO EXCUSES\nJUST\nRESULTS',
        'TRAIN HARD\nSTAY\nHUMBLE'
      ],
      business: [
        'WORK HARD\nIN\nSILENCE',
        'BUILD\nYOUR\nEMPIRE',
        'RISK IT ALL\nFOR\nTHE DREAM',
        'EXECUTION\nIS\nEVERYTHING'
      ],
      success: [
        'WORK HARD\nIN\nSILENCE',
        'EXECUTION\nIS\nEVERYTHING'
      ],
      money: [
        'BUILD\nYOUR\nEMPIRE',
        'RISK IT ALL\nFOR\nTHE DREAM'
      ],
      tech: [
        'CODE\nCREATE\nINNOVATE',
        'STAY HUNGRY\nSTAY\nFOOLISH',
        'BUILDING\nTHE\nFUTURE',
        'FIX THE BUG\nBEFORE IT\nFIXES YOU'
      ],
      computer: [
        'CODE\nCREATE\nINNOVATE'
      ],
      nature: [
        'FIND PEACE\nIN THE\nWILD',
        'GROW\nAT YOUR OWN\nPACE',
        'NATURE\nNEVER\nHURRIES'
      ],
      summer: [
        'STAY\nSUNKISSED',
        'SUMMER\nVIBES\nONLY'
      ],
      fruit: [
        'START YOUR DAY\nWITH\nFRESHNESS',
        'SWEET\nBY\nNATURE',
        'HEALTHY\nAND\nDELICIOUS',
        'EAT FRUIT\nFEEL\nGOOD'
      ],
      food: [
        'MADE WITH\nLOVE AND\nPASSION',
        'GOOD FOOD\nGOOD\nMOOD',
        'TASTE THE\nGOODNESS',
        'LIFE IS\nDELICIOUS'
      ],
      music: [
        'LOST IN THE\nRHYTHM',
        'MUSIC IS\nTHE\nANSWER',
        'TURN UP\nTHE\nVOLUME',
        'FEEL THE\nBEAT'
      ]
    };

    const key = keyword.toLowerCase().trim();
    for (const k in mapping) {
      if (key.includes(k)) {
        const quotes = mapping[k];
        return quotes[Math.floor(Math.random() * quotes.length)];
      }
    }

    const fallbackQuotes = [
      'DREAM BIG\nWORK\nHARDER',
      'STAY\nFOCUSED',
      'MAKE IT\nHAPPEN',
      'BE AWESOME\nTODAY',
      'STAY\nPOSITIVE',
      'NEVER\nGIVE UP'
    ];
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  };

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    const { toPng } = await import('html-to-image');
    try {
      const dataUrl = await toPng(previewRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `poster-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download', err);
    }
  };

  useEffect(() => {
    if (user) {
      getBrandKit(user.uid).then(setBrandKit);
    }
  }, [user, getBrandKit]);

  const handleGenerate = () => {
    if (!topic) return alert('Please enter a topic');
    setGenerating(true);
    setGeneratedResult(null);

    // Mock AI delay
    setTimeout(() => {
      setGenerating(false);
      setGeneratedResult({
        caption: `Consistency is key when it comes to ${topic}. Start small, stay focused, and build habits that last. Success doesn't happen overnight, but it happens every single day you put in the work.`,
        hashtags: `#${topic.replace(/\s+/g, '')} #SuccessMindset #DailyGrind #Consistency`,
        quote: getAiQuotePlaceholder(topic)
      });

      // Update AI Image Placeholder dynamically on each generation call (like a real AI)
      setGeneratedImageUrl(getAiImagePlaceholder(topic));
    }, 2000);
  };

  const handleSavePost = async () => {
    if (!generatedResult || !user) return alert('No post to save or not logged in');
    setSavingPost(true);
    try {
      await savePost({
        userId: user.uid,
        quote: generatedResult.quote,
        caption: generatedResult.caption,
        hashtags: generatedResult.hashtags,
        platform: platform,
        style: style,
        posterImageURL: includeImage ? (generatedImageUrl || getAiImagePlaceholder(topic)) : '',
        createdAt: new Date().toISOString()
      });
      alert('Post saved successfully to your dashboard!');
    } catch (err) {
      console.error('Failed to save post', err);
      alert('Failed to save post');
    } finally {
      setSavingPost(false);
    }
  };

  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'text-pink-600 bg-pink-50' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700 bg-blue-50' },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-600 bg-blue-50' },
    { name: 'Twitter', icon: Twitter, color: 'text-sky-500 bg-sky-50' },
  ];

  const tones = ['Motivational', 'Educational', 'Promotional', 'Storytelling'];
  const styles = ['Modern', 'Minimal', 'Bold', 'Gradient'];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold text-text">Post Generator</h2>
        <p className="text-sm text-gray-500 mt-1">Generate engaging captions, hashtags, and beautiful posters instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Configurations */}
        <div className="lg:col-span-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 h-fit lg:max-h-[calc(100vh-160px)] overflow-hidden">
          {/* Scrollable Fields wrapper */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h3 className="text-lg font-semibold text-text flex items-center gap-2 mb-2">
              <span className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              Form Configuration
            </h3>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Topic or Keyword</label>
              <input 
                type="text" 
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm"
                placeholder="e.g. Business Motivation"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  const isSelected = platform === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setPlatform(p.name)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-sm font-medium transition ${
                        isSelected 
                          ? 'border-primary ring-1 ring-primary bg-primary/5 text-primary' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Tone</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm bg-transparent"
              >
                {tones.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Poster Style</label>
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm bg-transparent"
              >
                {styles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Image Option */}
            <div className="space-y-2 border-t pt-3 mt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Include Image</label>
                <input 
                  type="checkbox" 
                  checked={includeImage}
                  onChange={(e) => setIncludeImage(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
              </div>

              {includeImage && (
                <div className="space-y-3 mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins">Image Source</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setImageType('ai')}
                      className={`p-2 text-xs font-medium rounded-lg border transition ${
                        imageType === 'ai' 
                          ? 'bg-white border-primary text-primary shadow-sm' 
                          : 'bg-transparent border-gray-200 text-gray-600 hover:bg-white'
                      }`}
                    >
                      🤖 AI Generated
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageType('manual')}
                      className={`p-2 text-xs font-medium rounded-lg border transition ${
                        imageType === 'manual' 
                          ? 'bg-white border-primary text-primary shadow-sm' 
                          : 'bg-transparent border-gray-200 text-gray-600 hover:bg-white'
                      }`}
                    >
                      📁 Upload Manual
                    </button>
                  </div>

                  {imageType === 'manual' && (
                    <div className="space-y-2">
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            const newUrls = files.map(f => URL.createObjectURL(f));
                            setManualImageUrls(prev => [...prev, ...newUrls]);
                            // If no image is selected yet, pick the first one from the new batch
                            setSelectedManualImageUrl(prev => prev || newUrls[0]);
                          }
                        }}
                        className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                      
                      {manualImageUrls.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                          {manualImageUrls.map((url, index) => (
                            <div key={index} className="relative h-16 w-16 flex-shrink-0">
                              <img 
                                src={url} 
                                alt={`Preview ${index}`} 
                                onClick={() => setSelectedManualImageUrl(url)}
                                className={`h-16 w-16 object-cover rounded-lg border cursor-pointer transition ${selectedManualImageUrl === url ? 'border-primary ring-2 ring-primary/20 bg-white' : 'border-gray-200 hover:border-gray-300'}`} 
                              />
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setManualImageUrls(prev => {
                                    const next = prev.filter((_, i) => i !== index);
                                    if (selectedManualImageUrl === url) {
                                      setSelectedManualImageUrl(next[0] || '');
                                    }
                                    return next;
                                  });
                                }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 text-xs hover:bg-red-600 flex items-center justify-center h-4 w-4 shadow-sm"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Fixed Button Footer */}
          <div className="p-6 border-t bg-gray-50/50 rounded-b-2xl">
            <button 
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-opacity-90 transition disabled:opacity-70 shadow-sm text-sm"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate Post
            </button>
          </div>
        </div>

        {/* Right Output: Results/Preview */}
        <div className="lg:col-span-2 space-y-4">
          {!generatedResult && !generating && (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <Sparkles className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-text">No post generated yet</h4>
              <p className="text-sm text-gray-500 max-w-sm">Configure options and click "Generate Post" to create caption and poster layout.</p>
            </div>
          )}

          {generating && (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-gray-500 animate-pulse">Generating your masterpiece...</p>
            </div>
          )}

          {generatedResult && (
            <div className="space-y-6">
              {/* Text Results */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-lg font-semibold text-text">Generated Content</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Caption</span>
                    <p className="mt-1 p-3 bg-gray-50 rounded-xl text-sm text-gray-700 border border-gray-100">
                      {generatedResult.caption}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Hashtags</span>
                    <p className="mt-1 p-3 bg-gray-50 rounded-xl text-sm text-primary font-medium border border-gray-100">
                      {generatedResult.hashtags}
                    </p>
                  </div>
                </div>
              </div>

              {/* Poster Preview Frame */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text">Poster Design</h3>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-text transition-colors"
                    >
                      <Download className="h-4 w-4" /> Download
                    </button>
                    <button 
                      onClick={handleSavePost}
                      disabled={savingPost}
                      className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors disabled:opacity-70"
                    >
                      {savingPost ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} 
                      Save
                    </button>
                    <button 
                      onClick={() => navigate('/editor', { 
                        state: { 
                          quote: generatedResult.quote, 
                          subtitle: topic, 
                          tone, 
                          style, 
                          brandKit,
                          includeImage,
                          imageType,
                          manualImageUrl: imageType === 'ai' ? (generatedImageUrl || getAiImagePlaceholder(topic)) : selectedManualImageUrl
                        } 
                      })}
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Edit <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div 
                  ref={previewRef}
                  className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex flex-col items-center justify-center p-8 text-center text-white shadow-md relative overflow-hidden"
                >
                  {/* Background Image absolute backplate */}
                  {includeImage && (
                    <img 
                      src={imageType === 'manual' ? selectedManualImageUrl : (generatedImageUrl || getAiImagePlaceholder(topic))} 
                      alt="Background" 
                      className="absolute inset-0 w-full h-full object-cover z-0" 
                    />
                  )}

                  {/* Contrast Overlay if image exists */}
                  {includeImage && <div className="absolute inset-0 bg-black/30 z-10"></div>}

                  {/* Brand Logo if exists */}
                  {brandKit?.logoURL && (
                    <img src={brandKit.logoURL} alt="Logo" className="absolute top-4 left-4 h-6 w-auto object-contain z-20" />
                  )}
                  
                  <div className="z-20 space-y-2">
                    <p className="text-xs font-semibold tracking-wider opacity-80 uppercase">{tone}</p>
                    <h1 className="text-3xl font-black font-montserrat leading-tight tracking-tight whitespace-pre-line">
                      {generatedResult.quote}
                    </h1>
                  </div>

                  <div className="absolute inset-0 bg-black opacity-10 z-10"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
