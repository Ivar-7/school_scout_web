import { z } from 'zod'

export const questionSchema = z.object({
  question: z.string().min(5, 'Ask a more detailed question').max(500),
})

export type QuestionFormValues = z.infer<typeof questionSchema>

export const answerSchema = z.object({
  answer: z.string().min(1, 'Write a response').max(1000),
})

export type AnswerFormValues = z.infer<typeof answerSchema>
