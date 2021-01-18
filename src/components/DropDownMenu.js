import React, { useState } from 'react'
import DropDownMenuItem from './DropDownMenuItem'
import DropDownMenuSelect from './DropDownMenuSelect'

function DropDownMenu({ setDD, ddselected, cards, signupCards, setSignupCards, options, setOptions, error, setError, ref1, open, setOpen }) {

  const names = cards.map(card => card.cardName)
  options = options.sort()

  const handleClick = (name) => {
    const newOptions = options.filter(option => option != name);
    setOptions(newOptions);
    setDD([...ddselected, name])
    setError(errors => {
      return {...errors, dropDown: false}
    })
  }

  const handleClose = (name) => {
    const newest = ddselected.filter(selected => selected != name);
    const newSignupCards = signupCards.filter(card => card.cardName != name);
    setSignupCards(newSignupCards)
    setDD(newest);
    setOptions([name, ...options]);
  }

  return (
    <>
      <div className={`width-full border rounded-xl p-2 flex justify-center items-center ${(open && !error['dropDown']) && 'border-blue-300'} ${error['dropDown'] && 'border-red-400'}`} onClick={() => {setOpen(prev => !prev)}} ref={ref1}>
        <div className="flex flex-wrap w-full border-r-2" >
          { ddselected.length == 0 ? (error['dropDown'] ? <div className="text-red-300">Please select at least one card ...</div> : <div className="text-gray-400">Select ...</div>)
          : ddselected.map((selected, index) => {
              return <DropDownMenuItem name={selected} handleClose={handleClose} key={index}/>
            })
          }
        </div>
        <img src="arrow-right.svg" className="h-6 w-6 p-1 transform rotate-90 ml-2"></img>
      </div>
        {open && (
            <div className="border mt-2 rounded-xl">
              {
                options.map((option, index) => {
                  return <DropDownMenuSelect name={option} handleClick={handleClick} key={index}/>
                })
              }
            </div>
          )
        }
    </>
  )
}



export default DropDownMenu
