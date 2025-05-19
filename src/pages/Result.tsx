import FailedIcon from "../assets/failed-icon.jpg";
import CompleteIcon from "../assets/complete-icon.jpg";
import MedalIcon from "../assets/medal-icon.png";
import GreatIcon from "../assets/greate-icon.jpg";
import { useEffect, useState } from "react";
import {type Question, type QuizAttempt } from "../types/type";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestions, getQuizAttempt } from "../services/quizService";

type ViewModes = {
  question: Question;
  answerId: number;
  isSelect: boolean;
}

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}' ${seconds}s` : `${seconds}s`;
};

const calculateDuration = (start: Date, end: Date) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const durationMs = endDate.getTime() - startDate.getTime();
  return formatDuration(durationMs);
};

const MAX_QUESTION = parseInt(import.meta.env.VITE_MAX_QUESTION || "10", 10);

const ResultPage = () => {
    const [viewModes, setViewModes] = useState<ViewModes[]>([]);
    const [typeViewModel, setTypeViewModel] = useState<string>("");
    const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
    const [questions, setQuestions] = useState<Question[]>();

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() =>{
        getQuestions()
            .then((data: Question[]) => setQuestions(data))
            .catch(console.error);
        
        getQuizAttempt(Number(id))
            .then((data: QuizAttempt) => {
                setAttempt(data)
            })
            .catch((err) => console.error("Something wrong when get quiz attempt:", err));
    },[]);

    const getAnswerDetail = (type: string) => {
        if(!attempt || !questions) return ;
        const mapped: ViewModes[] = attempt.userAnswers.map((userAnswer) => {
        const question = questions.find(q => q.questionId === userAnswer.questionId);

            return {
            question,
            answerId: userAnswer.answerId,
            isSelect: userAnswer.isCorrect
            };
        }).filter((item): item is ViewModes => {
            if (!item) return false;

            if (type === "correct") return item.isSelect === true;
            if (type === "wrong") return item.isSelect === false;
            return true;
      });

      setTypeViewModel(type);
      setViewModes(mapped);
    };

    function getType(){
        const TypeDisplay = {
            img: FailedIcon,
            title: "Failed",
            content: "You are failed!"
        };

        switch(attempt?.correctAnswersCount){
            case 3: case 4:
                TypeDisplay.img = CompleteIcon;
                TypeDisplay.title = "Complete";
                TypeDisplay.content = "Better luck next time!";
                break;
            case 5: case 6: case 7: case 8:
                TypeDisplay.img = MedalIcon;
                TypeDisplay.title = "Congratulations";
                TypeDisplay.content = "You are amazing!";
                break;
            case 9: case 10:
                TypeDisplay.img = GreatIcon;
                TypeDisplay.title = "Great";
                TypeDisplay.content = "Perfect!";
                break;
        }

        return TypeDisplay;
    }
    const TypeDisplay = getType();

    const handleNavigate = (type:string) =>{
      if(type === "Home"){
        navigate("/");
      }else if(type == "Play"){
        navigate("/quiz");
      }
    }
  return (
    <div className="bg-primary h-full flex justify-center items-center overflow-hidden">
      <div className="bg-white w-[95%] h-[98%] p-5 rounded-lg shadow-sm flex flex-col gap-2 justify-center items-center">
            <img className="w-28 h-28" src={TypeDisplay.img} alt="" />
            <p className="text-2xl font-bold">{TypeDisplay.title}</p>
            <p>{TypeDisplay.content}</p>
            <p>{attempt?.correctAnswersCount}/{MAX_QUESTION} correct answers in {calculateDuration(attempt?.startTime ?? new Date(), attempt?.endTime ?? new Date())}</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <button onClick={() => getAnswerDetail("correct")} className="btn px-3 py-2 bg-green-500 rounded-md hover:bg-green-600 text-white duration-300">Correct answers</button>
                <button onClick={() => getAnswerDetail("wrong")} className="btn px-3 py-2 bg-red-500 rounded-md hover:bg-red-600 text-white duration-300">Wrong answers</button>
                <button onClick={() => getAnswerDetail("all")} className="btn px-3 py-2 bg-blue-500 rounded-md hover:bg-blue-600 text-white duration-300">All answers</button>
                <button onClick={() => handleNavigate("Play")} className="btn px-3 py-2 bg-orange-500 rounded-md hover:bg-orange-600 text-white duration-300">Play Again</button>
                <button onClick = {() => handleNavigate("Home")} className="btn px-3 py-2 bg-emerald-500 rounded-md hover:bg-emerald-600 text-white duration-300">Out</button>
            </div>
            {
              viewModes.length != 0 && (
                <div>
                    <h2 className="text-xl text-center py-3 font-medium uppercase">{typeViewModel} Answer</h2>
                  <div className="flex flex-col gap-4 overflow-auto h-[300px]">
                    {
                      viewModes.map((q, index) =>{
                        const yourAnswer = q.question.answers.find(p => p.answerId == q.answerId);
                        return <div key={index} className="flex flex-col gap-2">
                              <h2 className="text-[18px] font-medium">{q.question.questionId}. {q.question.content}</h2>
                              <div className="flex flex-col gap-2">
                                <ul className="list-none pl-0">
                                  {q.question.answers.map((an, index) => {
                                    const letter = String.fromCharCode(65 + index);
                                    const correctColor = an.isCorrect ? "text-green-600" : "text-gray-600";
                                    const textColor = yourAnswer?.isCorrect ? "text-green-600" : "text-red-600";
                                    return (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="font-semibold">{letter}.</span>
                                        {q.answerId === an.answerId ?
                                        <p className={`${textColor} text-[18px]`}>{an.content} <b className="font-medium">(your answer)</b></p> :
                                          <p className={`${correctColor} text-[18px]`}>{an.content}</p>
                                        }
                                      </li>
                                    );
                                  })}
                                </ul>
                            </div>
                          </div>
                      })
                    }
                  </div>
                </div>
              )
            }
      </div>
    </div>
  );
};

export default ResultPage;
