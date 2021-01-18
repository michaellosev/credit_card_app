const values = {
  "chaseUltimateRewards": 0.015,
  "membershipRewards": 0.0125
}

const cards = require('./credit.json');
// const signUpCards = require ('./practice.json');

const addCard = (arr, cardName, spend, points, valueBack, rewardType) => {
  arr.cards.push(
    {
      name: cardName,
      spend: spend,
      pointsCollected: spend * points,
      cashBack: valueBack * spend,
      pointType: rewardType,
      valueBack: valueBack
    }
  )
}

const getSpendForTime = (weeklySpend, months) => {
  let now = new Date();
  const then = addMonths(now, months);
  let weeks = 0;
  while (now < then) {
    weeks++;
    now.setDate(now.getDate() + 7);
  }
  return weeklySpend * weeks;
}

const getMatrix = (original, width, height) => {
  const newest = new Array(width+1);
  for (let i = 0; i < newest.length; i++) {
    newest[i] = new Array(height+1);
  }
  for (let i = 0; i < original.length; i++) {
    for(let j = 0; j < newest[0].length; j++) {
      if (j < original[0].length) {
        newest[i][j] = original[i][j]
      }
      else {
        newest[i][j] = newest[i][j-1]
      }
    }
  }
  return newest;
}

const knapsackFullOfCards = (c, spend, values) => {
  // seperate the cards with different times to earn signupBonus into differnt groups
  const groups = c.reduce((acc, cur) => {
    if (acc.length == 0) {
      acc.push([cur])
    }
    else {
      let i = 0;
      for(; i < acc.length; i++) {
        if (acc[i][0].cardDetails.signupBonus.time == cur.cardDetails.signupBonus.time) {
          acc[i].push(cur);
          break;
        }
      }
      if (i == acc.length) {
        acc.push([cur]);
      }
    }
    return acc;

  }, []);

  groups.sort((a, b) => {
    return a[0].cardDetails.signupBonus.time - b[0].cardDetails.signupBonus.time;
  })

  const allCards = groups.reduce((acc, cur) => {
    cur.forEach(card => {
      acc.push(card)
    })
    return acc;
  }, [])

  let matrix = [[0]];
  let totalSpend = 0;
  let numCards = 0;

  for (let a = 0; a < groups.length; a++) {
    const cards = groups[a];
    totalSpend =  Math.ceil(totalSpend + (getSpendForTime(spend, cards[0].cardDetails.signupBonus.time) - totalSpend));
    matrix = getMatrix(matrix, numCards + cards.length, totalSpend)

    for(let i = numCards+1; i < matrix.length; i++) {
      for(let j = 0; j < matrix[0].length; j++) {
        if (i == 0 || j == 0) {
          matrix[i][j] = 0;
        }
        else if (allCards[i-1].cardDetails.signupBonus.neededSpend > j) {
          matrix[i][j] = matrix[i-1][j];
        }
        else {
          matrix[i][j] = Math.max(matrix[i-1][j], (allCards[i-1].cardDetails.signupBonus.amount * values[allCards[i-1].cardDetails.pointType]) + matrix[i-1][j-allCards[i-1].cardDetails.signupBonus.neededSpend]);
        }
      }
    }
    numCards += cards.length;
  }

  let chosen = [];
  let i = numCards;
  let j = totalSpend;
  while (matrix[i][j] == matrix[i][j-1]) {
    j--;
  }
  // console.log(j)
  while (matrix[i][j] != 0) {
    const val = (allCards[i-1].cardDetails.signupBonus.amount * values[allCards[i-1].cardDetails.pointType]);
    const weight = allCards[i-1].cardDetails.signupBonus.neededSpend;
    if (j-weight >= 0 && matrix[i-1][j-weight] == matrix[i][j] - val) {
      chosen.push(allCards[i-1]);
      i--;
      j -= weight;
    }
    else {
      i--;
    }
  }
  return chosen
}

