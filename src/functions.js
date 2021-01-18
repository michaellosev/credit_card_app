import React, { useState, useEffect } from 'react';

export function LocalStorageHook(initialVal, name) {
  const key = name;
  const [data, setData] = useState(JSON.parse(localStorage.getItem(key)) || initialVal);
  
  useEffect(() => {
    console.log(`setting value of ${name}`)
    localStorage.setItem(key, JSON.stringify(data))
  }, [data])

  return [data, setData]
}