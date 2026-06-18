import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { useQuestions } from '../../social/hooks/useSocial'

interface QuestionsTabProps {
  schoolId: string
}

function AnswerInput({
  onSubmit,
  submitting,
}: {
  onSubmit: (text: string) => void
  submitting: boolean
}) {
  const [value, setValue] = useState('')
  return (
    <form
      className="mt-2 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!value.trim()) return
        onSubmit(value.trim())
        setValue('')
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Write a response…"
        className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
      >
        Reply
      </button>
    </form>
  )
}

export function QuestionsTab({ schoolId }: QuestionsTabProps) {
  const { questions, loading, submitting, error, answer } = useQuestions(schoolId)

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <HelpCircle className="h-10 w-10 text-muted" />
        <p className="text-sm text-muted">No questions from parents yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {questions.map((q) => (
        <div key={q.id} className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium text-foreground">{q.question}</p>
          <p className="mt-1 text-xs text-muted">Asked by {q.askedByName}</p>
          {q.answer ? (
            <div className="mt-3 rounded-lg border border-brand-soft bg-brand-soft p-3">
              <p className="text-sm text-brand-strong">{q.answer}</p>
            </div>
          ) : (
            <AnswerInput submitting={submitting} onSubmit={(text) => answer(q.id, text)} />
          )}
        </div>
      ))}
    </div>
  )
}