const getFiltered = (cards, category, pointValue) => {
  const result = cards.reduce((acc, cur) => {
    const obj = {};
    obj.name = cur.cardName;
    obj.pointType = cur.cardDetails.pointType;
    const categoryDetails = cur.cardDetails.cashBackCategories.filter(item => item.category == category);
    const details = categoryDetails.length > 0 ? categoryDetails[0] : cur.cardDetails.cashBackCategories.filter(item => item.category == 'other')[0]
    obj.details = {
      category: details.category,
      limit: details.limit,
      period: details.period,
      points: details.points,
      timeUntil: details.timeUntil
    }
    obj.valueBack = obj.details.points * pointValue[obj.pointType];
    acc.push(obj);
    return acc;
  }, [])

  result.sort((a, b) => b.valueBack - a.valueBack);
  return result;
}

const addMonths = (date, months) => {
  var d = date.getDate();
  let newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + +months);
  if (newDate.getDate() != d) {
    newDate.setDate(0);
  }
  return newDate;
}

export function optimizer(cards, category, spend, pointValue, signUpCards, signUpCardsData) {
  const startDate = new Date();
  let curDate = new Date();
  const result = [];

  let filtered = getFiltered(cards, category, pointValue)

  let highestCardIndex = 0;
  let highestCard = filtered[highestCardIndex];
  let _highestCard = highestCard;
  let _highestCardIndex = highestCardIndex;
  let _limit = 0;
  let inEdgeCase = false;
  let period = 0;
  
  for (let i = 0; i < 52; i++) {
    let weeklySpend = spend;
    const newest = {}
    newest.date = curDate.toLocaleDateString();
    newest.category = category;
    newest.cards = [];
    while (weeklySpend > 0) {
      if (signUpCards.length > 0) {
        if (Object.keys(signUpCardsData.result).includes(curDate.toLocaleDateString())) {
          if (Object.keys(signUpCardsData.result[curDate.toLocaleDateString()]).includes(category)) {
            const temp = signUpCardsData.result[curDate.toLocaleDateString()][category];
            const tempCard = filtered.filter(card => card.name == temp.name)[0];
            addCard(newest, temp.name, temp.spend, tempCard.details.points, tempCard.valueBack, tempCard.pointType);
            weeklySpend -= temp.spend;
            continue;
          }
        }
      }
      if (highestCardIndex >= filtered.length) {
        filtered = getFiltered(cards, 'other', pointValue);
        highestCardIndex = 0;
        highestCard = filtered[highestCardIndex];
      }
      while (highestCard.details.limit == 0) {
          highestCardIndex++;
          if (highestCardIndex >= filtered.length) {
            filtered = getFiltered(cards, 'other', pointValue);
            highestCardIndex = 0;
            highestCard = filtered[highestCardIndex];
          }
          else {
            highestCard = filtered[highestCardIndex];
          }
      }
      if (inEdgeCase) {
        if (period != 0 && period % (_highestCard.details.period * 4) == 0) {
          highestCard = _highestCard;
          highestCardIndex = _highestCardIndex;
          highestCard.details.limit = _limit;
          period = 0;
        } 
      }
      if (highestCard.details.limit == null) {
        if (highestCard.details.timeUntil == null) {
          if (highestCard.details.period == null) {
            addCard(newest, highestCard.name, weeklySpend, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
            weeklySpend -= weeklySpend;
          }
        }
        else {
          if (typeof highestCard.details.timeUntil == 'number') {
            if (curDate >= addMonths(startDate, highestCard.details.timeUntil)) {
              highestCard = filtered[++highestCardIndex];
            }
            else {
              addCard(newest, highestCard.name, weeklySpend, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
              weeklySpend -= weeklySpend;
            }
          }
          else {
            const newestDate = new Date(highestCard.details.timeUntil);
            if (curDate >= newestDate) {
              highestCard = filtered[++highestCardIndex];
            }
            else {
              addCard(newest, highestCard.name, weeklySpend, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
              weeklySpend -= weeklySpend;
            }
          }
        }
      }
      else {
        if (highestCard.details.timeUntil == null) {
          if (highestCard.details.limit >= weeklySpend) {
            addCard(newest, highestCard.name, weeklySpend, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
            highestCard.details.limit -= weeklySpend;
            weeklySpend -= weeklySpend;
          }
          else {   
            addCard(newest, highestCard.name, highestCard.details.limit, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
            weeklySpend -= highestCard.details.limit;
            highestCard.details.limit = 0;
            highestCard = filtered[++highestCardIndex];
          }
        }
        else {
          if (highestCard.details.period == null) {
            if (typeof highestCard.details.timeUntil == 'number') {
              if (curDate >= addMonths(startDate, highestCard.details.timeUntil)) {
                highestCard = filtered[++highestCardIndex];
              }
              else {
                if (highestCard.details.limit >= weeklySpend) {
                  addCard(newest, highestCard.name, weeklySpend, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
                  highestCard.details.limit -= weeklySpend;
                  weeklySpend -= weeklySpend;
                }
                else {
                  addCard(newest, highestCard.name, highestCard.details.limit, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
                  weeklySpend -= highestCard.details.limit;
                  highestCard.details.limit = 0;
                  highestCard = filtered[++highestCardIndex];
                }
              }
            }
            else {
              const newestDate = new Date(highestCard.details.timeUntil);
              if (curDate >= newestDate) {
                highestCard = filtered[++highestCardIndex];
              }
              else {
                if (highestCard.details.limit >= weeklySpend) {
                  addCard(newest, highestCard.name, weeklySpend, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
                  highestCard.details.limit -= weeklySpend;
                  weeklySpend -= weeklySpend;
                }
                else {
                  addCard(newest, highestCard.name, highestCard.details.limit, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
                  weeklySpend -= highestCard.details.limit;
                  highestCard.details.limit = 0;
                  highestCard = filtered[++highestCardIndex];
                }
              }
            }
          }
          else {
            inEdgeCase = true;
            _limit = highestCard.details.limit;
            _highestCard = highestCard;
            _highestCardIndex = highestCardIndex;
  
            if (typeof highestCard.details.timeUntil == 'number') {
              if (curDate >= addMonths(startDate, highestCard.details.timeUntil)) {
                highestCard = filtered[++highestCardIndex];
                inEdgeCase = false;
              }
              else {
                if (period < highestCard.details.period * 4 && highestCard.details.limit >= weeklySpend) {
                  addCard(newest, highestCard.name, weeklySpend, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
                  highestCard.details.limit -= weeklySpend;
                  weeklySpend -= weeklySpend;
                }
                else {
                  addCard(newest, highestCard.name, highestCard.details.limit, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
                  weeklySpend -= highestCard.details.limit;
                  highestCard.details.limit = 0;
                  highestCard = filtered[++highestCardIndex];
                }
              }
            }
            else {
              const newestDate = new Date(highestCard.details.timeUntil);
              if (curDate >= newestDate) {
                highestCard = filtered[++highestCardIndex];
                inEdgeCase = false
              }
              else {
                if (period < highestCard.details.period * 4 && highestCard.details.limit >= weeklySpend) {
                  addCard(newest, highestCard.name, weeklySpend, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
                  highestCard.details.limit -= weeklySpend;
                  weeklySpend -= weeklySpend;
                }
                else {
                  addCard(newest, highestCard.name, highestCard.details.limit, highestCard.details.points, highestCard.valueBack, highestCard.pointType);
                  weeklySpend -= highestCard.details.limit;
                  highestCard.details.limit = 0;
                  highestCard = filtered[++highestCardIndex];
                }
              }
            }
          }
        }
      }
    }
    if (inEdgeCase) {
      period++;
    }
    result.push(newest);
    curDate.setDate(curDate.getDate() + 7);
  }
  // for (let i = 0; i < result.length; i++) {
  //   console.log(result[i].date)
  //   console.log(result[i].cards)
  // }
  return result
}

export function optimizeCards(categories, cards, spend, pointValue, signUpCards, signUpCardsData=null) {

  const map = categories.map(category => {

    return {
      category: category,
      result: optimizer(cards, category, spend[category], pointValue, signUpCards, signUpCardsData)
    }

  })

  const res = map[0].result.reduce((acc, item) => {

    const obj = {}
    obj.date = item.date
    obj.result = []
    acc.push(obj)
    return acc;

  }, []) 

  for (let i = 0; i < 52; i++) {
    for (let j = 0; j < categories.length; j++) {
      res[i].result.push(
        {
          category: map[j].result[i].category,
          cards: map[j].result[i].cards
        }
      );
    }
  }
  return res;
}

export function getIndividualCashBackData(data, cards, signUpCards, values, weeklySpend) {

  const gotCashBack = getSpendingForSignUpBonus(data, signUpCards, values, weeklySpend).bonusHit

  const result = data.reduce((acc, weekSpend) => {
    weekSpend.result.forEach(categorySpend => {
      categorySpend.cards.forEach(cardSpend => {
        if (acc.hasOwnProperty(cardSpend.name)) {
          acc[cardSpend.name].spend += cardSpend.spend;
          acc[cardSpend.name].pointsCollected += cardSpend.pointsCollected;
          acc[cardSpend.name].cashBack += cardSpend.cashBack;
        }
        else {
          const cardSpendData = {}
          cardSpendData.spend = cardSpend.spend;
          cardSpendData.pointsCollected = cardSpend.pointsCollected;
          cardSpendData.pointType = cardSpend.pointType;
          cardSpendData.cashBack = cardSpend.cashBack;
          if (gotCashBack != undefined && gotCashBack.includes(cardSpend.name)) {
            cardSpendData.bonus = cards.filter(card => card.cardName == cardSpend.name)[0].cardDetails.signupBonus.amount
          }
          else {
            cardSpendData.bonus = 0;
          }
          acc[cardSpend.name] = cardSpendData
        }
      })
    })
    return acc;
  }, {})

  cards.forEach(card => {
    if (result.hasOwnProperty(card.cardName)) {
      result[card.cardName].totalValue = result[card.cardName].cashBack - card.cardDetails.annualFee;
      if (gotCashBack != undefined && gotCashBack.includes(card.cardName)) {
        if (card.cardDetails.signupBonus.type != 'points') {
          result[card.cardName].totalValue += result[card.cardName].bonus
        }
        else {
          result[card.cardName].totalValue += (result[card.cardName].bonus * values[result[card.cardName].pointType])
        }
      }
    }
    else {
      const cardSpendData = {};
      cardSpendData.spend = 0;
      cardSpendData.pointsCollected = 0;
      cardSpendData.pointType = null;
      cardSpendData.cashBack = 0;
      cardSpendData.bonus = 0;
      cardSpendData.totalValue = 0 - card.cardDetails.annualFee;
      result[card.cardName] = cardSpendData;
    }
  })

  return result;
}

export function getTotals(data, cards, signUpCards, values, weeklySpend) {

  const result = getIndividualCashBackData(data, cards, signUpCards, values, weeklySpend);

  return cards.reduce((acc, card) => {
    if (Object.keys(acc).length == 0) {
      acc.totalCashBack = 0;
      acc.totalAnnualFee = 0;
      acc.netValue = 0;
      acc.totalSpend = 0;
      acc.totalBonuses = 0;
    }

    acc.totalCashBack += result[card.cardName].cashBack;
    acc.totalAnnualFee += card.cardDetails.annualFee;
    acc.netValue += result[card.cardName].totalValue;
    acc.totalSpend += result[card.cardName].spend;
    if (signUpCards.map(card => card.cardName).includes(card.cardName)) {
      acc.totalBonuses += result[card.cardName].bonus;
    }

    return acc
  }, {})
}

const categories = cards.reduce((accumulator, val) => {
  const items = val.cardDetails.cashBackCategories.filter(item => !accumulator.includes(item.category));
  items.forEach(item => {
    accumulator.push(item.category)
  });
  return accumulator;
},[])

const spend = {
  'dining': 50, 
  'travel': 80,
  'groceries': 150,
  'other': 10,
  'drugstore': 10,
  'streaming': 20,
  'transit': 45,
  'gas': 40
}

export function getSpendingForSignUpBonus(data, cards, values, weeklySpend) {

  const result = data.reduce((acc, cur) => {
    cur.result.forEach(result => {
      result.cards.forEach(card => {
        if (acc.filter(item => item.valueBack === card.valueBack).length == 0) {
          const newest = {};
          newest.valueBack = card.valueBack;
          newest.result = []
          acc.push(newest);
        }
    
        acc.filter(item => item.valueBack === card.valueBack)[0].result.push(
          {
            date: cur.date,
            category: result.category,
            valid: true,
            spend: card
          }
        )
        
      })
    })
    return acc;
  }, [])
  
  result.sort((a, b) => a.valueBack - b.valueBack)

  const c = knapsackFullOfCards(cards, weeklySpend, values)
  // console.log(c)
  const g = c.reduce((acc, cur) => {
    acc.push(cur.cardName);
    return acc;
  }, [])

  const ans = cards.reduce((acc, card) => {
    acc[card.cardName] = [];
    return acc;
  }, {})

  cards.sort((a, b) => {
    return a.cardDetails.signupBonus.time - b.cardDetails.signupBonus.time;
  })

  cards.forEach(card => {

    if (g.includes(card.cardName)) {
      let amount = card.cardDetails.signupBonus.neededSpend;
      const deadline = addMonths(new Date(), card.cardDetails.signupBonus.time);
      let index = 0;
      let spendIndex = 0;
  
      while (amount > 0 && spendIndex < result.length) {
        // console.log(spendIndex)
        // console.log(index)
        // console.log(ans)
        if (index >= result[spendIndex].result.length || new Date(result[spendIndex].result[index].date) >= deadline) {
          index = 0;
          spendIndex++;
        }
        else {
          if (result[spendIndex].result[index].valid) {
            ans[card.cardName].push(
              {
                date: result[spendIndex].result[index].date,
                category: result[spendIndex].result[index].category,
                spend: result[spendIndex].result[index].spend.spend
              }
            )
            amount -= result[spendIndex].result[index].spend.spend;
            result[spendIndex].result[index].valid = false;
          }
          index++;
        }
      }
    }

    else {
      ans[card.cardName] = []
    }

  })
  // console.log(c)

  const finalResult = Object.keys(ans).reduce((acc, cur) => {
    if (!acc.hasOwnProperty('bonusHit')) {
      acc.bonusHit = []
      acc.result = {}
    }
    if (ans[cur].length == 0) {
      return acc;
    }
    else {
      acc.bonusHit.push(cur);
      return acc;
    }
  }, {})

  Object.keys(ans).forEach(key => {
    ans[key].forEach(item => {
      if (!finalResult.result.hasOwnProperty(item.date)) {
        finalResult.result[item.date] = {};
      }
      finalResult.result[item.date][item.category] = 
        {
          spend: item.spend,
          name: key,
        }
    })
  })
  // console.log(finalResult)
  return finalResult;
}

// const temp = ['Chase Freedom Unlimited', 'Chase Freedom Flex', 'American Express Gold Card', 'American Express Platinum Card', 'Chase Sapphire Reserve']
// const signUpCards = cards.filter(card => temp.includes(card.cardName));

// const ans = optimizeCards(categories, cards, spend, values, [], null);
// ans.forEach(card => {
//   console.log(card)
// }) 

// const b = getSpendingForSignUpBonus(ans, signUpCards, values, 405);
// console.log(b.result)

// const c = optimizeCards(categories, cards, spend, values, signUpCards, b)
// console.log(b)
// c.forEach(item => {
//   console.log(item.result[3])
// })
// console.log(getIndividualCashBackData(c, cards, signUpCards, values))

// console.log(b)
// console.log('finished')
// optimizer(cards, 'groceries', 40000, values, "M")
// console.log(getSpendForTime(250, 3));
// console.log(b)
// knapsackFullOfCards(b, 300, values)