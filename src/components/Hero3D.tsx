import { useRef, useEffect, useState } from 'react';

// Floating Biscuit Component (CSS-based 3D effect)
function FloatingBiscuit({ position, onClick, delay = 0 }: { 
  position: { x: number, y: number }, 
  onClick?: () => void,
  delay?: number 
}) {
  const biscuitRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    const start = async () => {
      if (!biscuitRef.current) return;
      const { gsap } = await import('gsap');
      // Floating animation
      gsap.to(biscuitRef.current, {
        y: -20,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay
      });
      // Rotation animation
      gsap.to(biscuitRef.current, {
        rotation: 360,
        duration: 40, // match big logo speed
        repeat: -1,
        ease: 'none',
        delay: delay * 0.5
      });
    };
    (window as any).requestIdleCallback ? (window as any).requestIdleCallback(start) : setTimeout(start, 0);
  }, [delay]);

  const handleClick = async () => {
    if (biscuitRef.current && onClick) {
      const { gsap } = await import('gsap');
      gsap.to(biscuitRef.current, {
        scale: 1.3,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "bounce.out"
      });
      onClick();
    }
  };

  return (
    <div
      ref={biscuitRef}
      className="absolute cursor-pointer transform-gpu"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src="/images/logo.png"
        alt="Mini Cookie"
        className="w-12 h-12 md:w-14 md:h-14 object-contain select-none"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

// Candy Cloud Component
function CandyCloud({ position, delay = 0 }: { 
  position: { x: number, y: number },
  delay?: number 
}) {
  const cloudRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const start = async () => {
      if (!cloudRef.current) return;
      const { gsap } = await import('gsap');
      gsap.to(cloudRef.current, {
        x: 30,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay
      });
      gsap.to(cloudRef.current, {
        y: -15,
        duration: 1.5 + Math.random() * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay * 0.7
      });
    };
    (window as any).requestIdleCallback ? (window as any).requestIdleCallback(start) : setTimeout(start, 0);
  }, [delay]);

  return (
    <div
      ref={cloudRef}
      className="absolute transform-gpu"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      <div className="relative">
        <div className="w-20 h-12 md:w-24 md:h-14 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-80 shadow-lg"></div>
        <div className="absolute -top-2 left-4 w-12 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-70"></div>
        <div className="absolute -top-1 right-2 w-8 h-6 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-70"></div>
      </div>
    </div>
  );
}

// Star Component
function Star({ position, delay = 0 }: { 
  position: { x: number, y: number },
  delay?: number 
}) {
  const starRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const start = async () => {
      if (!starRef.current) return;
      const { gsap } = await import('gsap');
      gsap.to(starRef.current, {
        rotation: 360,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        ease: 'none',
        delay: delay
      });
      gsap.to(starRef.current, {
        scale: 1.2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay * 0.5
      });
    };
    (window as any).requestIdleCallback ? (window as any).requestIdleCallback(start) : setTimeout(start, 0);
  }, [delay]);

  return (
    <div
      ref={starRef}
      className="absolute transform-gpu"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      <div className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 flex items-center justify-center">
        ⭐
      </div>
    </div>
  );
}

// Camera Controller (simulated with CSS transforms)
function CameraController({ scrollY }: { scrollY: number }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const run = async () => {
      if (!sceneRef.current) return;
      const { gsap } = await import('gsap');
      const parallaxX = Math.sin(scrollY * 0.001) * 20;
      const parallaxY = scrollY * 0.1;
      gsap.to(sceneRef.current, {
        x: parallaxX,
        y: -parallaxY,
        duration: 1,
        ease: "power2.out"
      });
    };
    run();
  }, [scrollY]);
  
  return <div ref={sceneRef} className="absolute inset-0 transform-gpu" />;
}

export default function Hero3D() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mark mounted to enable non-critical visual effects after first paint
  useEffect(() => {
    setMounted(true);
  }, []);

  // Rotate main logo slowly
  useEffect(() => {
    const start = async () => {
      if (!logoRef.current) return;
      const { gsap } = await import('gsap');
      gsap.to(logoRef.current, {
        rotation: 360,
        duration: 40,
        ease: 'none',
        repeat: -1,
      });
    };
    (window as any).requestIdleCallback ? (window as any).requestIdleCallback(start) : setTimeout(start, 0);
  }, []);

  // Generate random positions for floating elements
  const biscuitPositions = [
    { x: 10, y: 20 },
    { x: 80, y: 15 },
    { x: 15, y: 60 },
    { x: 75, y: 70 },
    { x: 45, y: 25 },
    { x: 25, y: 80 }
  ];

  const cloudPositions = [
    { x: 5, y: 10 },
    { x: 70, y: 12 },
    { x: 30, y: 15 },
    { x: 85, y: 30 }
  ];

  const starPositions = [
    { x: 20, y: 5 },
    { x: 60, y: 8 },
    { x: 40, y: 12 },
    { x: 90, y: 20 },
    { x: 10, y: 35 },
    { x: 95, y: 50 }
  ];

  return (
    <div ref={heroRef} className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/biscuit-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9C56C]/60 via-[#FFD98A]/60 to-[#F6B63C]/60"></div>
      
      {/* Parallax Background Elements */}
      <CameraController scrollY={scrollY} />
      
      {/* Floating Biscuits */}
      {biscuitPositions.map((pos, index) => (
        <FloatingBiscuit
          key={`biscuit-${index}`}
          position={pos}
          delay={index * 0.5}
          onClick={() => console.log(`Biscuit ${index} clicked! ✨`)}
        />
      ))}
      
      {/* Candy Clouds */}
      {cloudPositions.map((pos, index) => (
        <CandyCloud
          key={`cloud-${index}`}
          position={pos}
          delay={index * 0.7}
        />
      ))}
      
      {/* Stars */}
      {starPositions.map((pos, index) => (
        <Star
          key={`star-${index}`}
          position={pos}
          delay={index * 0.3}
        />
      ))}
      
      {/* Ground/Terrain Effect */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-300 to-transparent opacity-60"></div>
      
      {/* Hero Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center px-4 max-w-4xl">
          <div className="mb-6 flex justify-center">
            <div className="relative mb-4 mt-6 md:mt-10 w-48 h-48 md:w-64 md:h-64">
              <img
                ref={logoRef}
                src="/images/logo.png"
                alt="Brand Logo"
                className="w-full h-full object-contain select-none origin-center will-change-transform"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
          
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 ${mounted ? 'drop-shadow-lg' : ''}`}>
            Bite into a World of Joy!
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 drop-shadow">
            Discover magical biscuits that make every moment sweeter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="pointer-events-auto inline-flex items-center gap-3 bg-gradient-to-r from-[#E08A2E] to-[#D07D1F] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:shadow-[0_0_30px_rgba(224,138,46,0.5)] transform hover:scale-105 transition-all duration-300 hover:from-[#D07D1F] hover:to-[#A65A18] focus:outline-none focus:ring-2 focus:ring-[#E08A2E]/50">
              <img src="/images/logo.png" alt="Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain select-none" loading="lazy" decoding="async" />
              <span>Start Adventure</span>
            </button>
            <button className="pointer-events-auto bg-white/80 backdrop-blur-sm text-textPrimary px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:scale-105 transition-all duration-300">
              Watch Story
            </button>
          </div>
        </div>
      </div>
      

      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll for Magic</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-ping"></div>
          </div>
        </div>
      </div>
    </div>
  );
}