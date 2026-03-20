import { Check, Sparkles, Zap, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Ideal for beginners trying out the platform.',
      features: [
        '5 AI posts / day',
        'Standard templates',
        'Single style generation',
        'Community Support'
      ],
      buttonText: 'Current Plan',
      buttonClass: 'bg-gray-100 text-gray-400 cursor-not-allowed',
      icon: Zap,
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'Everything you need to scale your social presence.',
      features: [
        'Unlimited AI posts',
        'Priority generation speed',
        'Custom Brand Kit integration',
        'Premium Font & Icon Library',
        '24/7 Priority Support'
      ],
      buttonText: 'Upgrade to Pro',
      buttonClass: 'bg-primary text-white hover:bg-opacity-90 shadow-lg',
      icon: Sparkles,
      featured: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      description: 'Advanced features and dedicated support for teams.',
      features: [
        'Multiple Users / Team access',
        'Custom AI generation fine-tuning',
        'API Access for workflow automation',
        'Dedicated Account Manager',
        'White-label options'
      ],
      buttonText: 'Contact Sales',
      buttonClass: 'bg-gray-900 text-white hover:bg-black',
      icon: Shield,
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-2xl font-bold text-text">Pricing & Plans</h2>
      </div>

      <div className="text-center space-y-2 mt-4">
        <p className="text-sm text-gray-500">Choose the perfect plan to grow your business or content pipeline.</p>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold py-1.5 px-3 bg-primary/10 text-primary w-fit mx-auto rounded-full mt-2">
          <span>🎁 Launch Offer: 20% OFF on Annual Tiers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div 
              key={tier.name}
              className={`bg-white rounded-3xl p-6 shadow-sm border ${tier.featured ? 'border-primary ring-2 ring-primary/20 relative' : 'border-gray-100'} flex flex-col justify-between hover:shadow-md transition`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase py-1 px-3 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Popular Choice
                </div>
              )}
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-black text-text">{tier.price}<span className="text-sm font-medium text-gray-400">/mo</span></span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text">{tier.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{tier.description}</p>
                </div>

                <hr className="border-gray-100" />

                <ul className="space-y-2.5">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button 
                  disabled={tier.name === 'Free'}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition ${tier.buttonClass}`}
                >
                  {tier.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
