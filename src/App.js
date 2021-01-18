import React, { useState, useEffect, useRef } from 'react';
import './styles/app.css';
import Card from './components/Card';
import SpendingForm from './components/SpendingForm';
import { optimizeCards, getIndividualCashBackData, getTotals, getSpendingForSignUpBonus } from './algo.js'
import PointSummary from './components/PointSummary'
import RewardsSummary from './components/RewardsSummary';
import { LocalStorageHook } from './functions.js'

function App() {

  let names = require('./credit.json');

  const categoryToIcon = {
    dining: "serving-dish.svg",
    travel: "plane.svg",
    groceries: "shopping-cart.svg",
    other: "infinity.svg",
    gas: "gas.svg",
    flex: "flex.svg",
    drugstore: "drugstore.svg",
    streaming: "streaming.svg",
    transit: "train.svg"
  }

  const categories = names.reduce((accumulator, val) => {
    const items = val.cardDetails.cashBackCategories.filter(item => !accumulator.includes(item.category));
    items.forEach(item => {
      accumulator.push(item.category)
    });
    return accumulator;
  },[])

  const setExistingErrors = (cards) => {
    let seenError = false;
    if (cards.length == 0) {
      setErrors(errors => {
        console.log('cards error')
        return {...errors, dropDown: true}
      });
      seenError = true;
    }
    if (pointsValue['chaseUltimateRewards'] === '' || isNaN(+pointsValue['chaseUltimateRewards'])) {
      setErrors(errors => {
        return {...errors, chaseUltimateRewards: true}
      })
      seenError = true;
    }
    if (pointsValue['membershipRewards'] === '' || isNaN(+pointsValue['membershipRewards'])) {
      setErrors(errors => {
        return {...errors, membershipRewards: true}
      })
      seenError = true;
    }
    return seenError
  }

  const convertToInt = (values) => {
    return Object.keys(values).reduce((acc, cur) => {
      acc[cur] = +values[cur]
      return acc;
    }, {})
  }

  const onSubmit = () => {
    if (setExistingErrors(cards)) {
      console.log('foundErrors')
    }
    // if (cards.length == 0) {
    //   setError({...errors, dropDown: true});
    // }
    else {

      const weeklySpend = Object.keys(inputValues).reduce((acc, cur) => {
        return acc + inputValues[cur];
      }, 0)

      const v = convertToInt(pointsValue)

      if (signupCards.length > 0) {
        const optimize = optimizeCards(categories, cards, inputValues, v, []);
        const signupBonusData = getSpendingForSignUpBonus(optimize, signupCards, v, weeklySpend)
        console.log(signupBonusData)
        const withSignupBonusData = optimizeCards(categories, cards, inputValues, v, signupCards, signupBonusData)
        setWeeklyData(withSignupBonusData)
      }
      else {
        const data = optimizeCards(categories, cards, inputValues, v, [])
        setWeeklyData(data)
      }
      // setError(false)
      setSubmitted(true)
    }
  }

  const handleInputChange = (val, category) => {
    setInputValues(prev => {
      return {...prev, [category]: +val};
    })
  }

  const getOptions = (cards) => {

    return cards.reduce((acumulator, currentVal) => {
      const obj = {};
      obj.value = currentVal.id;
      obj.label = currentVal.cardName;
      acumulator.push(obj)
      return acumulator

    }, [])
  }

  const setDD = (val) => {
    const newest = names.filter(name => {
      return val.includes(name.cardName)
    })
    setddSelected(val)
    setCards(newest)
  }

  // const [inputValues, setInputValues] = useState(() => {
  //     return JSON.parse(localStorage.getItem('inputValues')) || categories.reduce((acc , cur) => {
  //       acc[cur] = ''
  //       return acc;
  //     }, {})
  // })
  // const [ddselected, setddSelected] = useState([])
  // const [pointsValue, setPointsValue] = useState({"chaseUltimateRewards": 0.015, "membershipRewards": 0.0125})
  // const [submitted, setSubmitted] = useState(false)
  // const [weeklyData, setWeeklyData] = useState([])
  // const [cards, setCards] = useState([])
  // const [signupCards, setSignupCards] = useState([])
  // const [weeklySpend, setWeeklySpend] = useState(0)
  // const [options, setOptions] = useState(() => names.map(card => card.cardName))
  // const [errors, setErrors] = useState({dropDown: false, chaseUltimateRewards: false, membershipRewards: false})

  const [inputValues, setInputValues] = LocalStorageHook(() => categories.reduce((acc , cur) => {
    acc[cur] = ''
    return acc;
  }, {}), 'inputValues')
  const [submitted, setSubmitted] = LocalStorageHook(false, 'submitted')
  const [weeklyData, setWeeklyData] = LocalStorageHook([], 'weeklyData')
  const [cards, setCards] = LocalStorageHook([], 'cards')
  const [ddselected, setddSelected] = LocalStorageHook([], 'ddSelected')
  const [signupCards, setSignupCards] = LocalStorageHook([], 'signupCards')
  const [weeklySpend, setWeeklySpend] = LocalStorageHook(0, 'weelySpend')
  const [options, setOptions] = LocalStorageHook(() => names.map(card => card.cardName), 'options')
  const [errors, setErrors] = LocalStorageHook({dropDown: false, chaseUltimateRewards: false, membershipRewards: false}, 'errors')
  const [pointsValue, setPointsValue] = LocalStorageHook({"chaseUltimateRewards": 0.015, "membershipRewards": 0.0125}, 'pointsValue')
  const [open, setOpen] = useState(false)
  
  const ref1 = useRef()
  const ref2 = useRef()
  ref2.current = open
  
  useEffect(() => {

    function checkForChildNodes(event, ref) {
      if (event.target == ref.current) {return true}
      for (let i = 0; i < ref.current.childNodes.length; i++) {
        if (event.target == ref.current.childNodes[i]) {
          return true
        }
      }
      return false
    }

    function handleClick(event) {
      if (ref2.current && !checkForChildNodes(event, ref1)) {
        setOpen(false)
      }
    }

    window.addEventListener("click", handleClick);
    return () => {
      console.log('removing event listener')
      window.removeEventListener("keyup", handleClick)
    }
  }, [])

  return (
    <div className="">
      <div className="flex">
        <div className="w-4/6 h-screen flex flex-col">
          {
            submitted ? (
              <div className="bg-gray-100">
                <PointSummary 
                  setSubmitted={setSubmitted} 
                  weeklyData={weeklyData}
                /> 
              </div>
            )
            : 
              (
                <div className="flex flex-wrap content-start border-l rounded-lg bg-gray-100 shadow-xl overflow-y-scroll px-14">
                  {
                    names.map((card, index) => {
                      return <Card card={card} selectedVals={ddselected} categoryToIcon={categoryToIcon} key={index}/>
                    })
                  }
                </div>
              )
          }
        </div>
          {
            submitted ? (
              <RewardsSummary
                setSubmitted={setSubmitted} 
                categoryToIcon={categoryToIcon} 
                data={weeklyData} 
                cards={cards} 
                values={convertToInt(pointsValue)}
                allCards={names}
                categories={categories}
                spend={inputValues}
                selectedVals={ddselected}
                handleChange={setDD}
                setWeeklyData={setWeeklyData}
                signupCards={signupCards}
                setSignupCards={setSignupCards}
                options={options}
                setOptions={setOptions}
              />
            ) : (
            <div className="flex flex-col space-y-2 w-2/6 p-4 space-y-5 overflow-y-scroll h-screen">
              <SpendingForm 
                ref1={ref1} 
                handleInputChange={handleInputChange} 
                inputValues={inputValues} 
                categories={categories} 
                onSubmit={onSubmit}
                setDD={setDD}
                ddselected={ddselected}
                cards={names}
                signupCards={signupCards}
                setSignupCards={setSignupCards}
                options={options}
                setOptions={setOptions}
                error={errors}
                setError={setErrors}
                pointsValue={pointsValue}
                setPointsValue={setPointsValue}
                open={open}
                setOpen={setOpen}
              />
            </div>
            )
          }
      </div>
    </div>
  );
}

export default App;
