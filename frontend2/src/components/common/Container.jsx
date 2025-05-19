import React, { Children } from 'react'

const Container = ({ children, className = ''  }) => {
    return (
        <div className={`md:w-full  sm:w-full mx-auto h-screen flex flex-wrap md:gap-x-4 gap-x-3 gap-y-4 items-center justify-center  ${className} `}>
            {children}
        </div>
    )
}

export default Container