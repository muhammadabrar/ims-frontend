import React, { useState } from 'react';

const Q = (props) => {
const [value, setvalue] = useState('');
    console.log(props);
    return (
        <div>
<>
{props.questions.map((option)=>
//   <label>
//   <input
//     type="radio"
//     value={option.answerText}
//     name={option.answerText}
//   />
//   {option.answerText}
// </label>
<>
<div className={`check ${option.answerText==value && "fill"}`} onClick={() => setvalue(option.answerText)}></div>{option.answerText}
</>

)}

        
        </>
      

</div>
    );
}

export default Q;
