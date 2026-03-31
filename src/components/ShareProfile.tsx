import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWebsiteFormSubmissionById } from '../lib/firebase';
import type { MemberApplication } from '../lib/firebase';
import { Spinner } from './ui/Spinner';
import { Button } from './ui/Button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { ProfileCard } from './ui/ProfileCard';

export const ShareProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<MemberApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        <ProfileCard item={item} />
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
    </div>
  );
};
