import Particles from "@tsparticles/react";

export default function ParticlesBackground() {
  return (
    <Particles
      id="particles"
      options={{
        fullScreen: { enable: false },

        background: {
          color: "transparent",
        },

        particles: {
          number: {
            value: 50,
          },

          color: {
            value: "#22d3ee",
          },

          links: {
            enable: true,
            color: "#22d3ee",
            distance: 150,
            opacity: 0.2,
          },

          move: {
            enable: true,
            speed: 1,
          },

          opacity: {
            value: 0.4,
          },

          size: {
            value: 2,
          },
        },
      }}
      className="absolute inset-0"
    />
  );
}