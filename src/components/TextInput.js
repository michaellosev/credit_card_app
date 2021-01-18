import React from 'react'

export default function TextInput({ category, handleInputChange, inputValues, img }) {

  const onChange = (e) => {
    if (Number.isInteger(+e.target.value)) {
      handleInputChange(+e.target.value, category)
    }
  }

  return (
    <div className="flex flex-col mt-8 space-y-1">
      <div className="flex justify-between">
        <div className="capitalize text-sm text-gray-400">{category}</div>
        <div className="capitalize text-sm text-gray-400">Weekly Spend</div>
      </div>
      <div className="flex items-center h-9">
        <div className="flex-none font-semibold w-10 h-full flex justify-center items-center border-l border-t border-b border-gray-200 rounded-l-md"><img className='p-3' src={img}></img></div>
        <input className="font-extraslim px-2 py-1 border h-full flex focus:outline-none focus:border-blue-200 text-sm" type="text" placeholder="Amount" onChange={onChange} value={inputValues[category]}/>
        <div className="flex-none font-semibold w-10 h-full flex justify-center items-center bg-gray-100 border-r border-t border-b border-gray-200 rounded-r-md">.00</div>
      </div>
    </div>
  );
}
