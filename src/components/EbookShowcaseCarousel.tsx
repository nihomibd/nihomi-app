import React, { useState } from 'react';
import { BookOpen, Download, ShoppingBag, Sparkles, ChevronRight, Star, X } from 'lucide-react';
import { NihomiBookReader } from './NihomiBookReader';

interface EbookItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  coverImage: string;
  pages: number;
  price: string;
  level: string;
  bookType?: 'vocabulary' | 'grammar' | 'kanji';
}

export const EbookShowcaseCarousel: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<EbookItem | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const ebooks: EbookItem[] = [
    {
      id: 'eb-particles',
      title: 'Japanese Particles Complete Guide',
      subtitle: 'জাপানিজ ২১টি গুরুত্বপূর্ণ পার্টিকেলের সম্পূর্ণ গাইড ও উদাহরণ',
      badge: 'বাংলা এডিশন',
      coverImage: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=600&auto=format&fit=crop&q=80',
      pages: 120,
      price: 'ফ্রি (কোর্সের সাথে)',
      level: 'N5 - N4',
      bookType: 'grammar'
    },
    {
      id: 'eb-n2-vocab',
      title: 'JLPT N2 Vocabulary Master',
      subtitle: 'সম্পূর্ণ N2 শব্দতালিকা (১,৭৪৮ শব্দ) বাংলা অর্থসহ',
      badge: 'Bestseller',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      pages: 240,
      price: '৳২৯৯',
      level: 'N2',
      bookType: 'vocabulary'
    },
    {
      id: 'eb-spoken',
      title: 'Ghore Boshe Spoken Japanese',
      subtitle: 'টোকিওতে চাকরি ও প্রাত্যহিক জীবনের ৯৯টি বাস্তব ডায়ালগ',
      badge: 'New Launch',
      coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
      pages: 180,
      price: '৳৩৪৯',
      level: 'All Levels',
      bookType: 'kanji'
    }
  ];

  return (
    <div
      className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl my-10 max-w-6xl mx-auto backdrop-blur-sm"
      id="component-ebook-showcase-carousel"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
        <div className="inline-flex items-center space-x-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ইবুক লাইব্রেরি</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">পড়ার জন্য ইবুক ও মাস্টারবই 📚</h2>
        <p className="text-xs md:text-sm text-slate-400">
          স্ক্রল করে আপনার পছন্দের বই বেছে নিন — অনলাইনে পাতা উল্টে পড়ুন অথবা PDF ডাউনলোড করুন
        </p>
      </div>

      {/* Books Grid / Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ebooks.map((book) => (
          <div
            key={book.id}
            className="bg-slate-950 border border-slate-800 hover:border-red-500/40 rounded-3xl p-5 shadow-xl transition duration-300 flex flex-col justify-between group"
            id={`ebook-card-${book.id}`}
          >
            <div>
              {/* Cover Mockup */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 border border-slate-800 group-hover:shadow-2xl group-hover:shadow-red-500/10 transition">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85" />
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  {book.badge}
                </span>
                <span className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
                  {book.level}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="font-bold text-white text-base line-clamp-1">{book.title}</div>
                  <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{book.subtitle}</div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-400">{book.price}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedBook(book);
                  setIsReaderOpen(true);
                }}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                id={`btn-open-book-${book.id}`}
              >
                <span>বই খুলুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Modal Reader */}
      {isReaderOpen && selectedBook && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          id="modal-ebook-reader"
        >
          <div className="w-full max-w-5xl relative my-auto">
            <button
              type="button"
              onClick={() => setIsReaderOpen(false)}
              className="absolute -top-10 right-0 text-slate-300 hover:text-white text-xs font-semibold bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer border border-slate-700"
              id="btn-close-ebook-reader"
            >
              <X className="w-3.5 h-3.5" />
              <span>বন্ধ করুন (Esc)</span>
            </button>
            <NihomiBookReader
              bookType={selectedBook.bookType || 'vocabulary'}
              onClose={() => setIsReaderOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default EbookShowcaseCarousel;
