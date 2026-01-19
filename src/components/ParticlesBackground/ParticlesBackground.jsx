"use client";

import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Particles
        id="hexagon-particles"
        init={particlesInit}
        options={{
          background: {
            color: "transparent", // ✅ corrected
          },
          fullScreen: { enable: false },
          particles: {
            number: {
              value: 12,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: ["#999aa5", "#cc5b61"], // soft gray + muted red
            },
            shape: {
              type: "polygon",
              options: {
                polygon: {
                  sides: 6,
                },
              },
            },
            opacity: {
              value: 0.7,
            },
            size: {
              value: { min: 80, max: 160 },
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              outModes: {
                default: "out",
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default ParticlesBackground;
