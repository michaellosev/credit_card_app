import React, { useState } from 'react';
import WeeklySpend from './WeeklySpend';

const PointSummary = ( {setSubmitted, weeklyData }) => {


  return (
      <div className='flex flex-col w-full h-screen border-l border-r shadow-xl rounded-lg p-4'>
        <div className="flex justify-center items-center p-4 font-light text-xl border-b-2 bg-white">
          Weekly Spending Summary
        </div>
        <div className='flex flex-col overflow-y-scroll'>
          {
            weeklyData.map((data, index) => {
              return <WeeklySpend data={data} index={index} key={index}/>
            })
          }
        </div>
        {/* <button 
          className="p-4 bg-green-400"
          onClick={() => { setSubmitted(prev => !prev) }}>
          back
        </button> */}
      </div>
  );
}

export default PointSummary;