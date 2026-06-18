'use client';
import { useSettings } from '@/hooks/useSettings';
import { CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const { data, isLoading } = useSettings();
  const s = data?.data;
  const about = s?.aboutContent;

  const heading    = about?.heading    || '';
  const subheading = about?.subheading || '';
  const body       = about?.body       || '';
  const mission    = about?.mission    || '';
  const vision     = about?.vision     || '';
  const highlights = about?.highlights?.filter(Boolean) ?? [];
  const storeName  = s?.storeName      || 'Our Store';

  const hasContent = heading || body || mission || vision || highlights.length > 0;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/2" />
        <div className="h-5 bg-gray-100 rounded w-1/3" />
        <div className="h-32 bg-gray-100 rounded mt-8" />
      </div>
    );
  }

  if (!hasContent) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="text-6xl mb-4">🏪</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">About {storeName}</h1>
        <p className="text-gray-400 text-lg">
          Our story is coming soon. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{heading || `About ${storeName}`}</h1>
        {subheading && <p className="text-xl text-gray-500">{subheading}</p>}
      </div>

      {/* Main body */}
      {body && (
        <div className="text-gray-600 mb-10 whitespace-pre-line leading-relaxed text-lg">
          {body}
        </div>
      )}

      {/* Mission + Vision */}
      {(mission || vision) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {mission && (
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-2">🎯 Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">{mission}</p>
            </div>
          )}
          {vision && (
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-800 mb-2">🔭 Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">{vision}</p>
            </div>
          )}
        </div>
      )}

      {/* Why Choose Us */}
      {highlights.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Why Choose {storeName}?</h2>
          <ul className="space-y-3">
            {highlights.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
