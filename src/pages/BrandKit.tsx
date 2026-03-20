import { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import { Palette, Upload, Loader2, Sparkles } from 'lucide-react';

export default function BrandKit() {
  const { user } = useAuth();
  const { saveBrandKit, getBrandKit, loading, error } = useFirestore();

  const [brandName, setBrandName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6C63FF');
  const [secondaryColor, setSecondaryColor] = useState('#4A90E2');
  const [logoURL, setLogoURL] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      getBrandKit(user.uid).then(data => {
        if (data) {
          setBrandName(data.brandName || '');
          setPrimaryColor(data.primaryColor || '#6C63FF');
          setSecondaryColor(data.secondaryColor || '#4A90E2');
          setLogoURL(data.logoURL || '');
          setPreviewURL(data.logoURL || '');
        }
      });
    }
  }, [user, getBrandKit]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const brandKitData = {
      brandName,
      primaryColor,
      secondaryColor,
      logoURL // preserves existing if file isn't updated
    };

    const res = await saveBrandKit(user.uid, brandKitData, logoFile || undefined);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (res.logoURL) {
        setLogoURL(res.logoURL);
        setPreviewURL(res.logoURL);
        setLogoFile(null); // Clear file selection
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Brand Kit</h2>
          <p className="text-sm text-gray-500 mt-1">Configure your brand identity to automatically apply it to posters.</p>
        </div>
        {saveSuccess && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Saved successfully!
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-semibold text-text flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Palette className="h-5 w-5" />
            </span>
            Brand Identity
          </h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Brand Name</label>
            <input 
              type="text" 
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm"
              placeholder="e.g. Acme Inc"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <div className="mt-1 flex items-center gap-4">
              {previewURL ? (
                <div className="h-16 w-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                  <img src={previewURL} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <Upload className="h-6 w-6" />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden" 
                id="logo-upload" 
              />
              <label 
                htmlFor="logo-upload"
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer transition flex items-center gap-1"
              >
                Choose File
              </label>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text flex items-center gap-2 mb-4">
              <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <Palette className="h-5 w-5" />
              </span>
              Brand Colors
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input 
                    type="color" 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-10 p-0 border-0 rounded-lg cursor-pointer bg-transparent"
                  />
                  <input 
                    type="text" 
                    value={primaryColor.toUpperCase()}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl shadow-sm text-xs uppercase font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input 
                    type="color" 
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-10 p-0 border-0 rounded-lg cursor-pointer bg-transparent"
                  />
                  <input 
                    type="text" 
                    value={secondaryColor.toUpperCase()}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl shadow-sm text-xs uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Container */}
          <div className="mt-4 p-4 rounded-xl flex gap-4 items-center" style={{ backgroundColor: `${primaryColor}10` }}>
            <div className="h-10 w-10 rounded-full shadow-sm" style={{ backgroundColor: primaryColor }}></div>
            <div className="h-10 w-10 rounded-full shadow-sm" style={{ backgroundColor: secondaryColor }}></div>
            <div className="flex-1">
              <span className="text-sm font-medium text-text block">Preview theme</span>
              <span className="text-xs text-gray-500">Colors will be applied to posters</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-opacity-90 transition disabled:opacity-70 shadow-sm text-sm"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Brand Kit
          </button>
        </div>
      </form>
    </div>
  );
}
