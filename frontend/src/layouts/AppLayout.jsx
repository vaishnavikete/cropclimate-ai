import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sprout,
  Satellite,
  CloudSun,
  ShieldAlert,
  Bot,
  FlaskConical,
  Activity,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Info
} from 'lucide-react';

export default function AppLayout({
  children,
  currentTab,
  onSelectTab,
  isApiHealthy,
  demoFarms,
  selectedDemoId,
  onSelectDemoFarm,
  isAnalyzing
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'farm_analysis', label: 'Farm Analysis', icon: FlaskConical, badge: 'Core' },
    { id: 'satellite', label: 'Satellite Analysis', icon: Satellite, badge: 'Spectral' },
    { id: 'weather', label: 'Weather Risk', icon: CloudSun, badge: '7-Day' },
    { id: 'crop_advisor', label: 'Crop Advisor', icon: Sprout, badge: null },
    { id: 'risk_alerts', label: 'Risk Alerts', icon: ShieldAlert, badge: 'Early Warning' },
    { id: 'ai_assistant', label: 'AI Farm Advisor', icon: Bot, badge: 'Copilot' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Top Agricultural Brand Banner */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Tagline */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-700/20">
                🌾
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-heading font-bold text-xl tracking-tight text-stone-900">
                    CropClimate <span className="text-emerald-600">AI</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    v1.0 Pro
                  </span>
                </div>
                <p className="text-[11px] font-medium text-stone-500 tracking-wide">
                  Predict. Protect. Grow.
                </p>
              </div>
            </div>

            {/* Middle: Demo Scenario Quick Select */}
            <div className="hidden lg:flex items-center space-x-2 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60">
              <span className="text-xs font-semibold text-stone-500 px-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Demo Farms:
              </span>
              <button
                onClick={() => onSelectDemoFarm('farm-1')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedDemoId === 'farm-1'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-white/80'
                }`}
              >
                🌱 Soybean (Pune)
              </button>
              <button
                onClick={() => onSelectDemoFarm('farm-2')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedDemoId === 'farm-2'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-white/80'
                }`}
              >
                🌾 Wheat (Punjab)
              </button>
              <button
                onClick={() => onSelectDemoFarm('farm-3')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedDemoId === 'farm-3'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-white/80'
                }`}
              >
                🍚 Rice (Thanjavur)
              </button>
            </div>

            {/* Right Status & Quick Action */}
            <div className="flex items-center space-x-3">
              {/* API Status indicator */}
              <div
                className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-white"
                title={isApiHealthy ? "FastAPI & SQLite connected" : "Connecting to backend..."}
              >
                <span className={`w-2 h-2 rounded-full ${isApiHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-stone-600">{isApiHealthy ? 'Engine Active' : 'Connecting...'}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectTab('farm_analysis')}
                className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-sm shadow-emerald-700/20 gap-1.5"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Farm'}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Secondary Desktop Horizontal Navigation Tabs */}
        <div className="hidden md:block bg-stone-50 border-t border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 py-1.5 overflow-x-auto no-scrollbar">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      active
                        ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/70 font-bold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-stone-500'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1">
            <div className="p-2 mb-2 bg-stone-50 rounded-xl border border-stone-200/70">
              <span className="text-[11px] font-bold text-stone-500 block mb-1">Select Demo Scenario:</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => { onSelectDemoFarm('farm-1'); setMobileMenuOpen(false); }}
                  className="px-2 py-1 text-[11px] font-medium rounded-lg bg-emerald-50 text-emerald-700 text-center"
                >
                  Soybean
                </button>
                <button
                  onClick={() => { onSelectDemoFarm('farm-2'); setMobileMenuOpen(false); }}
                  className="px-2 py-1 text-[11px] font-medium rounded-lg bg-emerald-50 text-emerald-700 text-center"
                >
                  Wheat
                </button>
                <button
                  onClick={() => { onSelectDemoFarm('farm-3'); setMobileMenuOpen(false); }}
                  className="px-2 py-1 text-[11px] font-medium rounded-lg bg-emerald-50 text-emerald-700 text-center"
                >
                  Rice
                </button>
              </div>
            </div>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-stone-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Agricultural System Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-stone-800">CropClimate AI</span>
            <span>•</span>
            <span>Climate-Smart Agricultural Decision-Support System</span>
          </div>
          <div className="text-center sm:text-right text-[11px] text-stone-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 inline text-amber-500" />
            <span>Advisory support only. Verify with local extension officers / KVK before spraying or planting.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
