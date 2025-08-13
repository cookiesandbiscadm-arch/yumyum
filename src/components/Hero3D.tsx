import { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Instances } from '@react-three/drei';
import * as THREE from 'three';

// Constants
const BISCUIT_COUNT = 6;
const CLOUD_COUNT = 4;
const STAR_COUNT = 6;

// Types for model props
interface ModelProps {
  position?: { x: number; y: number; z?: number };
  scale?: number;
  rotationSpeed?: number;
  floatSpeed?: number;
  [key: string]: any;
}

// Biscuit Model Component (will be replaced with actual 3D model)
function BiscuitModel({ 
  position = { x: 0, y: 0, z: 0 }, 
  scale = 1, 
  rotationSpeed = 1, 
  floatSpeed = 1, 
  ...props 
}: ModelProps) {
  const ref = useRef<THREE.Mesh>(null);
  const time = useRef(0);
  
  useFrame((_, delta) => {
    if (!ref.current) return;
    
    // Floating animation
    time.current += delta * floatSpeed;
    ref.current.position.y += Math.sin(time.current) * 0.001 * floatSpeed;
    
    // Rotation animation
    ref.current.rotation.y += 0.01 * rotationSpeed;
    ref.current.rotation.x = Math.sin(time.current * 0.5) * 0.1;
  });

  return (
    <mesh 
      ref={ref} 
      position={[position?.x || 0, position?.y || 0, position?.z || 0]} 
      scale={scale} 
      {...props}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#fbbf24" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

// Cloud Model Component
function CloudModel({ position, scale = 1, ...props }: any) {
  const ref = useRef<THREE.Group>(null);
  const time = useRef(0);
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Gentle floating
    time.current += delta * 0.5;
    ref.current.position.x = position.x + Math.sin(time.current * 0.5) * 0.2;
    ref.current.position.y = position.y + Math.sin(time.current * 0.3) * 0.1;
  });

  return (
    <group ref={ref} position={[position.x, position.y, position.z || 0]} scale={scale} {...props}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#fbcfe8" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.6, 0.2, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#e9d5ff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.5, -0.1, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#f0abfc" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Star Model Component
function StarModel({ 
  position = { x: 0, y: 0, z: 0 }, 
  scale = 1, 
  ...props 
}: ModelProps) {
  const ref = useRef<THREE.Mesh>(null);
  const time = useRef(0);
  
  useFrame((_, delta) => {
    if (!ref.current) return;
    
    // Twinkling effect
    time.current += delta * 2;
    const currentScale = 1 + Math.sin(time.current) * 0.2;
    ref.current.scale.set(currentScale, currentScale, currentScale);
    
    // Slow rotation
    ref.current.rotation.z += 0.01;
  });

  return (
    <mesh 
      ref={ref} 
      position={[position?.x || 0, position?.y || 0, position?.z || 0]} 
      scale={scale} 
      {...props}
    >
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1} toneMapped={false} />
    </mesh>
  );
}

// Scene component with all 3D elements
function Scene({ scrollY }: { scrollY: number }) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate positions for all elements
  const biscuitPositions = useMemo(() => 
    Array.from({ length: BISCUIT_COUNT }, () => ({
      x: (Math.random() - 0.5) * viewport.width * 0.8,
      y: (Math.random() - 0.5) * viewport.height * 0.8,
      z: Math.random() * 10 - 5,
      scale: 0.5 + Math.random() * 0.5,
      rotationSpeed: 0.5 + Math.random(),
      floatSpeed: 0.5 + Math.random()
    })), [viewport.width, viewport.height]);

  const cloudPositions = useMemo(() =>
    Array.from({ length: CLOUD_COUNT }, () => ({
      x: (Math.random() - 0.5) * viewport.width * 0.9,
      y: (Math.random() - 0.5) * viewport.height * 0.5 + viewport.height * 0.2,
      z: Math.random() * 5 - 10,
      scale: 0.8 + Math.random() * 0.4
    })), [viewport.width, viewport.height]);

  const starPositions = useMemo(() =>
    Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * viewport.width * 0.9,
      y: (Math.random() - 0.5) * viewport.height * 0.5 + viewport.height * 0.1,
      z: Math.random() * 10 - 5,
      scale: 0.1 + Math.random() * 0.2
    })), [viewport.width, viewport.height]);

  // Parallax effect based on scroll
  useFrame(() => {
    if (groupRef.current) {
      // Subtle parallax effect
      const parallaxX = scrollY * 0.0005 * viewport.width;
      const parallaxY = -scrollY * 0.0002 * viewport.height;
      
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x, 
        parallaxX, 
        0.1
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y, 
        parallaxY, 
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Directional light for shadows */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      
      {/* Biscuits */}
      <Instances limit={BISCUIT_COUNT} range={BISCUIT_COUNT}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.3} metalness={0.1} />
        {biscuitPositions.map((props, i) => (
          <BiscuitModel key={i} {...props} />
        ))}
      </Instances>
      
      {/* Clouds */}
      {cloudPositions.map((pos, i) => (
        <CloudModel key={i} position={pos} scale={pos.scale} />
      ))}
      
      {/* Stars */}
      <Instances limit={STAR_COUNT} range={STAR_COUNT}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1} toneMapped={false} />
        {starPositions.map((props, i) => (
          <StarModel key={i} {...props} />
        ))}
      </Instances>
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -viewport.height * 0.4, -5]}>
        <planeGeometry args={[viewport.width * 1.5, viewport.width * 1.5, 1, 1]} />
        <meshStandardMaterial color="#86efac" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Main component
export default function Hero3D() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Mark as mounted after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div ref={heroRef} className="relative w-full h-screen overflow-hidden">
      {/* Background gradient (kept as CSS for performance) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300" />
      
      {/* 3D Canvas */}
      <Canvas 
        className="absolute inset-0" 
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <Suspense fallback={null}>
          <Scene scrollY={scrollY} />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center px-4 max-w-4xl">
          <div className="mb-6">
            <span className="text-8xl md:text-9xl block mb-4">🍪</span>
          </div>
          
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 ${mounted ? 'drop-shadow-lg' : ''}`}>
            Bite into a World of Joy!
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 drop-shadow">
            Discover magical biscuits that make every moment sweeter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="pointer-events-auto bg-gradient-to-r from-pink-400 to-orange-400 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => console.log('Start Adventure clicked')}
            >
              Start Adventure
            </button>
            <button 
              className="pointer-events-auto bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:scale-105 transition-all duration-300"
              onClick={() => console.log('Watch Story clicked')}
            >
              Watch Story
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce pointer-events-auto">
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