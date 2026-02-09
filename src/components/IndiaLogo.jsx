import React from 'react';

const IndiaLogo = () => (
  <div className="logo-india">
    {/* Simplified India outline */}
    <svg className="india-outline" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 30,10 Q 35,8 40,10 L 45,15 Q 50,12 55,15 L 60,20 Q 65,18 68,22 L 70,30 Q 72,35 70,40 L 68,50 Q 70,55 68,60 L 65,70 Q 62,75 58,78 L 50,85 Q 45,88 40,85 L 32,78 Q 28,75 26,70 L 24,60 Q 22,55 24,50 L 26,40 Q 24,35 26,30 Z" />
    </svg>
    
    {/* Ashoka Chakra in center */}
    <div className="ashoka-chakra"></div>
  </div>
);

export default IndiaLogo;
