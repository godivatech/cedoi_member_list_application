import React, { useEffect, useState } from 'react';
import { getWebsiteFormSubmissions } from '../lib/firebase';
import type { MemberApplication } from '../lib/firebase';
import { cn } from '../lib/utils';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { Input } from './ui/Input';
import { Download, Search, Lock, LogOut, X, Edit2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileCard } from './ui/ProfileCard';
import { EditBusinessForm } from './EditBusinessForm';

export const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<MemberApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MemberApplication | null>(null);
  const [editingItem, setEditingItem] = useState<MemberApplication | null>(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState<string | null>(null);

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exportData = submissions.map(({ id, submittedAt, ...rest }) => ({
      ...rest,
      submittedAt: submittedAt?.toDate ? submittedAt.toDate().toLocaleString() : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
    XLSX.writeFile(workbook, `Business_Listing_Export_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopyTooltip(id);
      setTimeout(() => setShowCopyTooltip(null), 2000);
    });
  };

  const filteredData = submissions.filter(s =>
    s.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone?.includes(searchTerm) ||
    s.service?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div key={item.id} className="relative">
              <ProfileCard
                item={item}
                onClick={() => setSelectedItem(item)}
                onShare={(e) => handleShare(e, item.id)}
                showShare={true}
              />
              <AnimatePresence>
                {showCopyTooltip === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded-md font-bold z-50 pointer-events-none"
                  >
                    LINK COPIED!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  onClick={() => {
                    setEditingItem(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="p-2 rounded-full bg-white/90 hover:bg-white text-primary shadow-sm backdrop-blur-md transition-colors"
                  title="Edit member"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    selectedItem.photoUrl ? "bg-black/20 hover:bg-black/40 text-white backdrop-blur-md" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  )}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

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
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Service Description</span>
                      <p className="font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {selectedItem.service}
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

      {/* Edit Form Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setEditingItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <EditBusinessForm
                item={editingItem}
                onClose={() => setEditingItem(null)}
                onUpdate={fetchData}
              />
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