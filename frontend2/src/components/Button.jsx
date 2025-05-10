import { useState, useEffect } from "react";

export default function FButton({ 
  children, 
  category, 
  discount, 
  onClick, 
  disabled = false,
  variant = "default" // default, outline, text
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [activeColor, setActiveColor] = useState("bg-blue-500");
  const [rippleEffect, setRippleEffect] = useState({ active: false, x: 0, y: 0 });

  // Colors for the button
  const colorOptions = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-teal-500",
    "bg-green-500",
    "bg-pink-500",
    "bg-amber-500"
  ];

  // Animation to fade in the button
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Function to cycle through colors
  const handleClick = (e) => {
    if (disabled) return;
    
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRippleEffect({ active: true, x, y });
    
    // Reset ripple after animation
    setTimeout(() => {
      setRippleEffect({ active: false, x: 0, y: 0 });
    }, 700);
    
    // Cycle colors
    const currentIndex = colorOptions.indexOf(activeColor);
    const nextIndex = (currentIndex + 1) % colorOptions.length;
    setActiveColor(colorOptions[nextIndex]);
    
    // Trigger any provided onClick handler
    if (onClick) onClick(e);
    
    // Pulse effect
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
  };

  // Determine style based on variant
  let baseStyle = "relative px-6 py-2 rounded-lg font-medium text-base transition-all duration-300 overflow-hidden group";
  let bgStyle = "bg-white text-black";
  
  if (variant === "outline") {
    bgStyle = "bg-transparent text-black border-2 border-black";
  } else if (variant === "text") {
    bgStyle = "bg-transparent text-black hover:bg-gray-100";
  }
  
  if (disabled) {
    bgStyle = "bg-gray-200 text-gray-400 cursor-not-allowed";
  }

  return (
    <button
      className={`
        ${baseStyle}
        ${bgStyle}
        ${isVisible ? "opacity-100" : "opacity-0"}
        ${isPressed ? "scale-95" : "scale-100"}
        shadow-md
        ${disabled ? "" : "hover:shadow-lg"}
        transition-transform duration-200
      `}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Slower sliding background - already black */}
      {!disabled && (
        <span
          className={`absolute inset-0 bg-black transition-transform duration-1000 ease-in-out origin-left
            ${isHovered ? "scale-x-100" : "scale-x-0"}`}
          style={{ transformOrigin: isHovered ? 'left' : 'right' }}
        />
      )}
      
      {/* Ripple effect overlay */}
      {rippleEffect.active && (
        <span 
          className="absolute rounded-full bg-white opacity-30 animate-ripple"
          style={{
            width: '200px',
            height: '200px',
            top: `${rippleEffect.y - 100}px`,
            left: `${rippleEffect.x - 100}px`,
          }}
        />
      )}

      {/* Button content */}
      <span className={`relative z-10 transition-colors duration-1000 flex items-center justify-center gap-2
        ${isHovered && !disabled ? "text-white" : "text-current"}`}>
        {children}
        
        {/* Optional loading spinner animation */}
        {disabled && (
          <span className="inline-block h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin ml-2"></span>
        )}
      </span>

      {/* Category and discount badge */}
      {category && !disabled && (
        <span className={`absolute top-0 right-0 text-white text-xs px-2 py-1 rounded-bl-lg z-10 ${activeColor.replace('bg', 'bg')}`}>
          {category} {discount && `- ${discount}%`}
          <span className="absolute -bottom-1 -left-1 h-1 w-1 rounded-full bg-white animate-pulse"></span>
        </span>
      )}

      {/* Color accent for hover - CHANGED TO BLACK */}
      {!disabled && (
        <>
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-black"
          />
          {/* Changed from blue/purple gradient to black */}
          <span className="absolute -inset-1 rounded-lg blur-sm bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
        </>
      )}

      {/* Accent dots - CHANGED TO BLACK */}
      {!disabled && (
        <>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-600 opacity-70 z-10" />
          <span className="absolute bottom-0 left-0 h-2 w-2 rounded-full bg-fuchsia-600 opacity-70 z-10" />
        </>
      )}

      {/* Animated particles - CHANGED TO GRAYSCALE */}
      {!disabled && (
        <>
          <span className="absolute top-1/2 left-0 h-1 w-1 rounded-full bg-blue-600 opacity-0 group-hover:opacity-60 group-hover:animate-ping z-10" />
          <span className="absolute top-1/2 right-0 h-1 w-1 rounded-full bg-purple-600 opacity-0 group-hover:opacity-60 group-hover:animate-ping z-10" />
          
          {/* Changed from colored to grayscale particles */}
          <span className="absolute bottom-1/4 right-1/4 h-1 w-1 rounded-full bg-blue-600 opacity-0 group-hover:opacity-60 group-hover:animate-ping delay-300 z-10" />
          <span className="absolute top-1/4 left-1/4 h-1 w-1 rounded-full bg-purple-600 opacity-0 group-hover:opacity-60 group-hover:animate-ping delay-200 z-10" />
        </>
      )}
      
      {/* Edge glow effect */}
      {!disabled && (
        <span className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-lg z-0 transition-all duration-700"></span>
      )}
    </button>
  );
}