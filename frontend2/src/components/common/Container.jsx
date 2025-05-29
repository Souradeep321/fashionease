
const Container = ({ children, className = ''  }) => {
    return (
        <div className={`lg:max-w-[1280px] md:w-full sm:w-full mx-auto h-screen flex flex-wrap md:gap-x-4 gap-x-3 gap-y-4 items-center justify-center ${className} `}>
            {children}
        </div>
    )
}

export default Container