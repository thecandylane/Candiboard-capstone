import React from "react";

function Topic({ id, name, onClick, chosen }) {
  const topicBaseClass = "bg-green-500 w-40 h-40 p-3 m-2 text-center rounded-md shadow-md transform transition duration-200 hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50";
  const topicCompletedClass = "bg-blue-300 w-40 h-40 p-3 m-2 text-center rounded-md shadow-md transform transition ";

  const handleClick = () => {
    if(!chosen){
      onClick(id);
    }
  };

  return (
    <div
      className={`${chosen ? topicCompletedClass : topicBaseClass}`}
      onClick={handleClick}
    >
      <h1>{name}</h1>
    </div>
  );
}

export default Topic;
