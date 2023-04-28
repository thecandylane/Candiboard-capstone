

const Topic = ({ id, name, onClick, completed }) => {
    const baseClass =
      "bg-green-500 w-48 h-48 p-4 m-2 text-center rounded-md shadow-md transform transition duration-200 hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50";
    const completedClass = "bg-green-300";
  
    return (
      <div
        className={`${baseClass} ${completed ? completedClass : ""}`}
        tabIndex="0"
        onClick={() => onClick(id)}
      >
        <h3 className="text-white font-semibold">{name}</h3>
        {completed && <span className="text-white font-semibold">✓</span>}
      </div>
    );
  };
  
  export default Topic;
