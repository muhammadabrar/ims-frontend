import React, { useState } from 'react';
import Question from '../comp/question';

const Payments = () => {
  const [questions, setquestions] = useState([
    {
      Q: "Question 1",
      option1: "option1",
      option2: "option2",
      option3: "option3"
    },
    {
      Q: "Question 2",
      option1: "option1",
      option2: "option2",
      option3: "option3"
    },
    {
      Q: "Question 3",
      option1: "option1",
      option2: "option2",
      option3: "option3"
    }
  ]);
  const [next, setnext] = useState(0);
    return (
        <div>
            <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item active">
            <a >Payments</a>
          </li>
        </ol>

      </nav>
      
      <Question />
        </div>
    );
}

export default Payments;
