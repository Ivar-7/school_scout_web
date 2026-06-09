import { useState } from 'react';
import { X, Upload, FileText, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import type { ApplicationFormData, ApplicationDocument, DocumentType } from '../types/applications.types';

const GRADES = [
  'PP1', 'PP2',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9',
  'Form 1', 'Form 2', 'Form 3', 'Form 4',
];

const DOCUMENT_TYPES: Array<{ value: DocumentType; label: string }> = [
  { value: 'birth_certificate', label: 'Birth Certificate' },
  { value: 'report_card', label: 'Report Card' },
  { value: 'passport_photo', label: 'Passport Photo' },
  { value: 'medical', label: 'Medical Record' },
  { value: 'other', label: 'Other' },
];

const STEPS = ['Student Details', 'Parent Details', 'Documents', 'Review'];

interface ApplicationFormProps {
  schoolId: string;
  schoolName: string;
  schoolLogo?: string;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => Promise<string | null>;
  submitting: boolean;
}

export const ApplicationForm = ({
  schoolId,
  schoolName,
  schoolLogo = '',
  onClose,
  onSubmit,
  submitting,
}: ApplicationFormProps) => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ApplicationFormData>({
    schoolId,
    schoolName,
    schoolLogo,
    studentName: '',
    studentDOB: '',
    studentGender: 'male',
    gradeApplying: '',
    currentSchool: '',
    specialNeeds: false,
    specialNeedsDetails: '',
    parentMessage: '',
    documents: [],
  });

  const update = (field: keyof ApplicationFormData, value: ApplicationFormData[keyof ApplicationFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
      if (!formData.studentDOB) newErrors.studentDOB = 'Date of birth is required';
      if (!formData.gradeApplying) newErrors.gradeApplying = 'Grade is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const addDocument = (doc: ApplicationDocument) => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, doc],
    }));
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    const id = await onSubmit(formData);
    if (id) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
            Application Submitted!
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Your application to{' '}
            <span className="font-semibold text-gray-900">{schoolName}</span>{' '}
            has been submitted. The school will review it and get back to you.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Close
            </button>
            <a
              href="/parent/applications"
              className="flex-1 bg-green-700 hover:bg-green-800 text-white font-medium py-2.5 rounded-lg transition-colors text-sm text-center"
            >
              View Applications
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="font-heading font-semibold text-gray-900">
              Apply to {schoolName}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 shrink-0">
          <div
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Step 0 — Student Details */}
          {step === 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => update('studentName', e.target.value)}
                  placeholder="e.g. Jane Wanjiku Kamau"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 ${
                    errors.studentName ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.studentName && (
                  <p className="text-xs text-red-500 mt-1">{errors.studentName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.studentDOB}
                    onChange={(e) => update('studentDOB', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.studentDOB ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.studentDOB && (
                    <p className="text-xs text-red-500 mt-1">{errors.studentDOB}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={formData.studentGender}
                    onChange={(e) =>
                      update('studentGender', e.target.value as 'male' | 'female')
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Grade Applying For <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gradeApplying}
                  onChange={(e) => update('gradeApplying', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white ${
                    errors.gradeApplying ? 'border-red-400' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select grade...</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.gradeApplying && (
                  <p className="text-xs text-red-500 mt-1">{errors.gradeApplying}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Current School (optional)
                </label>
                <input
                  type="text"
                  value={formData.currentSchool}
                  onChange={(e) => update('currentSchool', e.target.value)}
                  placeholder="e.g. Nairobi Primary School"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specialNeeds}
                    onChange={(e) => update('specialNeeds', e.target.checked)}
                    className="accent-green-600 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    Student has special needs or disabilities
                  </span>
                </label>
              </div>

              {formData.specialNeeds && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Please describe
                  </label>
                  <textarea
                    rows={3}
                    value={formData.specialNeedsDetails}
                    onChange={(e) => update('specialNeedsDetails', e.target.value)}
                    placeholder="Describe any special needs or support required..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              )}
            </>
          )}

          {/* Step 1 — Parent Message */}
          {step === 1 && (
            <>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium mb-1">
                  Your details are pre-filled
                </p>
                <p className="text-xs text-green-700">
                  Your name, email, and phone number will be automatically
                  attached to this application from your profile.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message to School (optional)
                </label>
                <textarea
                  rows={5}
                  value={formData.parentMessage}
                  onChange={(e) => update('parentMessage', e.target.value)}
                  placeholder="Introduce your child, mention any specific requirements, or ask questions..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </>
          )}

          {/* Step 2 — Documents */}
          {step === 2 && (
            <>
              <p className="text-sm text-gray-500">
                Upload supporting documents. All uploads are optional but
                recommended.
              </p>

              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  {formData.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{doc.name}</span>
                      </div>
                      <button
                        onClick={() => removeDocument(i)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <DocumentUploader onAdd={addDocument} />
            </>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                <h4 className="font-medium text-gray-900 text-sm">
                  Application Summary
                </h4>

                <div className="space-y-2">
                  {[
                    { label: 'Applying to', value: schoolName },
                    { label: 'Student Name', value: formData.studentName },
                    { label: 'Date of Birth', value: formData.studentDOB },
                    { label: 'Gender', value: formData.studentGender },
                    { label: 'Grade', value: formData.gradeApplying },
                    { label: 'Current School', value: formData.currentSchool || '—' },
                    {
                      label: 'Special Needs',
                      value: formData.specialNeeds ? 'Yes' : 'No',
                    },
                    {
                      label: 'Documents',
                      value: `${formData.documents.length} attached`,
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-gray-900 font-medium capitalize">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                By submitting, you confirm that all information provided is
                accurate.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex gap-3 shrink-0">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <div className="flex-1" />
          {step < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
              {!submitting && <Check className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Document Uploader ─────────────────────────────────────────────────────────
const DocumentUploader = ({
  onAdd,
}: {
  onAdd: (doc: ApplicationDocument) => void;
}) => {
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentType>('other');
  const [docUrl, setDocUrl] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!docName.trim() || !docUrl.trim()) return;
    onAdd({ name: docName.trim(), type: docType, url: docUrl.trim() });
    setDocName('');
    setDocUrl('');
    setDocType('other');
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-green-400 hover:bg-green-50/50 transition-colors"
      >
        <Upload className="w-6 h-6 text-gray-400" />
        <span className="text-sm text-gray-500 font-medium">
          Add Document
        </span>
        <span className="text-xs text-gray-400">
          Birth certificate, report card, passport photo
        </span>
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document Name
        </label>
        <input
          type="text"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          placeholder="e.g. Birth Certificate"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document Type
        </label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocumentType)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
        >
          {DOCUMENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document URL
        </label>
        <input
          type="url"
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <p className="text-xs text-gray-400 mt-1">
          Upload to Firebase Storage and paste the URL here
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShowForm(false)}
          className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2 rounded-lg text-sm transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          disabled={!docName.trim() || !docUrl.trim()}
          className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ApplicationForm;