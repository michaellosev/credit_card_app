import React, {useState} from 'react'
import TextInput from './TextInput'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import DropDownMenu from './DropDownMenu'

export default function SpendingForm({ handleInputChange, inputValues, categories, onSubmit, setDD, ddselected, cards, signupCards, setSignupCards, options, setOptions, error, setError, pointsValue, setPointsValue, ref1, open, setOpen }) {

  const handleSubmit = (e) => {
    onSubmit();
  }

  const handlePointsChange = (pointType, val) => {
    setError(error => {
      return {...error, [pointType]: false}
    })
    setPointsValue(prev => {
        return {...prev, [pointType]: val}
    })
  }

  return (
    <div className="flex flex-col">
      <div className="flex font-light text-xl border-b-2 bg-white mb-8">
          Select the cards that you currently own
      </div>
      <DropDownMenu 
        ref1={ref1}
        setDD={setDD} 
        ddselected={ddselected} 
        cards={cards} signupCards={signupCards} 
        setSignupCards={setSignupCards}
        options={options}
        setOptions={setOptions}
        error={error}
        setError={setError}
        open={open}
        setOpen={setOpen}
      />
      <div className="flex justify-between border-b-2 mt-8 items-center">
        <div className="flex font-light text-xl">
            Spending Categories
        </div>
        <div className="flex font-light text-sm text-gray-400">
          How much do you spend each Week?
        </div>
      </div>
      <div className="flex flex-row items-center flex-wrap justify-between">
        {
          categories.map((category, index) => {
            return <TextInput category={category} handleInputChange={handleInputChange} inputValues={inputValues} img='dollar-symbol.svg' key={index}/>
          })
        }
      </div>
      <div className="flex justify-between border-b-2 mt-8 items-center">
        <div className="flex font-light text-xl">
            Reward Point Value
        </div>
        <div className="flex font-light text-sm text-gray-400">
          How many cents do you thing each point is worth?
        </div>
      </div>

      <div className='flex justify-between'>
  
        <div className="flex flex-col mt-8 space-y-1">
          <div className="flex justify-between">
            <div className="capitalize text-sm text-gray-400">ChaseUltimateRewards</div>
            <div className="capitalize text-sm text-gray-400">value</div>
          </div>
          <div className='flex flex-col space-y-2'>
            <div className="flex items-center h-9">
              <div className="flex-none font-semibold w-10 h-full flex justify-center items-center border-l border-t border-b border-gray-200 rounded-l-md"><img className='p-3' src='cash.svg'></img></div>
              <input className={`font-extraslim px-2 py-1 border h-full flex focus:outline-none focus:border-blue-200 text-sm ${error['chaseUltimateRewards'] && 'border-red-300 focus:border-red-300'}`} type="text" placeholder='amount' onChange={(e) => handlePointsChange('chaseUltimateRewards', e.target.value)} value={pointsValue['chaseUltimateRewards']}/>
              <div className="flex-none font-semibold w-10 h-full flex justify-center items-center bg-gray-100 border-r border-t border-b border-gray-200 rounded-r-md">.00</div>
            </div>
            {error['chaseUltimateRewards'] && <div className='text-sm font-extralight text-red-300'>Please input a valid number</div>}
          </div>
        </div>
        <div className="flex flex-col mt-8 space-y-1">
          <div className="flex justify-between">
            <div className="capitalize text-sm text-gray-400">MembershipRewards</div>
            <div className="capitalize text-sm text-gray-400">value</div>
          </div>
          <div className='flex flex-col space-y-2'>
            <div className="flex items-center h-9">
              <div className="flex-none font-semibold w-10 h-full flex justify-center items-center border-l border-t border-b border-gray-200 rounded-l-md"><img className='p-3' src='cash.svg'></img></div>
              <input className={`font-extraslim px-2 py-1 border h-full flex focus:outline-none focus:border-blue-200 text-sm ${error['membershipRewards'] && 'border-red-300 focus:border-red-300'}`} type="text" placeholder='amount' onChange={(e) => handlePointsChange('membershipRewards', e.target.value)} value={pointsValue['membershipRewards']}/>
              <div className="flex-none font-semibold w-10 h-full flex justify-center items-center bg-gray-100 border-r border-t border-b border-gray-200 rounded-r-md">.00</div>
            </div>
            {error['membershipRewards'] && <div className='text-sm font-extralight text-red-300'>Please input a valid number</div>}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button className="bg-gray-100 rounded-full focus:outline-none border focus:border-red-300 hover:bg-green-300 mt-8" onClick={handleSubmit}>
          <img src="arrow-right.svg" className="h-10 w-10 p-1"></img>
        </button>
      </div>
    </div>
  )
}
