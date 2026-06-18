import {
  fetchQuestions,
  askQuestion,
  answerQuestion,
  deleteQuestion,
  fetchRecentQuestions,
  fetchRecentReviews,
  fetchRecentAnnouncements,
} from '../services/social.service'

export const socialApi = {
  getQuestions: (schoolId: string) => fetchQuestions(schoolId),

  ask: (
    schoolId: string,
    schoolName: string,
    schoolLogo: string,
    askedBy: string,
    askedByName: string,
    question: string
  ) => askQuestion(schoolId, schoolName, schoolLogo, askedBy, askedByName, question),

  answer: (schoolId: string, questionId: string, answer: string) =>
    answerQuestion(schoolId, questionId, answer),

  remove: (schoolId: string, questionId: string) => deleteQuestion(schoolId, questionId),

  getRecentQuestions: () => fetchRecentQuestions(),
  getRecentReviews: () => fetchRecentReviews(),
  getRecentAnnouncements: () => fetchRecentAnnouncements(),
}
