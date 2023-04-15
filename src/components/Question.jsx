import React, { useState } from "react";

function Question(props) {
  const [selectedOption, setSelectedOption] = useState("");

  function handleOptionChange(event) {
    setSelectedOption(event.target.value);
  }

  return (
    <div>
      <h2>{props.prompt}</h2>
      <form>
        {props.options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
            />
            {option}
          </label>
        ))}
      </form>
    </div>
  );
}

export default Question;
