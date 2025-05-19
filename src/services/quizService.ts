import axios from "axios";
import type { Question, QuizAttempt, UserAnswer } from "../types/type";

const API_SCHEMA = import.meta.env.VITE_API_SCHEMA;

export const getQuestions = async (): Promise<Question[]> => {
  const response = await axios.get<Question[]>(`${API_SCHEMA}/Question/questions`);
  return response.data;
};

export const createUserAnswer = async (userAnswer: UserAnswer): Promise<UserAnswer> =>{
    const response = await axios.post<UserAnswer>(`${API_SCHEMA}/UserAnswer/user-answer`, userAnswer);
    return response.data;
}

export const createQuizAttempt = async (): Promise<QuizAttempt> =>{
    const response = await axios.post<QuizAttempt>(`${API_SCHEMA}/QuizAttempt/create-quiz-attempt`);
    return response.data;
}

export const updateQuizAttempt = async (quizAttempt: QuizAttempt): Promise<boolean> =>{
    const req = {
        attemptId: quizAttempt.attemptId,
        startTime: quizAttempt.startTime,
        endTime:  new Date(),
        UserAnswer: quizAttempt.userAnswers
    }

    await axios.post<boolean>(`${API_SCHEMA}/QuizAttempt/update-quiz-attempt`, req);
    return true;
}

export const getQuizAttempt = async (id: number): Promise<QuizAttempt> =>{
    const response = await axios.get<QuizAttempt>(`${API_SCHEMA}/QuizAttempt/quiz-attempt/${id}`);
    return response.data;
}