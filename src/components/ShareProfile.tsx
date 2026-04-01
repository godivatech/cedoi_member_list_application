import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWebsiteFormSubmissionById } from '../lib/firebase';
import type { MemberApplication } from '../lib/firebase';
import { Spinner } from './ui/Spinner';
import { Button } from './ui/Button';
import { ArrowLeft, UserPlus, X } from 'lucide-react';
import { ProfileCard } from './ui/ProfileCard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export const ShareProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<MemberApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItem(id);
    }
  }, [id]);

  const fetchItem = async (uid: string) => {
    setLoading(true);
    try {
      const data = await getWebsiteFormSubmissionById('member-applications', uid);
      if (data) {
        setItem(data);
        setIsModalOpen(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size={40} /></div>;

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center py-20">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Profile Not Found</h2>
        <p className="text-text-secondary mb-8">The profile you are looking for does not exist or has been removed.</p>
        <Link to="/directory">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-2" /> Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-20">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/directory" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium">
          <ArrowLeft size={18} />
          <span>Directory</span>
        </Link>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-widest">
          Verified Member
        </span>
      </div>

      <div className="mb-12">
        <div className="relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <ProfileCard item={item} />
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-primary shadow-sm">
              CLICK TO VIEW DETAILS
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Want to list your business?</h3>
        <p className="text-gray-600 mb-6">Join our growing community of professionals and reach more customers.</p>
        <Link to="/">
          <Button className="h-14 px-8 rounded-2xl font-bold text-sm tracking-widest uppercase">
            <UserPlus size={18} className="mr-2" /> Register Now
          </Button>
        </Link>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className={cn(
                  "absolute top-4 right-4 z-10 p-2 rounded-full transition-colors",
                  item.photoUrl ? "bg-black/20 hover:bg-black/40 text-white backdrop-blur-md" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                )}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                {item.photoUrl && (
                  <div className="w-full h-64 sm:h-80 bg-gray-100 flex items-center justify-center relative shrink-0">
                    <img src={item.photoUrl} alt={item.businessName} className="w-full h-full object-contain" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>
                )}

                <div className={cn("p-6 sm:p-8", !item.photoUrl && "pt-12")}>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wide uppercase">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
                    {item.businessName}
                  </h3>

                  <div className="space-y-5 text-sm sm:text-base text-gray-700 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Owner Name</span>
                      <span className="font-semibold text-gray-900">{item.name}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Number</span>
                      <span className="font-semibold text-gray-900">{item.phone}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Service Description</span>
                      <p className="font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {item.service}
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
