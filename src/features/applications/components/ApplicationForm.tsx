import { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { X, Upload, FileText, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { firebaseStorage } from '../../../shared/api/firebase/firebase.storage'
import type {
  ApplicationFormData,
  ApplicationDocument,
  DocumentType,
} from '../types/applications.types'

const GRADES = [
  'PP1',
  'PP2',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Form 1',
  'Form 2',
  'Form 3',
  'Form 4',
]

const DOCUMENT_TYPES: Array<{ value: DocumentType; label: string }> = [
  { value: 'birth_certificate', label: 'Birth Certificate' },
  { value: 'report_card', label: 'Report Card' },
  { value: 'passport_photo', label: 'Passport Photo' },
  { value: 'medical', label: 'Medical Record' },
  { value: 'other', label: 'Other' },
]

const STEPS = ['Student Details', 'Parent Details', 'Documents', 'Review']

interface ApplicationFormProps {
  schoolId: string
  schoolName: string
  schoolLogo?: string
  uid: string
  onClose: () => void
  onSubmit: (data: ApplicationFormData) => Promise<string | null>
  submitting: boolean
}

export const ApplicationForm = ({
  schoolId,
  schoolName,
  schoolLogo = '',
  uid,
  onClose,
  onSubmit,
  submitting,
}: ApplicationFormProps) => {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
  })

  const update = (
    field: keyof ApplicationFormData,
    value: ApplicationFormData[keyof ApplicationFormData]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (step === 0) {
      if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required'
      if (!formData.studentDOB) newErrors.studentDOB = 'Date of birth is required'
      if (!formData.gradeApplying) newErrors.gradeApplying = 'Grade is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1)
  }

  const handleBack = () => setStep((s) => s - 1)

  const addDocument = (doc: ApplicationDocument) => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, doc],
    }))
  }

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    const id = await onSubmit(formData)
    if (id) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-brand-strong" />
        </div>
        <h3 className="font-semibold text-xl text-foreground mb-2">Application Submitted!</h3>
        <p className="text-muted text-sm mb-6">
          Your application to <span className="font-semibold text-foreground">{schoolName}</span>{' '}
          has been submitted. The school will review it and get back to you.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-border text-foreground hover:bg-background font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            Close
          </button>
          <a
            href="/applications"
            className="flex-1 bg-brand hover:bg-brand-strong text-white font-medium py-2.5 rounded-lg transition-colors text-sm text-center"
          >
            View Applications
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
        <div>
          <h3 className="font-semibold text-foreground">Apply to {schoolName}</h3>
          <p className="text-xs text-muted mt-0.5">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>
        </div>
        <button onClick={onClose} className="text-muted hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border shrink-0">
        <div
          className="h-full bg-brand transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Step 0 — Student Details */}
        {step === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Student Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => update('studentName', e.target.value)}
                placeholder="e.g. Jane Wanjiku Kamau"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-brand ${
                  errors.studentName ? 'border-red-400' : 'border-border'
                }`}
              />
              {errors.studentName && (
                <p className="text-xs text-red-500 mt-1">{errors.studentName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.studentDOB}
                  onChange={(e) => update('studentDOB', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-brand ${
                    errors.studentDOB ? 'border-red-400' : 'border-border'
                  }`}
                />
                {errors.studentDOB && (
                  <p className="text-xs text-red-500 mt-1">{errors.studentDOB}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Gender</label>
                <select
                  value={formData.studentGender}
                  onChange={(e) => update('studentGender', e.target.value as 'male' | 'female')}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-surface"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Grade Applying For <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gradeApplying}
                onChange={(e) => update('gradeApplying', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-brand ${
                  errors.gradeApplying ? 'border-red-400' : 'border-border'
                }`}
              >
                <option value="">Select grade...</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.gradeApplying && (
                <p className="text-xs text-red-500 mt-1">{errors.gradeApplying}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Current School (optional)
              </label>
              <input
                type="text"
                value={formData.currentSchool}
                onChange={(e) => update('currentSchool', e.target.value)}
                placeholder="e.g. Nairobi Primary School"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.specialNeeds}
                  onChange={(e) => update('specialNeeds', e.target.checked)}
                  className="accent-brand w-4 h-4"
                />
                <span className="text-sm text-foreground">
                  Student has special needs or disabilities
                </span>
              </label>
            </div>

            {formData.specialNeeds && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Please describe
                </label>
                <textarea
                  rows={3}
                  value={formData.specialNeedsDetails}
                  onChange={(e) => update('specialNeedsDetails', e.target.value)}
                  placeholder="Describe any special needs or support required..."
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface resize-none focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            )}
          </>
        )}

        {/* Step 1 — Parent Message */}
        {step === 1 && (
          <>
            <div className="bg-brand-soft border border-brand-soft rounded-lg p-4">
              <p className="text-sm text-brand-strong font-medium mb-1">
                Your details are pre-filled
              </p>
              <p className="text-xs text-brand-strong">
                Your name, email, and phone number will be automatically attached to this
                application from your profile.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Message to School (optional)
              </label>
              <textarea
                rows={5}
                value={formData.parentMessage}
                onChange={(e) => update('parentMessage', e.target.value)}
                placeholder="Introduce your child, mention any specific requirements, or ask questions..."
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface resize-none focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </>
        )}

        {/* Step 2 — Documents */}
        {step === 2 && (
          <>
            <p className="text-sm text-muted">
              Upload supporting documents. All uploads are optional but recommended.
            </p>

            {formData.documents.length > 0 && (
              <div className="space-y-2">
                {formData.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-background border border-border rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand" />
                      <span className="text-sm text-foreground">{doc.name}</span>
                    </div>
                    <button
                      onClick={() => removeDocument(i)}
                      className="text-muted hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <DocumentUploader uid={uid} onAdd={addDocument} />
          </>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <>
            <div className="bg-background rounded-xl border border-border p-4 space-y-3">
              <h4 className="font-medium text-foreground text-sm">Application Summary</h4>

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
                    <span className="text-muted">{label}</span>
                    <span className="text-foreground font-medium capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted text-center">
              By submitting, you confirm that all information provided is accurate.
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-border flex gap-3 shrink-0">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 border border-border text-foreground hover:bg-background font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-brand hover:bg-brand-strong text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 bg-brand hover:bg-brand-strong text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
            {!submitting && <Check className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Document Uploader ─────────────────────────────────────────────────────────
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

const DocumentUploader = ({
  uid,
  onAdd,
}: {
  uid: string
  onAdd: (doc: ApplicationDocument) => void
}) => {
  const [docType, setDocType] = useState<DocumentType>('other')
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, WEBP, or PDF files are accepted.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File must be smaller than 10MB.')
      return
    }

    setError('')
    setUploading(true)
    setProgress(0)

    try {
      const path = `applications/${uid}/${Date.now()}-${file.name}`
      const storageRef = ref(firebaseStorage, path)
      const task = uploadBytesResumable(storageRef, file)

      await new Promise<void>((resolve, reject) => {
        task.on(
          'state_changed',
          (snapshot) =>
            setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
          reject,
          () => resolve()
        )
      })

      const url = await getDownloadURL(storageRef)
      onAdd({ name: file.name, type: docType, url })
      setDocType('other')
      setShowForm(false)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-brand hover:bg-brand-soft/50 transition-colors"
      >
        <Upload className="w-6 h-6 text-muted" />
        <span className="text-sm text-muted font-medium">Add Document</span>
        <span className="text-xs text-muted">Birth certificate, report card, passport photo</span>
      </button>
    )
  }

  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Document Type</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocumentType)}
          disabled={uploading}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-surface"
        >
          {DOCUMENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {uploading ? (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-brand transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted text-center">Uploading… {progress}%</p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">File</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-muted"
          />
          <p className="text-xs text-muted mt-1">JPG, PNG, WEBP, or PDF — up to 10MB</p>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        onClick={() => setShowForm(false)}
        disabled={uploading}
        className="w-full border border-border text-foreground hover:bg-background py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  )
}
