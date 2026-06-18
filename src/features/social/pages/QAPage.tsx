import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HelpCircle } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useSchool } from '../../schools/hooks/useSchools'
import { useQuestions, useRecentQuestions } from '../hooks/useSocial'
import {
  questionSchema,
  answerSchema,
  type QuestionFormValues,
  type AnswerFormValues,
} from '../types/social.schema'

function AnswerForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (answer: string) => void
  submitting: boolean
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerFormValues>({ resolver: zodResolver(answerSchema) })

  return (
    <form
      className="mt-2 flex flex-col gap-2 sm:flex-row"
      onSubmit={handleSubmit((values) => {
        onSubmit(values.answer)
        reset()
      })}
    >
      <input
        type="text"
        placeholder="Write a response…"
        {...register('answer')}
        className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
      >
        Reply
      </button>
      {errors.answer && <p className="text-xs text-red-500">{errors.answer.message}</p>}
    </form>
  )
}

function SchoolQAThread({ schoolId }: { schoolId: string }) {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const { school } = useSchool(schoolId)
  const { questions, loading, submitting, ask, answer } = useQuestions(schoolId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({ resolver: zodResolver(questionSchema) })

  if (!school) return null

  const isOwner = user?.uid === school.ownerId

  const onAsk = async (values: QuestionFormValues) => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: { pathname: `/social/qa?schoolId=${schoolId}` } } })
      return
    }
    const ok = await ask(school.name, school.logoImage, values.question)
    if (ok) reset()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Questions about{' '}
        <Link to={`/schools/${school.id}`} className="hover:underline">
          {school.name}
        </Link>
      </h1>

      {!isOwner && (
        <form
          className="mt-4 rounded-xl border border-border bg-surface p-4"
          onSubmit={handleSubmit(onAsk)}
        >
          <label className="mb-1.5 block text-sm font-medium text-foreground">Ask a question</label>
          <textarea
            rows={2}
            {...register('question')}
            placeholder="What would you like to know about this school?"
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          {errors.question && (
            <p className="mt-1 text-xs text-red-500">{errors.question.message}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
          >
            {submitting ? 'Posting…' : 'Post question'}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
          </div>
        )}

        {!loading && questions.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">
            No questions yet — be the first to ask.
          </p>
        )}

        {questions.map((q) => (
          <div key={q.id} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm font-medium text-foreground">{q.question}</p>
            <p className="mt-1 text-xs text-muted">Asked by {q.askedByName}</p>
            {q.answer ? (
              <div className="mt-3 rounded-lg border border-brand-soft bg-brand-soft p-3">
                <p className="mb-1 text-xs font-semibold text-brand-strong">
                  {school.name} replied
                </p>
                <p className="text-sm text-brand-strong">{q.answer}</p>
              </div>
            ) : isOwner ? (
              <AnswerForm submitting={submitting} onSubmit={(text) => answer(q.id, text)} />
            ) : (
              <p className="mt-2 text-xs text-muted">Awaiting a response from the school.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentQuestionsFeed() {
  const { questions, loading, error } = useRecentQuestions()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Questions & Answers</h1>
      <p className="mt-1 text-sm text-muted">
        Browse recent questions parents have asked schools. Visit a school's profile to ask your
        own.
      </p>

      <div className="mt-6">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
          </div>
        )}

        {error && <p className="py-4 text-sm text-red-600">{error}</p>}

        {!loading && !error && questions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <HelpCircle className="h-10 w-10 text-muted" />
            <p className="text-sm text-muted">No questions have been asked yet.</p>
          </div>
        )}

        {!loading && questions.length > 0 && (
          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="rounded-xl border border-border bg-surface p-4">
                <Link
                  to={`/schools/${q.schoolId}`}
                  className="text-sm font-semibold text-brand-strong hover:underline"
                >
                  {q.schoolName}
                </Link>
                <p className="mt-1 text-sm font-medium text-foreground">{q.question}</p>
                {q.answer ? (
                  <p className="mt-2 text-sm text-muted">"{q.answer}"</p>
                ) : (
                  <p className="mt-2 text-xs text-muted">Awaiting a response.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function QAPage() {
  const [searchParams] = useSearchParams()
  const schoolId = searchParams.get('schoolId')

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {schoolId ? <SchoolQAThread schoolId={schoolId} /> : <RecentQuestionsFeed />}
    </section>
  )
}
