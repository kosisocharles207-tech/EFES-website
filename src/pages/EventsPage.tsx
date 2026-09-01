import React, { useState } from 'react';
import { useEFES } from '../context/EFESContext';
import {
  Calendar,
  Newspaper,
  Trophy,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  Plus,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const EventsPage: React.FC = () => {
  const { events, news, currentAdmin, setCurrentPage } = useEFES();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'EVENTS' | 'NEWS'>('ALL');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  const selectedArticle = news.find((n) => n.id === selectedNewsId);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/80 via-zinc-950 to-amber-950/80 p-6 md:p-10 shadow-[0_0_35px_rgba(245,158,11,0.2)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/40 px-3.5 py-1 text-xs font-bold text-amber-300 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Official EFES Calendar & Gazette</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              EVENTS & <span className="gold-gradient-text">NEWS</span>
            </h1>
            <p className="mt-2 text-xs md:text-sm text-zinc-300 leading-relaxed">
              Stay ahead of upcoming tournaments, Ballon d&apos;Or announcements, registration dates, and
              tactical bulletins.
            </p>
          </div>

          {currentAdmin && (
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentPage('admin');
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-3 text-xs font-black text-black shadow-lg hover:scale-102 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Events & News</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveFilter('ALL');
          }}
          className={`rounded-2xl px-5 py-2.5 text-xs font-extrabold transition-all ${
            activeFilter === 'ALL'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900'
          }`}
        >
          All Updates
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setActiveFilter('EVENTS');
          }}
          className={`rounded-2xl px-5 py-2.5 text-xs font-extrabold transition-all ${
            activeFilter === 'EVENTS'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900'
          }`}
        >
          📅 Upcoming Events ({events.length})
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setActiveFilter('NEWS');
          }}
          className={`rounded-2xl px-5 py-2.5 text-xs font-extrabold transition-all ${
            activeFilter === 'NEWS'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900'
          }`}
        >
          📰 Latest News ({news.length})
        </button>
      </div>

      {/* EVENTS SECTION */}
      {(activeFilter === 'ALL' || activeFilter === 'EVENTS') && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-2xl font-black uppercase text-white">
              Official Tournaments & Galas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#14141e] to-[#0a0a0f] p-6 shadow-xl hover:border-amber-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                        {event.type}
                      </span>
                      {event.featured && (
                        <span className="rounded-md bg-yellow-400/20 px-2 py-0.5 text-[10px] font-extrabold text-yellow-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                        event.status === 'REGISTRATION_OPEN'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {event.status === 'REGISTRATION_OPEN' ? '🟢 Registration Open' : 'Upcoming'}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-black uppercase text-white group-hover:text-amber-300 transition-colors">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-xs md:text-sm text-zinc-300 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-2 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-3.5 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Date / Window: <strong>{event.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Arena: <strong>{event.locationOrPlatform}</strong></span>
                    </div>
                    {event.prizePool && (
                      <div className="flex items-center gap-2 text-amber-300">
                        <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Silverware Stakes: <strong>{event.prizePool}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NEWS SECTION */}
      {(activeFilter === 'ALL' || activeFilter === 'NEWS') && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Newspaper className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-2xl font-black uppercase text-white">
              EFES Official News & Recaps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedNewsId(item.id);
                }}
                className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-lg hover:border-amber-500/40 hover:-translate-y-1 transition-all"
              >
                {item.imageUrl && (
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 rounded-md bg-zinc-950/90 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-300">
                      {item.category}
                    </span>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-zinc-500 mb-1">
                      {item.date} • By {item.author}
                    </div>
                    <h3 className="font-display text-base font-bold uppercase text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                    <span>Read Full Bulletin</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Full News Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-500/40 bg-[#0e0e16] p-6 md:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <span className="rounded-md bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                {selectedArticle.category} • {selectedArticle.date}
              </span>
              <button
                onClick={() => setSelectedNewsId(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <h3 className="font-display text-2xl font-black uppercase text-white">
              {selectedArticle.title}
            </h3>

            <p className="text-xs text-zinc-400 mt-1 mb-4">Authored by {selectedArticle.author}</p>

            <div className="prose prose-invert max-w-none text-xs md:text-sm text-zinc-300 leading-relaxed space-y-3">
              <p className="font-semibold text-amber-200/90">{selectedArticle.summary}</p>
              <p>{selectedArticle.content}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedNewsId(null)}
                className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700"
              >
                Close Bulletin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
