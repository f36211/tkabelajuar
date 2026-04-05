import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Text, Edges, Billboard } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Geometry Visualizer
 * Supports: orbit controls, dynamic scaling, labels
 */
export default function GeoVisual3D({ type, data = {}, width = 320, height = 240 }) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  const colors = {
    bg: isDark ? '#1e293b' : '#f8fafc',
    surface: isDark ? '#334155' : '#dbeafe',
    accent: '#3b82f6',
    edges: isDark ? '#94a3b8' : '#64748b',
    text: isDark ? '#e2e8f0' : '#1e293b',
  };

  const style = {
    width: '100%',
    maxWidth: width,
    height: height,
    borderRadius: 12,
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    background: colors.bg,
    cursor: 'move',
    overflow: 'hidden',
    position: 'relative',
  };

  const reminderStyle = {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    background: 'rgba(0, 0, 0, 0.4)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '16px',
    fontSize: '0.65rem',
    pointerEvents: 'none',
    zIndex: 10,
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <div style={style}>
      <Canvas camera={{ position: [20, 20, 20], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={0.8} />
          
          <Center>
            {type === 'prism' && <PrismMesh data={data} colors={colors} />}
          </Center>
          
          <OrbitControls makeDefault enableZoom={true} enablePan={true} />
        </Suspense>
      </Canvas>
      <div style={reminderStyle}>
        <span>🔄 Putar & Zoom 3D</span>
      </div>
    </div>
  );
}

function PrismMesh({ data, colors }) {
  const { a = 6, b = 8, h = 15 } = data;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Create right-angled triangle shape
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);         // Right angle at origin
    s.lineTo(b, 0);         // Bottom leg
    s.lineTo(0, a);         // Vertical leg
    s.lineTo(0, 0);         // Back to start (hypotenuse)
    return s;
  }, [a, b]);

  const extrudeSettings = {
    depth: h,
    bevelEnabled: false,
  };

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhysicalMaterial 
           color={colors.surface} 
           transparent 
           opacity={isDark ? 0.8 : 0.9}
           roughness={0.2}
           metalness={0.1}
           side={THREE.DoubleSide}
        />
        <Edges scale={1.001} threshold={1} color={colors.edges} />
      </mesh>

      {/* Label b (alas/bottom leg) */}
      <Billboard position={[b / 2, -2, extrudeSettings.depth / 2]}>
        <Text fontSize={a * 0.15} color={colors.text} outlineWidth={0.05} outlineColor={colors.bg}>
          {b} cm
        </Text>
      </Billboard>

      {/* Label a (tinggi alas/vertical leg) */}
      <Billboard position={[-2, a / 2, extrudeSettings.depth / 2]}>
        <Text fontSize={a * 0.15} color={colors.text} outlineWidth={0.05} outlineColor={colors.bg}>
          {a} cm
        </Text>
      </Billboard>

      {/* Label h (tinggi prisma) */}
      <Billboard position={[-2, -2, h / 2]}>
        <Text fontSize={a * 0.15} color={colors.text} outlineWidth={0.05} outlineColor={colors.bg}>
          t = {h} cm
        </Text>
      </Billboard>
    </group>
  );
}
