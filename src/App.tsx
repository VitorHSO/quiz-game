import { useEffect } from 'react';
import './App.scss'
import FullPageLoader from './components/FullPageLoader.tsx'
import Score from './components/Score.tsx';
import Game from './components/Game.tsx';
import { useQuiz, Question, QuestionsResponse } from './QuizContext.tsx';

function App() {
  const api_opendb = import.meta.env.VITE_OPENTDB_URL_API;
  const {state, dispatch} = useQuiz();

  async function fetchQuestion() {
    try {
      dispatch({type: "setStatus", payload: "fetching"});
      dispatch({type: "setUserAnswer", payload: null});
      const response = await fetch(api_opendb);
      let data : QuestionsResponse = await(response.json());
      
      if (data.response_code === 0) {
        let question : Question = data.results[0];

        let randowIndex = Math.round(Math.random() * question.incorrect_answers.length);
        question.incorrect_answers.splice(randowIndex, 0, question.correct_answer);

        dispatch({type: "setStatus", payload: "ready"});
        dispatch({type: "setQuestion", payload: question});

      } else if (data.response_code === 5) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        dispatch({type: "setStatus", payload: "idle"});
      } else {
        dispatch({type: "setStatus", payload: "error"});
      }
    } catch (error) {
      console.log('error: ', error);
      dispatch({type: "setStatus", payload: "error"});
    }
    
  };

  useEffect(()=> {
    if (state.gameStatus == "idle") {
      fetchQuestion();
    }
  })

  return (
    <>
      {
        state.gameStatus == 'fetching' ?
          <FullPageLoader /> : state.gameStatus == 'error' ?
          <p>Error...</p> : 
          <>
            <Score />
            <Game /> 
          </>
      }

    </>
  )
}

export default App
