'use client';
import { useSettings } from '@/hooks/useSettings';
import { CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const { data } = useSettings();
  const s = data?.data;
  const about = s?.aboutContent;

  const heading     = about?.heading     || 'About Us';
  const subheading  = about?.subheading  || '';
  const body        = about?.body        || '';
  const mission     = about?.mission     || '';
  const vision      = about?.vision      || '';
  const highlights  = about?.highlights?.filter(Boolean) ?? [];
  const storeName   = s?.storeName       || 'Our Store';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{heading}</h1>
        {subheading && <p className="text-xl text-gray-500">{subheading}</p>}
      </div>

      {/* Main body */}
      {body && (
        <div className="prose prose-lg text-gray-600 mb-10 whitespace-pre-line leading-relaxed">
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

      {/* Why Choose Us highlights */}
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

      {/* Fallback if nothing is filled yet */}
      {!body && !mission && !vision && highlights.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">About page content not set yet.</p>
          <p className="text-sm mt-1">Go to <strong>Admin → Settings → About Page</strong> to add your content.</p>
        </div>
      )}
    </div>
  );
}
