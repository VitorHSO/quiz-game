import { createContext, useContext, useReducer } from 'react';

type Status = "idle" | "fetching" | "ready" | "error" | "answered";

type QuizAction = 
    { type: "setStatus"; payload: Status } |
    { type: "setQuestion"; payload: Question } |
    { type: "setUserAnswer"; payload: string | null } |
    { type: "setScore"; payload: "correct" | "incorrect" }

export interface Question {
    type: 'multiple' | 'boolean';  // Question type can be either 'multiple' or 'boolean'
    difficulty: 'easy' | 'medium' | 'hard';  // Difficulty levels
    category: string;  // Category of the question
    question: string;  // The question text
    correct_answer: string;  // The correct answer
    incorrect_answers: string[];  // Array of incorrect answers
}

export interface QuestionsResponse {
    response_code: number;
    results: Question[];  // Array of questions
}

interface Score {
    correct: number, 
    incorrect: number
}

interface QuizContext {
    state: QuizState,
    dispatch: React.Dispatch<QuizAction>
}

interface QuizState {
    gameStatus: Status,
    question: Question | null,
    userAnswer: string | null,
    score: Score
}

const initialState : QuizState = {
    gameStatus: "idle",
    question: null,
    userAnswer: null,
    score: {correct: 0, incorrect: 0}
}

const QuizContext = createContext<QuizContext>({
    state: initialState,
    dispatch: ()=> null
});

export function QuizProvider({children}: {children: React.ReactElement}) {
    const [state, dispatch] = useReducer(quizReducer, initialState);

    return (
        <QuizContext.Provider value={{state, dispatch}}>
            {children}
        </QuizContext.Provider>
    )
}

export function useQuiz() {
    return useContext(QuizContext);
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
        case "setStatus":
            return {...state, gameStatus: action.payload};
        case "setQuestion":
            return {...state, question: action.payload};
        case "setUserAnswer":
            return {...state, userAnswer: action.payload};
        case "setScore":
            let score = state.score;
            score[action.payload] += 1;
            return {...state, score: score};
        default:
            throw new Error("Unknown action");
    }
  }