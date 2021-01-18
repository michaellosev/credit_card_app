import React from 'react';
import LineItem from './lineItem';
import AnimatedNumber from "animated-number-react";

const Points = ({ details, categoryToIcon, data, categories }) => {

  const formatValue = value => `${Number(value).toFixed(0)}`;

  const getTotalPoints = (data, rewardType) => {
    return data.reduce((acc, weekly) => {
      weekly.result.forEach(_weekly => {
        _weekly.cards.forEach(card => {
          if (rewardType == card.pointType) {
            if (!acc.hasOwnProperty(_weekly.category)) {
              acc[_weekly.category] = 0;
            }
            acc[_weekly.category] += card.pointsCollected;
          }
        })
      })
      return acc;
    }, {})
  }

  const points = getTotalPoints(data, details.pointType)

  return (
    <div className="w-1/2">
      <div className="flex flex-col items-center p-4 mx-2 border rounded-md space-y-2 shadow-md">
        <div className="text-center text-md font-semi border-b-2 border-gray-300 mb-1 w-full py-1 capitalize">{details.pointType}</div>
        <div className="w-full">
          {
            categories.map((category, index) => {
              return (
                <div className="flex items-center space-x-4 w-full">
                  <img className="w-4 h-4" src={categoryToIcon[category]} alt=""></img>
                  <div className="flex justify-between items-center w-full space-x-6">
                    <p className="flex items-center text-sm">{category}</p>
                    <AnimatedNumber
                      className="text-blue-500 font-light text-lg"
                      value={points.hasOwnProperty(category) ? points[category] : 0}
                      formatValue={formatValue}
                      duration={1000}
                      key={index}
                    />
                  </div>
                </div>
              )
            })
          }
          {/* <LineItem icon="plane.svg" category="travel" val="0"/>
          <LineItem icon="serving-dish.svg" category="restaurant" val="0"/>
          <LineItem icon="infinity.svg" category="Other" val="0"/>
          <LineItem icon="shopping-cart.svg" category="Groceries" val="0"/> */}
        </div>
      </div>
    </div>
  );
}

export default Points;