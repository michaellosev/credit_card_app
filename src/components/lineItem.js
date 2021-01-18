import React from 'react';

const LineItem = (props) => {
  const { icon, category, val } = props;
  return (
    <div className="flex items-center space-x-4 w-full">
      <img className="w-4 h-4" src={`${icon}`} alt=""></img>
      <div className="flex justify-between items-center w-full space-x-6">
        <p className="flex items-center text-sm">{category}</p>
        <div className="font-bold text-lg text-blue-500">{val}</div>
      </div>
    </div>
  );
}

export default LineItem;