import React, { useEffect, useState } from 'react';
import { getWebsiteFormSubmissions } from '../lib/firebase';
import { cn } from '../lib/utils';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { Input } from './ui/Input';
import { Download, Search, ExternalLink, Calendar, Lock, LogOut, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authorized');
    if (savedAuth === 'true') {
      setIsAuthorized(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getWebsiteFormSubmissions('member-applications');
      setSubmissions(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = import.meta.env.VITE_ADMIN_ACCESS_CODE || 'GODIVA2026';

    if (passcode === correctCode) {
      setIsAuthorized(true);
      localStorage.setItem('admin_authorized', 'true');
      fetchData();
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem('admin_authorized');
    setPasscode('');
  };

  const exportToExcel = () => {
    const exportData = submissions.map(({ id, submittedAt, ...rest }) => ({
      ...rest,
      submittedAt: submittedAt?.toDate ? submittedAt.toDate().toLocaleString() : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
    XLSX.writeFile(workbook, `Business_Listing_Export_${new Date().toLocaleDateString()}.xlsx`);
  };

  const filteredData = submissions.filter(s =>
    s.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone?.includes(searchTerm)
  );

  // --- LOGIN SCREEN ---
  if (!isAuthorized && !loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center border-none shadow-premium bg-white">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <Lock size={28} />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">Admin Access</h2>
            <p className="text-text-secondary mb-8">Enter your secure passcode to view submissions</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter Passcode"
                  className={cn(
                    "h-14 text-center text-xl tracking-[0.5em] font-bold",
                    authError ? "border-red-500 animate-shake" : ""
                  )}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" className="h-14 text-sm font-bold tracking-widest uppercase">
                Verify Access
              </Button>
            </form>

            <AnimatePresence>
              {authError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm font-bold mt-4"
                >
                  Incorrect passcode. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size={40} /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">Admin Dashboard</h1>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">Secure</span>
          </div>
          <p className="text-text-secondary">Manage and export business listing submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="h-12 px-6 font-bold text-sm tracking-wide bg-white"
          >
            <Download size={16} className="mr-1" strokeWidth={3} />
            EXPORT TO EXCEL
          </Button>
          <button
            onClick={handleLogout}
            className="p-3 text-text-secondary hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
        <input
          type="text"
          placeholder="Search by business name, owner, or phone..."
          className="input-field pl-10 h-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">No submissions found.</div>
        ) : (
          filteredData.map((item) => (
            <Card
              key={item.id}
              className="p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border border-gray-100 rounded-2xl relative group overflow-hidden cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex flex-row items-start justify-between gap-4 md:gap-6">

                {/* Left Side: Information */}
                <div className="flex flex-col flex-1 min-w-0 pr-2 md:pr-4">
                  <div className="mb-2 md:mb-3">
                    <h3
                      className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight leading-tight mb-1.5 line-clamp-2 break-words"
                      title={item.businessName}
                    >
                      {item.businessName}
                    </h3>
                    <div className="w-full">
                      <span
                        className="inline-block max-w-[95%] truncate px-2.5 py-1 md:px-3 md:py-1 bg-primary/10 text-primary rounded-full text-[10px] md:text-xs font-bold tracking-wide uppercase align-top"
                        title={item.category}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2.5 mt-1 text-[11px] md:text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="w-14 md:w-20 shrink-0 text-gray-400 font-medium pt-0.5">Name</span>
                      <span className="font-semibold text-gray-800 line-clamp-1 break-words flex-1 min-w-0 pt-0.5" title={item.name}>{item.name}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-14 md:w-20 shrink-0 text-gray-400 font-medium">Phone</span>
                      <span className="font-bold text-gray-800 truncate flex-1 min-w-0">{item.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-14 md:w-20 shrink-0 text-gray-400 font-medium">Address</span>
                      <span className="font-medium text-gray-600 leading-snug line-clamp-2 md:line-clamp-3 break-words flex-1 min-w-0" title={item.address}>{item.address}</span>
                    </div>
                  </div>

                  <div className="pt-3 md:pt-5 mt-auto">
                    <div className="flex items-center text-[10px] md:text-xs text-gray-400 font-medium border-t border-gray-100 pt-3">
                      <Calendar size={12} className="mr-1.5 shrink-0" />
                      <span className="truncate">{item.submittedAt?.toDate ? item.submittedAt.toDate().toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Square Image (Swiggy/Food Menu Style) */}
                <div className="shrink-0 flex flex-col items-center w-[100px] md:w-[140px] relative pb-2 md:pb-3">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02] border border-gray-100">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.businessName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider block text-center leading-tight">No<br />Image</span>
                    )}
                  </div>
                  {item.photoUrl && (
                    <a
                      href={item.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -bottom-2 md:-bottom-1 left-1/2 -translate-x-1/2 px-4 py-1.5 md:px-6 md:py-2 rounded-xl bg-white border border-gray-200 text-green-600 text-[10px] md:text-xs font-extrabold flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md hover:border-green-200 transition-all z-10 whitespace-nowrap"
                    >
                      VIEW <ExternalLink size={12} className="ml-1" />
                    </a>
                  )}
                </div>

              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal for Full Item Details */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className={cn(
                  "absolute top-4 right-4 z-10 p-2 rounded-full transition-colors",
                  selectedItem.photoUrl ? "bg-black/20 hover:bg-black/40 text-white backdrop-blur-md" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                )}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="flex-1 overflow-y-auto w-full">
                {selectedItem.photoUrl && (
                  <div className="w-full h-64 sm:h-80 bg-gray-100 flex items-center justify-center relative shrink-0">
                    <img src={selectedItem.photoUrl} alt={selectedItem.businessName} className="w-full h-full object-contain" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>
                )}

                <div className={cn("p-6 sm:p-8", !selectedItem.photoUrl && "pt-12")}>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wide uppercase">
                      {selectedItem.category}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
                    {selectedItem.businessName}
                  </h3>

                  <div className="space-y-5 text-sm sm:text-base text-gray-700 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Owner Name</span>
                      <span className="font-semibold text-gray-900">{selectedItem.name}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Number</span>
                      <span className="font-semibold text-gray-900">{selectedItem.phone}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Address</span>
                      <p className="font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {selectedItem.address}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Submitted On</span>
                      <span className="font-medium text-gray-600">
                        {selectedItem.submittedAt?.toDate ? selectedItem.submittedAt.toDate().toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  .animate-shake {
    animation: shake 0.2s ease-in-out 0s 2;
  }
`;
document.head.appendChild(style);
