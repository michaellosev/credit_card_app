import React from 'react'

export default function DropDownMenuSelect({ name, handleClick }) {
  return (
      <div className="w-full rounded-xl p-2 hover:bg-blue-100" onClick={(e) => {
        e.stopPropagation()
        handleClick(name)
      }}>
        {name}
      </div>
  )
}