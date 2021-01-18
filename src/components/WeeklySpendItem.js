import React from 'react';

const WeeklySpendItem = ({ data }) => {

  return (
      <div className='flex flex-row w-full px-2 border-b bg-white text-sm items-center'>
        <div className="flex justify-start w-1/4 text-sm font-extralight">{data.category}</div>
        <div className="flex text-center flex-col w-1/4">
          {
            data.cards.length == 0 ? '-':
            data.cards.map(card => {
              return <div className="truncate text-sm font-extralight">{card.name}</div>
            })
          }
        </div>
        <div className="flex flex-col w-1/4">
          {
            data.cards.length == 0 ? <div className='flex justify-center'>-</div>:
            data.cards.map(card => {
              return <div className="flex items-center justify-start ml-28 truncate font-extralight tracking-widest"><span className='text-lg font-extralight'>$</span>{card.spend.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
            })
          }
        </div>
        <div className="flex flex-col items-end w-1/4">
          {
            data.cards.length == 0 ? '-':
            data.cards.map(card => {
              return <div className="flex items-center truncate font-extralight">{card.pointsCollected}</div>
            })
          }
        </div>
      </div>
  );
}

export default WeeklySpendItem;
