import React, { useState } from 'react';
import WeeklySpendItem from './WeeklySpendItem';

const WeeklySpend = ({ data, index }) => {
  const [open, setOpen] = useState(index == 0 || index == 1 ? true : false)
  
  const getTotalSpent = (data, type) => {
    return data.result.reduce((acc, cur) => {
      return acc + cur.cards.reduce((_acc, _cur) => {
        return _acc + _cur[type];
      }, 0)
    }, 0)
  }
  return (
      <div className='flex flex-col w-full p-2 border-b-2 bg-white'>
        <div className="flex mb-2 mt-2 items-center">
          <div className="w-1/4 flex flex-row items-center space-x-2">
            <img src={open ? 'minus.svg' : 'expand.svg'} className="flex justify-center items-center bg-gray-100 h-4 w-4 border rounded-md focus:outline-none" onClick={() => {setOpen(prev => !prev)}}></img>
            <div className="flex justify-start text-sm">{data.date}</div>
          </div>
          <div className="w-1/4 text-sm flex justify-center">Card</div>
          <div className="w-1/4 text-sm flex justify-center">Spend</div>
          <div className="w-1/4 flex justify-end text-sm">Points Earned</div>
        </div>
        <div className={!open ? "hidden" : "block"}>
          {
            data.result.map(weeklyLineItem => {
              return <WeeklySpendItem data={weeklyLineItem}/>
            })
          }
          <div className="flex mt-2">
            <div className="w-1/4"></div>
            <div className="w-1/4 flex justify-center text-sm">totals</div>
            <div className="w-1/4 flex items-center justify-center truncate tracking-widest text-sm"><span className='text-lg font-light'>$</span>{getTotalSpent(data, 'spend').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
            <div className="w-1/4 flex items-center justify-end truncate tracking-widest text-sm">{getTotalSpent(data, 'pointsCollected')}</div>
          </div>
        </div>
      </div>
  );
}

export default WeeklySpend;