import React from 'react'

export default function DropDownMenuItem({ name, handleClose }) {
  return (
    <div className="flex border rounded-xl px-2 text-sm bg-gray-200 mt-1 ml-1 items-center space-x-2 relative">
      <div className="">
        {name}
      </div>
      <button className="focus:outline-none hover:bg-red-300 border rounded-sm" onClick={(e) => {
          e.stopPropagation();
          handleClose(name)
        }
      }>
        <img src="x.svg" className="h-4 w-4"></img>
      </button>
    </div>
  )
}
