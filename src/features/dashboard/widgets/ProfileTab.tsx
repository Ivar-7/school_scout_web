import { useEffect, useState, type FormEvent } from 'react'
import type { School, SchoolDraft } from '../../schools/types/schools.types'

const EMPTY_DRAFT: SchoolDraft = {
  name: '',
  slug: '',
  description: '',
  county: '',
  town: '',
  address: '',
  latitude: 0,
  longitude: 0,
  type: 'primary',
  curriculum: [],
  gender: 'mixed',
  religion: 'secular',
  boardingOptions: 'day',
  coverImage: '',
  logoImage: '',
  gallery: [],
  foundedYear: 0,
  headTeacher: '',
  motto: '',
  registrationNumber: '',
  teacherStudentRatio: '',
  totalStudents: 0,
  specialNeedsSupport: false,
  facilities: [],
  website: '',
  phone: '',
  email: '',
  whatsapp: '',
  socialMedia: { facebook: '', instagram: '', twitter: '' },
  fees: { minTermFee: 0, maxTermFee: 0, admissionFee: 0, uniformEstimate: 0, paymentMethods: [] },
  transport: { available: false, routes: '', monthlyCost: 0 },
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

interface ProfileTabProps {
  school: School | null
  saving: boolean
  error: string | null
  onSave: (draft: SchoolDraft) => Promise<boolean>
}

export function ProfileTab({ school, saving, error, onSave }: ProfileTabProps) {
  const [form, setForm] = useState<SchoolDraft>(EMPTY_DRAFT)
  const [curriculumText, setCurriculumText] = useState('')
  const [facilitiesText, setFacilitiesText] = useState('')
  const [paymentMethodsText, setPaymentMethodsText] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  useEffect(() => {
    if (school) {
      setForm(school)
      setCurriculumText(school.curriculum.join(', '))
      setFacilitiesText(school.facilities.join(', '))
      setPaymentMethodsText(school.fees.paymentMethods.join(', '))
      setSlugTouched(true)
    }
  }, [school])

  const update = <K extends keyof SchoolDraft>(key: K, value: SchoolDraft[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleNameChange = (value: string) => {
    update('name', value)
    if (!slugTouched) update('slug', slugify(value))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const ok = await onSave({
      ...form,
      curriculum: curriculumText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      facilities: facilitiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      fees: {
        ...form.fees,
        paymentMethods: paymentMethodsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      },
    })
    if (ok) {
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 3000)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand'
  const labelClass = 'mb-1.5 block text-sm font-medium text-foreground'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!school && (
        <p className="rounded-lg border border-brand-soft bg-brand-soft px-4 py-3 text-sm text-brand-strong">
          Create your school's listing below to unlock applications, announcements, Q&A, reviews,
          visits, and messages.
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {savedMsg && (
        <p className="rounded-lg border border-brand-soft bg-brand-soft px-4 py-3 text-sm text-brand-strong">
          Saved.
        </p>
      )}

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-base font-semibold text-foreground">Basic info</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>School name</label>
            <input
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                update('slug', e.target.value)
              }}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value as SchoolDraft['type'])}
              className={inputClass}
            >
              <option value="ecd">ECD</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="university">University</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select
              value={form.gender}
              onChange={(e) => update('gender', e.target.value as SchoolDraft['gender'])}
              className={inputClass}
            >
              <option value="mixed">Mixed</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Religion</label>
            <select
              value={form.religion}
              onChange={(e) => update('religion', e.target.value as SchoolDraft['religion'])}
              className={inputClass}
            >
              <option value="secular">Secular</option>
              <option value="catholic">Catholic</option>
              <option value="protestant">Protestant</option>
              <option value="muslim">Muslim</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Boarding</label>
            <select
              value={form.boardingOptions}
              onChange={(e) =>
                update('boardingOptions', e.target.value as SchoolDraft['boardingOptions'])
              }
              className={inputClass}
            >
              <option value="day">Day</option>
              <option value="boarding">Boarding</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Curriculum (comma-separated)</label>
            <input
              value={curriculumText}
              onChange={(e) => setCurriculumText(e.target.value)}
              placeholder="CBC, IGCSE"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-base font-semibold text-foreground">Location</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>County</label>
            <input
              required
              value={form.county}
              onChange={(e) => update('county', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Town</label>
            <input
              required
              value={form.town}
              onChange={(e) => update('town', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              required
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Latitude</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => update('latitude', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => update('longitude', Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-base font-semibold text-foreground">Contact</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Phone</label>
            <input
              required
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input
              value={form.whatsapp}
              onChange={(e) => update('whatsapp', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cover image URL</label>
            <input
              value={form.coverImage}
              onChange={(e) => update('coverImage', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Logo image URL</label>
            <input
              value={form.logoImage}
              onChange={(e) => update('logoImage', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-base font-semibold text-foreground">About</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Founded year</label>
            <input
              type="number"
              value={form.foundedYear}
              onChange={(e) => update('foundedYear', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Head teacher</label>
            <input
              value={form.headTeacher}
              onChange={(e) => update('headTeacher', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Motto</label>
            <input
              value={form.motto}
              onChange={(e) => update('motto', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Registration number</label>
            <input
              value={form.registrationNumber}
              onChange={(e) => update('registrationNumber', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Teacher:student ratio</label>
            <input
              value={form.teacherStudentRatio}
              onChange={(e) => update('teacherStudentRatio', e.target.value)}
              placeholder="1:25"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Total students</label>
            <input
              type="number"
              value={form.totalStudents}
              onChange={(e) => update('totalStudents', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Facilities (comma-separated)</label>
            <input
              value={facilitiesText}
              onChange={(e) => setFacilitiesText(e.target.value)}
              placeholder="Library, Computer Lab, Sports Field"
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.specialNeedsSupport}
              onChange={(e) => update('specialNeedsSupport', e.target.checked)}
              className="accent-brand h-4 w-4"
            />
            <span className="text-sm text-foreground">Special needs support available</span>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-base font-semibold text-foreground">Fees & transport</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Min term fee (KES)</label>
            <input
              type="number"
              value={form.fees.minTermFee}
              onChange={(e) => update('fees', { ...form.fees, minTermFee: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Max term fee (KES)</label>
            <input
              type="number"
              value={form.fees.maxTermFee}
              onChange={(e) => update('fees', { ...form.fees, maxTermFee: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Admission fee (KES)</label>
            <input
              type="number"
              value={form.fees.admissionFee}
              onChange={(e) =>
                update('fees', { ...form.fees, admissionFee: Number(e.target.value) })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Uniform estimate (KES)</label>
            <input
              type="number"
              value={form.fees.uniformEstimate}
              onChange={(e) =>
                update('fees', { ...form.fees, uniformEstimate: Number(e.target.value) })
              }
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Payment methods (comma-separated)</label>
            <input
              value={paymentMethodsText}
              onChange={(e) => setPaymentMethodsText(e.target.value)}
              placeholder="M-Pesa, Bank Transfer"
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.transport.available}
              onChange={(e) =>
                update('transport', { ...form.transport, available: e.target.checked })
              }
              className="accent-brand h-4 w-4"
            />
            <span className="text-sm text-foreground">School transport available</span>
          </label>
          {form.transport.available && (
            <>
              <div>
                <label className={labelClass}>Monthly transport cost (KES)</label>
                <input
                  type="number"
                  value={form.transport.monthlyCost}
                  onChange={(e) =>
                    update('transport', { ...form.transport, monthlyCost: Number(e.target.value) })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Routes</label>
                <input
                  value={form.transport.routes}
                  onChange={(e) =>
                    update('transport', { ...form.transport, routes: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
      >
        {saving ? 'Saving…' : school ? 'Save changes' : 'Create listing'}
      </button>
    </form>
  )
}
