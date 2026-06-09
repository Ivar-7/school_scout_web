import { School, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { Application } from '../types/applications.types';
import { STATUS_CONFIG } from '../types/applications.types';

interface ApplicationCardProps {
  application: Application;
}

export const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[application.status];

  const formatDate = (timestamp: Application['submittedAt']) => {
    try {
      return timestamp
        ?.toDate?.()
        .toLocaleDateString('en-KE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
    } catch {
      return '—';
    }
  };

  const schoolHref = `/schools/${application.schoolId}`;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-4 p-4">
        {/* School logo */}
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {application.schoolLogo ? (
            <img
              src={application.schoolLogo}
              alt={application.schoolName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700 font-bold text-lg">
              {application.schoolName.charAt(0)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <a
                href={schoolHref}
                className="font-heading font-semibold text-gray-900 hover:text-green-700 transition-colors text-sm"
              >
                {application.schoolName}
              </a>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <School className="w-3 h-3" />
                {application.studentName} — {application.gradeApplying}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${config.bg} ${config.color}`}
            >
              {config.label}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              Submitted {formatDate(application.submittedAt)}
            </span>
            {application.documents.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FileText className="w-3 h-3" />
                {application.documents.length} document
                {application.documents.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          aria-label="Toggle details"
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
          {/* Student details */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Student Details
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Full Name', value: application.studentName },
                { label: 'Date of Birth', value: application.studentDOB },
                { label: 'Gender', value: application.studentGender },
                { label: 'Grade Applying', value: application.gradeApplying },
                { label: 'Current School', value: application.currentSchool || '—' },
                {
                  label: 'Special Needs',
                  value: application.specialNeeds ? 'Yes' : 'No',
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm text-gray-800 font-medium capitalize">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Parent message */}
          {application.parentMessage && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Your Message
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {application.parentMessage}
              </p>
            </div>
          )}

          {/* Documents */}
          {application.documents.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Documents
              </h4>
              <div className="space-y-2">
                {application.documents.map((doc, i) => {
                  const docHref = doc.url;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <span className="text-xs text-gray-400 capitalize">
                          ({doc.type.replace(/_/g, ' ')})
                        </span>
                      </div>
                      <a
                        href={docHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-700 hover:underline font-medium"
                      >
                        View
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* School notes — only show if exists */}
          {application.schoolNotes && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Note from School
              </h4>
              <div className="bg-white border border-green-100 rounded-lg p-3">
                <p className="text-sm text-gray-700">{application.schoolNotes}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};