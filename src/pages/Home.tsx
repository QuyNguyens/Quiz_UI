import { useNavigate } from "react-router-dom";
import QuizIcon from "../assets/quiz-icon.jpg";

const HomePage = () => {

    const navigate = useNavigate();

    const startQuiz = () => {
        navigate('/quiz');
    };

  return (
    <div className=' w-full h-full bg-primary flex flex-col justify-center items-center gap-6'>
        <img className="w-24 h-32" src={QuizIcon} alt="" />
        <button onClick={startQuiz} className="bg-orange-600 hover:bg-orange-700 duration-300 text-white px-5 py-2 rounded-full">Start Quiz!</button>
    </div>
  )
}

export default HomePage