import React from 'react'

function Button(
    {
        children,
        type = 'button',
        bgColor = 'bg-color-600',
        textColor = 'text-white',
        className = '',
        ...props 
    }
) {
  return (
    <button className={`px-4 py-2 rounded-lg bg-green-800 ${bgColor} 
    ${textColor} ${className}`} {...props}>
        {children}
    </button>
  )
}

export default Button
