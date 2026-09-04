import React from 'react';

export const DashboardLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse pt-2" aria-busy="true" aria-label="Loading student dashboard">
      <div className="flex justify-between items-center pb-4 border-b border-stone-200">
        <div className="space-y-2">
          <div className="h-4 bg-stone-200 rounded w-28" />
          <div className="h-6 bg-stone-200 rounded w-44" />
        </div>
        <div className="h-6 bg-stone-200 rounded-full w-24" />
      </div>
      <div className="h-44 bg-stone-200 rounded-2xl w-full" />
      <div className="h-40 bg-stone-200 rounded-2xl w-full" />
      <div className="h-28 bg-stone-200 rounded-2xl w-full" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 bg-stone-200 rounded-2xl" />
        <div className="h-24 bg-stone-200 rounded-2xl" />
      </div>
    </div>
  );
};

interface DashboardErrorViewProps {
  errorMessage?: string;
  onRetry: () => void;
}

export const DashboardErrorView: React.FC<DashboardErrorViewProps> = ({
  errorMessage = 'ড্যাশবোর্ড লোড করার সময় একটি সমস্যা হয়েছে।',
  onRetry,
}) => {
  return (
    <div className="text-center py-12 px-4 space-y-4 bg-white rounded-2xl border border-stone-200 mt-4">
      <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">
        !
      </div>
      <div>
        <h3 className="text-base font-bold text-stone-900">Something went wrong</h3>
        <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
          {errorMessage}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm"
      >
        পুনরায় চেষ্টা করুন (Retry)
      </button>
    </div>
  );
};