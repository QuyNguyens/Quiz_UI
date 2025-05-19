import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Quiz from "./pages/Quiz"
import Result from "./pages/Result"
function App() {

  return (
    <div className="h-[100vh]">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/quiz" element={<Quiz/>} />
          <Route path="/result/:id" element={<Result/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
