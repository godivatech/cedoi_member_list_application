import React, { useEffect, useState } from 'react';
import { getWebsiteFormSubmissions } from '../lib/firebase';
import type { MemberApplication } from '../lib/firebase';
import { cn } from '../lib/utils';
import { Spinner } from './ui/Spinner';
import { Search, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileCard } from './ui/ProfileCard';

export const MemberDirectory: React.FC = () => {
  const [submissions, setSubmissions] = useState<MemberApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MemberApplication | null>(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getWebsiteFormSubmissions('member-applications');
      // Sort: godiva first
      const sortedData = [...data].sort((a, b) => {
        const nameA = a.businessName?.toLowerCase() || '';
        const nameB = b.businessName?.toLowerCase() || '';
        const isAGodiva = nameA.includes('godiva');
        const isBGodiva = nameB.includes('godiva');

        if (isAGodiva && !isBGodiva) return -1;
        if (!isAGodiva && isBGodiva) return 1;
        return 0;
      });
      setSubmissions(sortedData);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
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
    s.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size={40} /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full text-primary mb-4">
          <Users size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-2">Member Directory</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Connect with our verified business members and explore their services.
        </p>
      </div>

      <div className="relative mb-8 max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
        <input
          type="text"
          placeholder="Search by business name, owner, or category..."
          className="input-field pl-12 h-14 text-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-text-secondary font-medium">No members found matching your search.</p>
          </div>
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
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Service Description</span>
                      <p className="font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {selectedItem.service}
                      </p>
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
