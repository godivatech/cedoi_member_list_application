import React, { useEffect, useState } from 'react';
import { getWebsiteFormSubmissions } from '../lib/firebase';
import { cn } from '../lib/utils';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { Input } from './ui/Input';
import { Download, Search, ExternalLink, Calendar, Lock, LogOut } from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

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
            <Card key={item.id} className="p-0 overflow-hidden hover:border-primary/30 transition-colors bg-white">
              <div className="flex flex-col md:flex-row">
                {item.photoUrl && (
                  <div className="w-full md:w-48 h-48 md:h-auto shrink-0 bg-background-secondary border-b md:border-b-0 md:border-r border-border">
                    <img src={item.photoUrl} alt={item.businessName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{item.businessName}</h3>
                      <p className="text-primary font-medium text-sm">{item.category}</p>
                    </div>
                    <div className="text-right text-xs text-text-secondary flex items-center gap-1">
                      <Calendar size={12} />
                      {item.submittedAt?.toDate ? item.submittedAt.toDate().toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mt-4">
                    <div>
                      <span className="block text-xs font-bold text-text-secondary uppercase tracking-tight">Owner</span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-text-secondary uppercase tracking-tight">Phone</span>
                      <span className="text-sm font-medium">{item.phone}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="block text-xs font-bold text-text-secondary uppercase tracking-tight">Address</span>
                      <span className="text-sm leading-relaxed whitespace-pre-wrap">{item.address}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <a 
                      href={item.photoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary text-xs font-bold flex items-center hover:underline"
                    >
                      VIEW FULL IMAGE <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
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
