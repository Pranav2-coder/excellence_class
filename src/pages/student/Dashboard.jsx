import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, Bell, ChevronRight, FileText, CheckCircle2, Wallet,
  Calendar, Download, Megaphone, Home, CreditCard, Receipt, User, Clock,
  LogOut, Phone, Mail, MapPin
} from 'lucide-react';

import { useApp }  from '../../context/AppContext';
import { formatCurrency, calcPaid, calcRemaining } from '../../data/mockData';

export default function StudentDashboard() {
  const { studentAuth, logoutStudent, getStudent } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const student = getStudent(studentAuth?.id);

  if (!student) {
    logoutStudent();
    navigate('/student/login', { replace: true });
    return null;
  }

  const paid      = calcPaid(student);
  const remaining = calcRemaining(student);
  const pct       = Math.min(100, Math.round((paid / student.yearlyFee) * 100));
  const sorted    = [...student.payments].sort((a, b) => new Date(b.date) - new Date(a.date));

  const downloadReceipt = (payment) => {
    if (!payment) return;
    
    // Create an off-screen canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 700);

    // Header text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Excellence Coaching', 300, 60);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('OFFICIAL PAYMENT RECEIPT', 300, 85);

    // Separator line
    ctx.beginPath();
    ctx.moveTo(40, 110);
    ctx.lineTo(560, 110);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Amount block
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(40, 140, 520, 120, 16);
    } else {
      ctx.rect(40, 140, 520, 120);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('AMOUNT PAID', 300, 175);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`₹${payment.amount.toLocaleString('en-IN')}`, 300, 220);

    // Info rows
    const d = new Date(payment.date);
    const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const rows = [
      { label: 'Receipt No', value: `REC-${payment.id.toUpperCase().substring(0, 8)}` },
      { label: 'Payment Date', value: dateStr },
      { label: 'Student Name', value: student.name },
      { label: 'Student ID', value: student.id },
      { label: 'Payment Mode', value: payment.mode.toUpperCase() },
      { label: 'Status', value: 'Successful ✓', color: '#10b981' }
    ];

    let startY = 310;
    rows.forEach(row => {
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'left';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(row.label, 40, startY);

      ctx.fillStyle = row.color || '#000000';
      ctx.textAlign = 'right';
      ctx.fillText(row.value, 560, startY);

      ctx.beginPath();
      ctx.moveTo(40, startY + 15);
      ctx.lineTo(560, startY + 15);
      ctx.strokeStyle = '#f1f5f9';
      ctx.stroke();

      startY += 45;
    });

    // Footer
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.font = '12px sans-serif';
    ctx.fillText('This is a computer generated receipt and does not require a physical signature.', 300, 640);
    ctx.fillText('Please keep this for your records.', 300, 660);

    // Export and download
    const jpegUrl = canvas.toDataURL('image/jpeg', 1.0);
    const a = document.createElement('a');
    a.href = jpegUrl;
    a.download = `Receipt_REC-${payment.id.toUpperCase().substring(0, 8)}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const NavItem = ({ id, icon: Icon, label }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className="relative flex flex-col items-center justify-center w-full py-2 group"
      >
        <div className={`flex flex-col items-center transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}>
          <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'text-[#000000]' : 'text-black group-hover:text-black'}`}>
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] font-semibold mt-0.5 transition-all duration-300 ${isActive ? 'text-[#000000] opacity-100' : 'text-black opacity-0 transform translate-y-1'}`}>
            {label}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#ffffff] font-sans pb-24 text-black selection:bg-[#84cc16]">
      


      {/* Main Content Area */}
      <main className="px-6 pt-12 pb-2 animate-fade-in max-w-lg mx-auto">
        
        {/* Profile Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#000000] mb-1 tracking-tight">
              Hello, {student.name.split(' ')[0]} 👋
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-white text-black px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide border border-black shadow-sm">
                ID: {student.id}
              </span>
              <span className="bg-[#000000]/5 text-[#000000] px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide border border-[#000000]/10 shadow-sm">
                {student.course}
              </span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#000000] to-[#84cc16] flex items-center justify-center shadow-lg border-2 border-white overflow-hidden shrink-0 transform rotate-3">
            <span className="text-2xl -rotate-3">🧑🏻‍🎓</span>
          </div>
        </div>

        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Fee Overview Card */}
            <div className="bg-[#000000] rounded-[24px] p-6 shadow-[0_20px_40px_-15px_rgba(22,33,62,0.5)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#84cc16]/20 rounded-full blur-3xl group-hover:bg-[#84cc16]/30 transition-colors"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#84cc16]/20 rounded-full blur-3xl group-hover:bg-[#84cc16]/30 transition-colors"></div>

              <div className="relative flex justify-between items-center mb-8">
                <h2 className="text-white font-semibold tracking-wide text-sm uppercase">Fee Overview</h2>
                <button className="text-[10px] uppercase font-bold tracking-wider text-white/70 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 transition-colors">
                  Details <ChevronRight size={12} />
                </button>
              </div>

              <div className="relative grid grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText size={12} className="text-black" />
                    <p className="text-black text-[10px] uppercase font-bold tracking-wider">Total</p>
                  </div>
                  <p className="text-white font-bold text-lg tracking-tight">{formatCurrency(student.yearlyFee)}</p>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 size={12} className="text-[#84cc16]" />
                    <p className="text-black text-[10px] uppercase font-bold tracking-wider">Paid</p>
                  </div>
                  <p className="text-white font-bold text-lg tracking-tight">{formatCurrency(paid)}</p>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Wallet size={12} className="text-[#84cc16]" />
                    <p className="text-black text-[10px] uppercase font-bold tracking-wider">Due</p>
                  </div>
                  <p className="text-white font-bold text-lg tracking-tight">{formatCurrency(remaining)}</p>
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between text-[11px] mb-2 font-medium">
                  <span className="text-black">Progress</span>
                  <span className="text-white">{pct}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-[#84cc16] to-[#84cc16] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>



            {/* Recent Payments */}
            <div className="mt-8">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[#000000] font-bold text-lg tracking-tight">Transactions</h3>
                <button className="text-[#000000] text-[11px] font-bold uppercase tracking-wider hover:text-[#84cc16] transition-colors flex items-center gap-1 group">
                  See All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="bg-white border border-black/60 rounded-[24px] p-2 shadow-sm">
                {sorted.length === 0 ? (
                  <div className="p-8 text-center text-black text-sm font-medium">No payments yet.</div>
                ) : (
                  sorted.slice(0, 3).map((p, i) => {
                    const d = new Date(p.date);
                    const monthYear = d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
                    const day = d.toLocaleDateString('en-GB', { day: '2-digit' });
                    
                    return (
                      <div key={p.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-[#ffffff] transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#84cc16] text-[#84cc16] flex items-center justify-center shrink-0 border border-[#84cc16]/50">
                            <CheckCircle2 size={22} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-[#000000] font-bold text-sm mb-0.5">{monthYear} {day}</p>
                            <p className="text-black text-[11px] font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                              Success <span className="w-1 h-1 rounded-full bg-white"></span> {p.mode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pr-2">
                          <p className="text-[#000000] font-bold text-base">{formatCurrency(p.amount)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>




            
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#000000] tracking-tight">Payment History</h2>
                <p className="text-black text-[11px] font-semibold mt-1">All your past transactions</p>
              </div>
              <button className="bg-[#000000] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-[#84cc16] transition-colors shadow-lg shadow-[#000000]/20">
                Pay Now
              </button>
            </div>

            <div className="bg-white border border-black/60 rounded-[24px] p-2 shadow-sm">
              {sorted.length === 0 ? (
                <div className="p-8 text-center text-black text-sm font-medium">No payments yet.</div>
              ) : (
                sorted.map((p) => {
                  const d = new Date(p.date);
                  const monthYear = d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
                  const day = d.toLocaleDateString('en-GB', { day: '2-digit' });
                  
                  return (
                    <div key={p.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-[#ffffff] transition-colors cursor-pointer border-b border-black last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#84cc16] text-[#84cc16] flex items-center justify-center shrink-0 border border-[#84cc16]/50">
                          <CheckCircle2 size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[#000000] font-bold text-sm mb-0.5">{monthYear} {day}</p>
                          <p className="text-black text-[11px] font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                            Success <span className="w-1 h-1 rounded-full bg-white"></span> {p.mode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pr-2">
                        <p className="text-[#000000] font-bold text-base">{formatCurrency(p.amount)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Receipts Tab */}
        {activeTab === 'receipts' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#000000] tracking-tight">Tax Receipts</h2>
              <p className="text-black text-[11px] font-semibold mt-1">Download your payment invoices</p>
            </div>

            <div className="grid gap-4">
              {sorted.length === 0 ? (
                <div className="bg-white border border-black/60 rounded-[24px] p-8 text-center text-black text-sm font-medium shadow-sm">
                  No receipts available.
                </div>
              ) : (
                sorted.map((p) => {
                  const d = new Date(p.date);
                  const monthYear = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
                  return (
                    <div key={p.id} className="bg-white border border-black/60 rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#84cc16] text-[#84cc16] flex items-center justify-center shrink-0 border border-[#84cc16]/50 group-hover:scale-105 transition-transform">
                          <Receipt size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[#000000] font-bold text-sm tracking-tight">Receipt #{p.id.slice(0,6)}</h3>
                          <p className="text-black text-[11px] font-semibold mt-0.5">{monthYear} • {formatCurrency(p.amount)}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); downloadReceipt(p); }}
                        className="w-10 h-10 rounded-xl bg-[#ffffff] text-black flex items-center justify-center border border-black group-hover:bg-[#000000] group-hover:text-white group-hover:border-[#000000] transition-all">
                        <Download size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in pb-4">
            <div className="bg-white border border-black/60 rounded-[24px] p-6 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#84cc16] to-[#84cc16]"></div>
              
              <div className="relative mt-4">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-white p-2 shadow-xl mb-4">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#000000] to-[#84cc16] flex items-center justify-center text-4xl transform rotate-3">
                    <span className="-rotate-3">🧑🏻‍🎓</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#000000] tracking-tight">{student.name}</h2>
                <p className="text-black text-xs font-bold uppercase tracking-wider mt-1">{student.course}</p>
                
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="bg-[#ffffff] text-black px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide border border-black">
                    ID: {student.id}
                  </span>
                  <span className="bg-[#84cc16] text-[#84cc16] px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide border border-[#84cc16]">
                    Active Student
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/60 rounded-[24px] p-5 shadow-sm space-y-4">
              <h3 className="text-[#000000] font-bold text-sm tracking-tight mb-2">Personal Information</h3>
              

              
              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#ffffff] transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#84cc16] text-[#84cc16] flex items-center justify-center shrink-0">
                  <Phone size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-black text-[10px] font-bold uppercase tracking-wider">Phone Number</p>
                  <p className="text-[#000000] font-semibold text-sm">{student.phone}</p>
                </div>
              </div>


            </div>

            <button
              onClick={() => {
                logoutStudent();
                navigate('/student/login', { replace: true });
              }}
              className="w-full flex items-center justify-center gap-2 bg-white border border-[#84cc16] text-[#84cc16] px-4 py-4 rounded-[20px] text-sm font-bold shadow-sm hover:bg-[#84cc16] hover:border-[#84cc16] transition-all group"
            >
              <LogOut size={18} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out Securely
            </button>
          </div>
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-black/50 flex justify-around items-center px-4 pb-safe pt-3 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] max-w-lg mx-auto rounded-t-3xl">
        <NavItem id="home" icon={Home} label="Home" />
        <NavItem id="payments" icon={CreditCard} label="Payments" />
        <NavItem id="receipts" icon={Receipt} label="Receipts" />
        <NavItem id="profile" icon={User} label="Profile" />
        {/* iOS Home Indicator space */}
        <div className="w-1/3 h-1 bg-white rounded-full absolute bottom-2 left-1/3"></div>
      </nav>
    </div>
  );
}
