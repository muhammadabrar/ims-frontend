import React, { useState } from 'react';
// import './Test.css'
import Q from './q';
export default function Question() {
    const questions = [
        {
            questionText: 'The true discount on a bill of Rs.540 is rs.90 . The bankers discount is?',
            Selet: true,
            answerOptions: [
                { answerText: '60', selected: false, isCorrect: false },
                { answerText: '108 ', selected: false, isCorrect: true },
                { answerText: '110 ', selected: false, isCorrect: false },
                { answerText: '112', selected: false, isCorrect: false },
            ]

        },
        {
            questionText: 'The present worth of a certain bill due sometime hence is Rs.800 and true discount is Rs.36. The bankers discount is?',
            Selet: false,

            answerOptions: [
                { answerText: '60', selected: false, isCorrect: false },
                { answerText: '108', selected: false, isCorrect: true },
                { answerText: '34.38', selected: false, isCorrect: false },
                { answerText: '38.98', selected: false, isCorrect: false },
            ]

        },
        {
            questionText: 'The bankers gain of a certain sum due 2 years hence at 10% per annum is Rs.24. The persent worth is?',
            Selet: false,

            answerOptions: [
                { answerText: '480', selected: false, isCorrect: false },
                { answerText: '520', selected: false, isCorrect: false },
                { answerText: '600', selected: false, isCorrect: true },
                { answerText: '960', selected: false, isCorrect: false },
            ]

        },
        {
            questionText: '6897 is divisible by',
            answerOptions: [
                { answerText: '11 only', selected: false, isCorrect: false },
                { answerText: '19 only', selected: false, isCorrect: false },
                { answerText: 'both 11 and 19', selected: false, isCorrect: true },
                { answerText: 'neither 11 nor 19', selected: false, isCorrect: false },
            ]

        }

    ]
    const [setQuestion, incrementQuestion] = useState(0);
    const [select, sectSelect] = useState(true);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const handleQuestion = (isCorrect) => {
        if (isCorrect === true) {
            const totalScore = score + 1;
            setScore(totalScore);
        }
    }
    const nextQuestion = () => {
        const handleQuestion = setQuestion + 1;
        if (handleQuestion < questions.length) {
            incrementQuestion(handleQuestion)
       

        }
        else {
            setShowScore(true)
        }

    }
    const handleAnswerSelect = (p_Question, ans, isCorrect) => {
        sectSelect({p_Question, ans})
        handleQuestion(isCorrect)
    }
    console.log(select);

    return (
        <div className='container '>
            <div className='Test p-md-5 m-md-5'>
                {showScore ? (
                    <div className='score-section'>You Scored {score} Out Of {questions.length}</div>
                ) : (
                    <div className='question-section'>
                        <div className='question-section'>
                            <span>Question:{setQuestion + 1}/{questions.length}</span>
                            {questions[setQuestion].questionText}

                        </div>
                        <br/>
                        <br/>
                        <div className='answer-section d-flex'>
                    
      
                            {/* {questions[setQuestion].answerOptions.map((p, index) => <button onClick={() => handleQuestion(p.isCorrect)} className="ms-md-4 mt-md-3"><input name="myRadio"  type="radio" 
                            value={p.answerText} onChange={(e)=> sectSelect(p.answerText)}  checked={p.answerText==select&& setQuestion==2} />{p.answerText}</button>)} */}
                            {questions[setQuestion].answerOptions.map((option, index) => <div className='d-flex'> <div className={`check ${option.answerText == select.ans  && setQuestion== select.p_Question &&  "fill"}`} onClick={() => handleAnswerSelect(setQuestion, option.answerText, option.isCorrect)}></div>{option.answerText}</div>)}
                           



                        </div><br/>
                        <button onClick={nextQuestion}>NEXT QUESTION</button>


                    </div>)}
            </div>
     
     
        </div>
    )




}