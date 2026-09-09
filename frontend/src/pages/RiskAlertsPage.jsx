import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Droplets,
  CloudRain,
  Bug,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';

export default function RiskAlertsPage({ alerts = [] }) {
  const defaultAlerts = alerts && alerts.length > 0 ? alerts : [
    {
      type: "HEAT_RISK",
      severity: "CRITICAL",
      headline: "🚨 EXTREME HEAT STRESS ALERT",
      message: "Ambient temperature (38.0°C) is above the upper biological threshold for flowering soybean. Irrigate immediately during early morning or late evening.",
      timestamp: "Today, 08:30 AM"
    },
    {
      type: "LOW_MOISTURE",
      severity: "WARNING",
      headline: "💧 SOIL MOISTURE DEFICIT WARNING",
      message: "Root zone volumetric moisture is down to 21.0% (below 25% wilting threshold). Schedule irrigation within 12 hours.",
      timestamp: "Today, 06:15 AM"
    },
    {
      type: "PEST_WATCH",
      severity: "INFO",
      headline: "🐛 SUCKING PEST ENVIRONMENTAL WATCH",
      message: "Dry heat conditions favor aphid and whitefly reproduction. Inspect undersides of leaves in random sample blocks.",
      timestamp: "Yesterday, 04:00 PM"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Real-Time Farm Vulnerability Monitoring</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
          Active Agricultural Risk Alerts
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-3xl">
          Automated rule and machine-learning triggers based on live meteorological feeds, soil moisture probes, and satellite vegetation indices.
        </p>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-4">
        {defaultAlerts.map((alert, idx) => {
          const isCrit = alert.severity === 'CRITICAL';
          const isWarn = alert.severity === 'WARNING';
          const bg = isCrit ? 'bg-rose-50/80 border-rose-200' : (isWarn ? 'bg-amber-50/80 border-amber-200' : 'bg-emerald-50/80 border-emerald-200');
          const badgeBg = isCrit ? 'bg-rose-500 text-white' : (isWarn ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white');

          return (
            <div key={idx} className={`p-6 rounded-3xl border ${bg} shadow-xs space-y-3 transition-all`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <AlertTriangle className={`w-5 h-5 ${isCrit ? 'text-rose-600' : (isWarn ? 'text-amber-600' : 'text-emerald-600')}`} />
                  <h3 className="text-base font-heading font-bold text-stone-900">{alert.headline}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${badgeBg}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {alert.timestamp}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {alert.message}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-200/50">
                <span>Verification: Cross-check with field hygrometer and crop appearance.</span>
                <span className="font-semibold text-emerald-700">Action Required</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
