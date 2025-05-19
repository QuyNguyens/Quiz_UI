import { useEffect, useState } from "react";
import { type Answer, type Question, type QuizAttempt, type UserAnswer } from "../types/type";
import { createQuizAttempt, createUserAnswer, getQuestions, updateQuizAttempt } from "../services/quizService";
import { useNavigate } from "react-router-dom";

const MAX_QUESTION = parseInt(import.meta.env.VITE_MAX_QUESTION || "10", 10);

const Quiz = () => {
    const [indexQuestion, setIndexQuestion] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [quizAttempt, setQuizAttempt] = useState<QuizAttempt>();
    const [questions, setQuestions] = useState<Question[]>([]);

    const navigate = useNavigate();

    useEffect(() => {

        getQuestions()
        .then((data: Question[]) => setQuestions(data))
        .catch(console.error);

        createQuizAttempt()
        .then((data: QuizAttempt) => setQuizAttempt(data))
        .catch(console.error);
    }, []);

    const handleClose = () => {
        navigate("/");
    };

    const handleAnswerClick = (index: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);

        const answer = currentQuestion.answers[index] as Answer;

        const userAnswer : UserAnswer = {
            attemptId: quizAttempt?.attemptId,
            questionId: currentQuestion.questionId,
            answerId: answer.answerId,
            isCorrect: answer.isCorrect
        };

        createUserAnswer(userAnswer);

       setQuizAttempt(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                userAnswers: [...(prev.userAnswers ?? []), userAnswer],
            };
        });

        setTimeout(() => {
            setSelectedAnswer(null);
            if(indexQuestion === MAX_QUESTION-1){

                if(!quizAttempt) return;

                const req : QuizAttempt = quizAttempt;
                req.userAnswers = [...quizAttempt.userAnswers, userAnswer]
                updateQuizAttempt(req)
                  .then(() => {
                      navigate(`/result/${quizAttempt?.attemptId}`);
                  })
                  .catch((err) => {
                      console.error("Something wrong when update quiz attempt:", err);
                  });
              }else{
                  setIndexQuestion((prev) => prev + 1);
              }
        }, 1500);
    };

    const currentQuestion = questions[indexQuestion] as Question;

  return (
    <div className="relative h-full bg-primary text-white flex flex-col gap-10">
      <span onClick={() =>setOpen(true)} className="text-end text-2xl cursor-pointer pt-5 pr-5">X</span>
      <p className="text-center">
        <sup className="text-[18px]">Question {indexQuestion + 1}</sup>
        <span className="text-sm text-gray-400">/{MAX_QUESTION}</span>
      </p>
      {open && <div className="fixed w-full h-full bg-black/50 flex justify-center items-center">
        <div className="w-[60%] p-5 rounded-lg shadow-sm bg-white">
          <p className="text-center font-medium text-[18px] text-black">click yes to go start page</p>
          <div className="flex gap-3 justify-end mt-2">
            <button onClick={handleClose} className="py-1 px-2 bg-green-500 hover:bg-green-600 rounded-md">Yes</button>
            <button onClick={() => setOpen(false)} className="py-1 px-2 bg-red-500 hover:bg-red-600 rounded-md">No</button>
          </div>
        </div>
      </div>}
      {currentQuestion && (
        <>

          <p className="text-lg text-center flex justify-center"><span className="w-[75%]">{currentQuestion.content}</span></p>

          <div className="flex flex-col gap-6 p-5">
            {currentQuestion.answers.map((answer: Answer, index: number) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = answer.isCorrect;
              const showResult = selectedAnswer !== null;

              let borderColor = "border-gray-300";
              let textColor = "text-white";
              if (showResult && isSelected) {
                borderColor = isCorrect ? "border-green-500" : "border-red-500";
                textColor = isCorrect ? "text-green-500" : "text-red-500";
              }
              const letter = String.fromCharCode(65 + index);
              return (
              <div className="flex justify-center items-center gap-2">
                <p className={`text-2xl ${textColor}`}>{letter}. </p>
                <div
                  key={index}
                  className={`border-2 ${borderColor} ${textColor} w-full md:w-1/2 lg:w-1/3 rounded-full text-white flex justify-between items-center p-3 cursor-pointer transition-all duration-300`}
                  onClick={() => handleAnswerClick(index)}
                >
                  <span>{answer.content}</span>

                  <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${isSelected ? 'border-white' : 'border-gray-400'}`}>
                    {isSelected && <span className="w-3 h-3 bg-white rounded-full" />}
                  </span>
                </div>
              </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
