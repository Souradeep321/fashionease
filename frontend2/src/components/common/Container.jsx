import React, { Children } from 'react'

const Container = ({ children, className = ''  }) => {
    return (
        <div className={`md:w-full  sm:w-full mx-auto flex flex-wrap md:gap-x-4 gap-x-3 gap-y-4 items-center justify-center bg-gray-200 ${className} py-[70px]  border-red-600 border`}>
            {children}
        </div>
    )
}

export default Container