import React, { useEffect } from 'react';
import Points from './Points.js';
import { getIndividualCashBackData, getTotals, optimizeCards, getSpendingForSignUpBonus } from '../algo.js';
import Card from './Card.js';
import Bar from './Bar.js'
import './a.css'

const RewardsSummary = ( { setSubmitted, categoryToIcon, data, categories, cards, values, allCards, spend, selectedVals, handleChange, setWeeklyData, signupCards, setSignupCards, options, setOptions }) => {
  // console.log(data)
  // const optimize = optimizeCards(categories, cards, spend, values, []);
  // const signupBonusData = getSpendingForSignUpBonus(optimize, signupCards, values)
  // const withSignupBonusData = optimizeCards(categories, cards, spend, values, signupCards, signupBonusData)
  // console.log(withSignupBonusData)
  const weeklySpend = Object.keys(spend).reduce((acc, cur) => {
    return acc + spend[cur];
  }, 0)

  const before = getTotals(data, cards, signupCards, values, weeklySpend)
  const b2 = getIndividualCashBackData(data, cards, signupCards, values, weeklySpend);
  
  console.log(b2)
  console.log(before)
  // console.log(signupBonusData)

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,      
    maximumFractionDigits: 2,
 });

  const notChosen = allCards.filter(card => {
    return cards.reduce((acc, cur) => {
      return acc && (cur.cardName != card.cardName);
    }, true);
  })

  const f = [];

  notChosen.forEach(card => {

    const newest = cards.reduce((acc, cur) => {
      acc.push(cur)
      return acc;
    }, []);

    newest.push(card);

    const a1 = optimizeCards(categories, newest, spend, values, []);
    const b1 = getSpendingForSignUpBonus(a1, [...signupCards, card], values, weeklySpend);
    const c1 = optimizeCards(categories, newest, spend, values, [...signupCards, card], b1);
    // const d1 = getTotals(c1, newest, [...signupCards, card], values, weeklySpend);
    const e1 = getIndividualCashBackData(c1, newest, [...signupCards, card], values, weeklySpend)
    console.log(e1)

    const a2 = optimizeCards(categories, newest, spend, values, []);
    // const d2 = getTotals(a2, newest, [], values, weeklySpend);
    const e2 = getIndividualCashBackData(a2, newest, [], values, weeklySpend)

    // console.log(b1)

    f.push({
      name: card.cardName,
      spendingData: c1,
      cardInfo: card,
      addedValueYearOne: e1[card.cardName].totalValue,
      addedValueYearTwo: e2[card.cardName].totalValue
    })
  })

  return (
    <div className="flex flex-col w-2/6 p-4 h-screen overflow-y-scroll">
      <div className="flex flex-none bg-white flex-wrap">
        {
          [{pointType:'membershipRewards'}, {pointType:'chaseUltimateRewards'}].map((obj, index) => {
            return <Points details={obj} categoryToIcon={categoryToIcon} data={data} categories={categories} key={index}/>
          })
        }
      </div>
      <div className="flex justify-between border-b-2 mt-8 mb-4 items-center">
        <div className="flex font-light text-xl">
            Card Spend Totals
        </div>
        <div className="flex font-light text-sm text-gray-400">
          Totals from all card spend
        </div>
      </div>
      <div className='flex flex-row w-full'>
        <div className='flex flex-col w-1/4 p-2 space-y-1'>
          <div className='flex justify-center text-xl font-extralight'>Total Value</div>
          <div className='flex justify-center text-green-400 text-md'>{`$${formatter.format(before.netValue)}`}</div>
        </div>
        <div className='flex flex-col w-1/4 p-2 space-y-1'>
          <div className='flex justify-center text-xl font-extralight'>Spend</div>
          <div className='flex justify-center text-blue-400 text-md'>{`$${formatter.format(before.totalSpend)}`}</div>
        </div>
        <div className='flex flex-col w-1/4 p-2 space-y-1'>
          <div className='flex justify-center text-xl font-extralight'>Cash Back</div>
          <div className='flex justify-center text-purple-400 text-md'>{`$${formatter.format(before.totalCashBack)}`}</div>
        </div>
        <div className='flex flex-col w-1/4 p-2 space-y-1'>
          <div className='flex justify-center text-xl font-extralight'>Annual Fees</div>
          <div className='flex justify-center text-red-400 text-md'>{`$${formatter.format(before.totalAnnualFee)}`}</div>
        </div>
      </div>


      <div className="flex justify-between border-b-2 mt-8 mb-4 items-center">
        <div className="flex font-light text-xl">
            Card Spend Statistics
        </div>
        <div className="flex font-light text-sm text-gray-400">
          Try our following suggestions
        </div>
      </div>
      <div className="flex flex-col p-2 space-y-3 mh-1/2 overflow-y-scroll flex-none">
        {
          Object.keys(b2).map(key => {

            const curCard = cards.filter(card => card.cardName == key)[0];

            return (
              <div className="flex flex-col bg-white border rounded-md p-2 space-y-1 shadow-md">
                <div className="flex justify-center border-b my-1 font-extralight">{key}</div>
                <div className="flex items-center text-sm text-gray-400">Cash Back<span className="ml-2 text-md font-md mr-2 text-black">{`$${formatter.format(b2[key].cashBack)}`}</span></div>
                <div className="flex items-center text-sm text-gray-400">Card Spend<span className="ml-2 text-md font-md mr-2 text-black">{`$${formatter.format(b2[key].spend)}`}</span></div>
                <div className="flex items-center text-sm text-gray-400">Points / Cash Collected<span className="ml-2 text-md font-md mr-2 text-black">{`${curCard.cardDetails.signupBonus.type === 'dollars' ? `$${formatter.format(b2[key].pointsCollected / 100)}` : b2[key].pointsCollected}`}</span></div>
                <div className="flex items-center text-sm text-gray-400">Bonus Recieved<span className="ml-2 text-md font-md mr-2 text-black">{`${b2[key].bonus} / ${curCard.cardDetails.signupBonus.amount}`}</span></div>
                <div className="flex items-center text-sm text-gray-400">Total Value<span className={`ml-2 text-md font-md mr-2 text-black ${b2[key].totalValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>{`$${formatter.format(b2[key].totalValue)}`}</span></div>
                <div className="flex flex-col w-4/6 bg-gray-100 space-y-1 p-2 rounded-md">
                  <div className='flex justify-between'>
                    <div className="flex items-center text-sm text-gray-400">Total Spend</div>
                    <div className="text-md font-md text-blue-400">{`${formatter.format((b2[key].spend / before.totalSpend) * 100)}%`}</div>
                  </div>
                  <Bar bgcolor="#3c82f6" completed={(b2[key].spend / before.totalSpend) * 100} content={formatter.format((b2[key].spend / before.totalSpend) * 100)}/>
                </div>
                <div className="flex flex-col w-4/6 bg-gray-100 space-y-1 p-2 rounded-md">
                  <div className='flex justify-between'>
                    <div className="flex items-center text-sm text-gray-400">Total Cash Back</div>
                    <div className="text-md font-md text-purple-400">{`${formatter.format((b2[key].cashBack / before.totalCashBack) * 100)}%`}</div>
                  </div>
                  <Bar bgcolor="#a88cfa" completed={(b2[key].cashBack / before.totalCashBack) * 100}/>
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="flex justify-between border-b-2 mt-8 mb-4 items-center">
        <div className="flex font-light text-xl">
            Recommendations
        </div>
        <div className="flex font-light text-sm text-gray-400">
          Try our following suggestions
        </div>
      </div>
      <div className="overflow-y-scroll flex flex-col p-2 space-y-4 flex-none h-4/6">
        {
          f.map((card, index) => {
            return (
              <div className="flex flex-col items-start bg-gray-100 border rounded-md">
                <div className="px-4 mt-2">
                  <div className="flex items-center text-sm text-gray-400">You can add<span className={`ml-2 text-md font-md mr-2 ${card.addedValueYearOne >= 0 ? 'text-green-400' : 'text-red-400'}`}>{`$${formatter.format(card.addedValueYearOne)}`}</span> of cash back the first Year you add this card</div>
                  <div className="flex items-center text-sm text-gray-400">You can add<span className={`ml-2 text-md font-md mr-2 ${card.addedValueYearTwo >= 0 ? 'text-green-400' : 'text-red-400'}`}>{`$${formatter.format(card.addedValueYearTwo)}`}</span> of cash back the second Year you add this card</div>
                </div>
                <div className="relative">
                  <button title="add Card" className= "absolute w-8 h-8 bg-white border rounded-full hover:bg-green-200 right-0 shadow-lg" onClick={() => {
                    setOptions(options.filter(option => option != card.name))
                    setSignupCards([...signupCards, card.cardInfo])
                    setWeeklyData(card.spendingData)
                    handleChange([...selectedVals, card.cardInfo.cardName])
                  }}>
                    <img src='expand.svg'></img>
                  </button>
                  <Card card={card.cardInfo} selectedVals={selectedVals} categoryToIcon={categoryToIcon} key={index}/>
                </div>
             </div>
            )
          })
        }
      </div>
      <button 
        className="p-4 bg-green-400 mt-4"
        onClick={() => { setSubmitted(prev => !prev) }}>
        back
      </button>
    </div>
  );
}

export default RewardsSummary;