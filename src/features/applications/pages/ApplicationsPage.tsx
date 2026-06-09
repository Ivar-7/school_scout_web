import { useState } from 'react';
import { useParentApplications } from '../hooks/useApplications';
import { ApplicationCard } from '../components/ApplicationCard';
import { ApplicationForm } from './AdmissionFormsPage';
import { FileText, Plus, Search, X } from 'lucide-react';
import type { ApplicationStatus } from '../types/applications.types';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="w-20 h-6 bg-gray-200 rounded-full" />
    </div>
  </div>
);

const EmptyState = ({ onNew }: { onNew: () => void }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
      <FileText className="w-8 h-8 text-green-600" />
    </div>
    <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2">
      No applications yet
    </h3>
    <p className="text-gray-500 text-sm max-w-sm mb-6">
      Browse schools and apply directly through SchoolScout. Track all your
      applications here.
    </p>
    <div className="flex gap-3">
      <a
        href="/schools"
        className="border border-green-700 text-green-700 hover:bg-green-50 font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
      >
        Browse Schools
      </a>
      <button
        onClick={onNew}
        className="bg-green-700 hover:bg-green-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
      >
        New Application
      </button>
    </div>
  </div>
);

const STATUS_FILTERS: Array<{ key: 'all' | ApplicationStatus; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'more_info', label: 'More Info' },
];

export default function ApplicationsPage() {
  const { applications, loading, error, submitting, submit } =
    useParentApplications();

  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [prefilledSchoolId, setPrefilledSchoolId] = useState('');
  const [prefilledSchoolName, setPrefilledSchoolName] = useState('');

  const filtered = applications.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch =
      a.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleNewApplication = () => {
    const params = new URLSearchParams(window.location.search);
    setPrefilledSchoolId(params.get('schoolId') ?? '');
    setPrefilledSchoolName(params.get('schoolName') ?? '');
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-heading font-bold text-2xl text-gray-900">
                My Applications
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {applications.length} application
                {applications.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={handleNewApplication}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              New Application
            </button>
          </div>

          {/* Search */}
          {applications.length > 0 && (
            <div className="relative mt-4 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by school or student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Status filters */}
          {applications.length > 0 && (
            <div className="flex gap-1 mt-3 overflow-x-auto">
              {STATUS_FILTERS.map((f) => {
                const count =
                  f.key === 'all'
                    ? applications.length
                    : applications.filter((a) => a.status === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      statusFilter === f.key
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                    {count > 0 && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          statusFilter === f.key
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && applications.length === 0 && (
          <EmptyState onNew={handleNewApplication} />
        )}

        {!loading && applications.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">
              No applications match your search.
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
      </div>

      {/* Application form modal */}
      {showForm && (
        <ApplicationForm
          schoolId={prefilledSchoolId}
          schoolName={prefilledSchoolName}
          onClose={() => setShowForm(false)}
          onSubmit={submit}
          submitting={submitting}
        />
      )}
    </div>
  );
}