import React from 'react';

const Bar = ({ bgcolor, completed }) => {
  
  const containerStyles = {
    height: 14,
    backgroundColor: "#e0e0de",
    borderRadius: 4,
  }

  const fillerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  const labelStyles = {
    fontSize: 10,
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
      </div>
    </div>
  )
}

export default Bar;