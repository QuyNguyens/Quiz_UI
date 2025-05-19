export interface Answer{
    answerId: number;
    content: string;
    isCorrect: boolean;
}

export interface Question{
    questionId: number;
    content: string;
    answers: Answer[];
}

export interface QuizAttempt{
    attemptId?: number;
    startTime?: Date;
    endTime?: Date ;
    duration?: number | null;
    correctAnswersCount?: number;
    userAnswers: UserAnswer[];
}

export interface UserAnswer{
    attemptId?: number;
    questionId: number;
    answerId: number;
    isCorrect: boolean;
}