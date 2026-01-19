import React from "react";

const WaveLoader = () => {
  const bars = Array.from({ length: 30 });

  return (
    <div className="wave-container">
      {bars.map((_, index) => (
        <div
          key={index}
          className="bar-wave"
          style={{ animationDelay: `${index * 0.05}s` }}
        ></div>
      ))}
    </div>
  );
};

export default WaveLoader;
