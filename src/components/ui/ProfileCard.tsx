import React from 'react';
import { Calendar, ExternalLink, Share2 } from 'lucide-react';
import { Card } from './Card';
import type { MemberApplication } from '../../lib/firebase';

interface ProfileCardProps {
  item: MemberApplication;
  onClick?: () => void;
  onShare?: (e: React.MouseEvent) => void;
  showShare?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  item, 
  onClick, 
  onShare,
  showShare = false 
}) => {
  return (
    <Card
      key={item.id}
      className="p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border border-gray-100 rounded-2xl relative group overflow-hidden cursor-pointer"
      onClick={onClick}
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
            <div className="w-full flex items-center gap-2">
              <span
                className="inline-block max-w-[95%] truncate px-2.5 py-1 md:px-3 md:py-1 bg-primary/10 text-primary rounded-full text-[10px] md:text-xs font-bold tracking-wide uppercase align-top"
                title={item.category}
              >
                {item.category}
              </span>
              {showShare && (
                <button
                  onClick={onShare}
                  className="p-1.5 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-primary/5"
                  title="Share Profile"
                >
                  <Share2 size={14} />
                </button>
              )}
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
              <span className="w-14 md:w-20 shrink-0 text-gray-400 font-medium">Service</span>
              <span className="font-medium text-gray-600 leading-snug line-clamp-2 md:line-clamp-3 break-words flex-1 min-w-0" title={item.service}>{item.service}</span>
            </div>
          </div>

          <div className="pt-3 md:pt-5 mt-auto">
            <div className="flex items-center text-[10px] md:text-xs text-gray-400 font-medium border-t border-gray-100 pt-3">
              <Calendar size={12} className="mr-1.5 shrink-0" />
              <span className="truncate">{item.submittedAt?.toDate ? item.submittedAt.toDate().toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Square Image */}
        <div className="shrink-0 flex flex-col items-center w-[100px] md:w-[140px] relative pb-2 md:pb-3">
          <div className="w-full aspect-square rounded-full overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02] border border-gray-100">
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
  );
};
