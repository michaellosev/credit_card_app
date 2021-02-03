import React, { useState } from 'react';
import LineItem from './lineItem';

const Card = ({ card, selectedVals, categoryToIcon }) => {

  return (
      <div className={`bg-white rounded-xl p-6 m-4 space-y-3 shadow-lg ${selectedVals.filter(obj => obj === card.cardName).length != 0 ? 'border-2 border-green-400' : 'border-2 border-white'}`}>
        <div className="relative flex justify-center border-b-2 border-gray-300 w-full text-center mb-4">
          <p className="font-sansserif text-lg font-semibold text-black">{card.cardName}</p>
        </div>
        <div className="flex items-start h-48 space-x-8">
          <div className="flex flex-none flex-col h-full justify-around">
            <img className="w-52 h-32 mb-4" src={card.image} alt=""></img>
            <p className="flex items-center text-sm text-gray-400">Welcome Bonus<span className="ml-1 text-md font-md ml-1 text-black">{`${card.cardDetails.signupBonus.type == 'points' ? `${card.cardDetails.signupBonus.amount} points` : `$${card.cardDetails.signupBonus.amount}`}`}</span></p>
            <h1 className="flex items-center text-sm text-gray-400">Anual Fee <span className="ml-1 text-md font-md ml-1 text-black">{`$${card.cardDetails.annualFee}`}</span></h1>
          </div>
          <div className="bg-gray-100 w-44 py-3 px-4 rounded-md h-full overflow-y-scroll">
            <p className="border-b-2 border-gray-300 text-center text-black-100 text-sm font-bold mb-2">Bonus Categories</p>
            {
              card.cardDetails.cashBackCategories.map((category, index) => {
                return <LineItem icon={categoryToIcon[category.category]} category={category.category} val={`${category.points}X`} key={index}/>
              })
            }
          </div>
        </div>
      </div>
  );
}

export default Card;