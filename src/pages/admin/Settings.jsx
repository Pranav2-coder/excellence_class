import { useState } from 'react';
import { Settings, Bell, Lock, Palette, Globe, Save, CheckCircle2 } from 'lucide-react';
import Sidebar   from '../../components/Sidebar';
import DemoBadge from '../../components/DemoBadge';

const TABS = ['General', 'Notifications', 'Security', 'Appearance'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');
  const [saved, setSaved]         = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-silver-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-silver-300/60 px-6 py-4 flex items-center justify-between">
          <div className="lg:pl-0 pl-12 flex items-center gap-2">
            <Settings size={20} className="text-accent-500" />
            <h1 className="text-xl font-bold text-navy-950">Settings</h1>
          </div>
          <DemoBadge />
        </div>

        <div className="p-6 max-w-4xl mx-auto space-y-5">
          {/* Tabs */}
          <div className="card p-1.5 flex gap-1 animate-fade-in">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === t
                    ? 'bg-accent-500 text-white shadow-md'
                    : 'text-silver-600 hover:bg-silver-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* General Tab */}
          {activeTab === 'General' && (
            <div className="card animate-slide-up space-y-5">
              <h2 className="font-bold text-navy-950 text-base flex items-center gap-2">
                <Globe size={18} className="text-accent-500" /> Institute Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Institute Name</label>
                  <input className="input" defaultValue="Excellence Coaching Academy" />
                </div>
                <div>
                  <label className="label">Contact Email</label>
                  <input className="input" type="email" defaultValue="admin@demo.com" />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" defaultValue="+91 98765 43210" />
                </div>
                <div>
                  <label className="label">Academic Year</label>
                  <select className="input">
                    <option>2024–2025</option>
                    <option>2025–2026</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Address</label>
                  <input className="input" defaultValue="123 Main Road, Education Hub, Mumbai – 400001" />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'Notifications' && (
            <div className="card animate-slide-up space-y-5">
              <h2 className="font-bold text-navy-950 text-base flex items-center gap-2">
                <Bell size={18} className="text-accent-500" /> Notification Preferences
              </h2>
              {[
                { label: 'Fee Due Reminders', desc: 'Send reminders when student fee is due', checked: true },
                { label: 'Payment Received Alerts', desc: 'Notify admin when payment is recorded', checked: true },
                { label: 'New Student Added', desc: 'Notify when a new student is added', checked: false },
                { label: 'Monthly Report Email', desc: 'Send monthly fee summary via email', checked: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-silver-200 last:border-0">
                  <div>
                    <p className="font-semibold text-navy-800 text-sm">{item.label}</p>
                    <p className="text-xs text-silver-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                    <div className="w-10 h-5 bg-silver-300 rounded-full peer peer-checked:bg-accent-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'Security' && (
            <div className="card animate-slide-up space-y-5">
              <h2 className="font-bold text-navy-950 text-base flex items-center gap-2">
                <Lock size={18} className="text-accent-500" /> Security Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-700">
                <strong>Demo Mode:</strong> Password changes are not saved in this demo version.
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'Appearance' && (
            <div className="card animate-slide-up space-y-5">
              <h2 className="font-bold text-navy-950 text-base flex items-center gap-2">
                <Palette size={18} className="text-accent-500" /> Appearance
              </h2>
              <div>
                <label className="label">Theme Color</label>
                <div className="flex gap-3 mt-2">
                  {[
                    { color: 'bg-accent-500', label: 'Indigo' },
                    { color: 'bg-emerald-500', label: 'Emerald' },
                    { color: 'bg-sky-500',     label: 'Sky'     },
                    { color: 'bg-violet-500',  label: 'Violet'  },
                    { color: 'bg-rose-500',    label: 'Rose'    },
                  ].map((t) => (
                    <button key={t.label} className={`w-9 h-9 rounded-xl ${t.color} ring-2 ring-offset-2 ring-transparent hover:ring-accent-400 transition-all`} title={t.label} />
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Sidebar Style</label>
                <select className="input">
                  <option>Dark Navy (Current)</option>
                  <option>Deep Purple</option>
                  <option>Slate Grey</option>
                </select>
              </div>
              <div className="p-4 bg-accent-50 rounded-xl border border-accent-200 text-sm text-accent-700">
                <strong>Demo Mode:</strong> Appearance changes are visual previews only.
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <button onClick={handleSave} className="btn-primary px-8">
              {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
