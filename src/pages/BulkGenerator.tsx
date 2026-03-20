import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BulkGenerator() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!topic) return alert('Please enter a topic');
    setGenerating(true);
    setResults([]);

    setTimeout(() => {
      setGenerating(false);
      const mockResults = Array.from({ length: quantity }, (_, i) => ({
        id: i + 1,
        caption: `Bulk post #${i + 1} about ${topic}. This content is highly engaging, full of depth, and framed to create maximum audience retention.`,
        hashtags: `#${topic.replace(/\s+/g, '')} #BulkPost #ContentCreator`,
        quote: `${topic.toUpperCase()}\nIDEA #${i + 1}`,
        style: ['Gradient', 'Modern', 'Minimal', 'Bold'][i % 4]
      }));
      setResults(mockResults);
    }, 2500);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold text-text">Bulk Generator</h2>
        <p className="text-sm text-gray-500 mt-1">Generate multiple posts and captions at once for your calendar.</p>
      </div>

      {/* Input row */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1">
          <label className="block text-sm font-medium text-gray-700">Topic</label>
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm"
            placeholder="e.g. Productivity Hacks"
          />
        </div>
        
        <div className="w-full md:w-32 space-y-1">
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <select 
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary text-sm bg-transparent"
          >
            <option value="5">5 Posts</option>
            <option value="10">10 Posts</option>
            <option value="20">20 Posts</option>
          </select>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={generating}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-opacity-90 transition disabled:opacity-70 shadow-sm text-sm"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate Bulk
        </button>
      </div>

      {/* Info Banner for Pro Plan */}
      {results.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 text-blue-800 text-sm">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Pro Plan Feature:</span> Bulk generation allows generating up to 20 posts instantly without limit blocks. Limit remaining for Free: 0.
          </div>
        </div>
      )}

      {generating && (
        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">Running mass generation engine...</p>
        </div>
      )}

      {/* Grid Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item, idx) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary px-2.5 py-1 bg-primary/10 rounded-lg">Post #{item.id}</span>
                  <span className="text-xs text-gray-400">{item.style} Style</span>
                </div>

                <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center p-4 text-center text-white relative overflow-hidden">
                  <h4 className="font-bold text-sm leading-tight font-montserrat whitespace-pre-line">{item.quote}</h4>
                  <div className="absolute inset-0 bg-black opacity-5"></div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-600 line-clamp-2">{item.caption}</p>
                  <p className="text-xs text-primary font-medium">{item.hashtags}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button 
                  onClick={() => handleCopy(`${item.caption}\n\n${item.hashtags}`, idx)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                >
                  {copiedIndex === idx ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy
                </button>
                <button 
                  onClick={() => navigate('/editor', { state: { quote: item.quote, subtitle: topic, style: item.style } })}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-black transition"
                >
                  Edit Poster
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
