import React from 'react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 break-words">{lead.companyName}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                {lead.category}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                {lead.region}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                lead.confidenceScore > 80 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
              }`}>
                {lead.confidenceScore}% Match
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
             {lead.socialLinks.linkedin && (
                <a href={lead.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0077b5] transition-colors p-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
             )}
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 line-clamp-3">
          {lead.summary}
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <svg className="w-4 h-4 text-slate-400 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <div className="flex-1 break-all">
              {lead.emails.length > 0 ? (
                lead.emails.map((email, i) => (
                  <a key={i} href={`mailto:${email}`} className="block text-blue-600 hover:underline">{email}</a>
                ))
              ) : (
                <span className="text-slate-400 italic">No email found</span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <svg className="w-4 h-4 text-slate-400 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <div className="flex-1">
              {lead.phones.length > 0 ? (
                lead.phones.map((phone, i) => (
                  <span key={i} className="block text-slate-700">{phone}</span>
                ))
              ) : (
                 <span className="text-slate-400 italic">No phone found</span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <svg className="w-4 h-4 text-slate-400 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <div className="flex-1 truncate">
               {lead.website ? (
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">
                  {lead.website.replace(/^https?:\/\//, '')}
                </a>
               ) : (
                <span className="text-slate-400 italic">No website</span>
               )}
            </div>
          </div>
          
           <div className="flex items-start gap-3 text-sm">
            <svg className="w-4 h-4 text-slate-400 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-slate-700">{lead.address || "Address not verified"}</span>
          </div>
        </div>

        {lead.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
             <p className="text-xs text-slate-400 mb-2">Verified via:</p>
             <div className="flex flex-wrap gap-2">
               {lead.sources.map((src, idx) => (
                 <a key={idx} href={src.uri} target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 truncate max-w-[150px]" title={src.title}>
                   {src.title}
                 </a>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};