import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Bvh, OrbitControls, ContactShadows } from "@react-three/drei"
import { EffectComposer, N8AO, TiltShift2, ToneMapping, Bloom, Vignette } from "@react-three/postprocessing"
import { Scene } from "./Scene"

export const App = () => {
  // State for Majlis Configuration
  const [config, setConfig] = useState({
    width: 2.5,
    depth: 2.5,
    mainColor: "#008080", // Teal/Turquoise default
    patternColor: "#111111", // Black patterns
    accentColor: "#d4af37" // Gold
  });

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* HTML Overlay Controls */}
      <div className="controls">
        <h3>Majlis Configurator</h3>
        
        <div className="control-group">
          <label>Room Width: <span className="value-display">{config.width}m</span></label>
          <input 
            type="range" min="2" max="5" step="0.1" 
            value={config.width} 
            onChange={(e) => handleChange('width', parseFloat(e.target.value))} 
          />
        </div>

        <div className="control-group">
          <label>Room Depth: <span className="value-display">{config.depth}m</span></label>
          <input 
            type="range" min="2" max="5" step="0.1" 
            value={config.depth} 
            onChange={(e) => handleChange('depth', parseFloat(e.target.value))} 
          />
        </div>

        <div className="control-group">
          <label>Fabric Color</label>
          <input 
            type="color" 
            value={config.mainColor} 
            onChange={(e) => handleChange('mainColor', e.target.value)} 
          />
        </div>

        <div className="control-group">
          <label>Pattern Color</label>
          <input 
            type="color" 
            value={config.patternColor} 
            onChange={(e) => handleChange('patternColor', e.target.value)} 
          />
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: false }} camera={{ position: [6, 4, 6], fov: 45, near: 0.1, far: 30 }}>
        <color attach="background" args={['#fdfcf5']} />
        
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 8, 5]} angle={0.5} penumbra={1} intensity={1} castShadow />
        <spotLight position={[-5, 5, -5]} angle={0.5} penumbra={1} intensity={0.5} color="#ffdcb4" />
        <Environment preset="city" />

        <Bvh firstHitOnly>
          <group position={[0, -0.5, 0]}>
            <Scene config={config} />
            <ContactShadows resolution={1024} scale={30} blur={2} opacity={0.5} far={10} color="#1a0a0a" />
          </group>
        </Bvh>

        <OrbitControls 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.1} 
          maxDistance={15}
          minDistance={2}
          target={[0, 0.5, 0]}
          enableDamping={true}
        />

        <Effects />
      </Canvas>
    </>
  )
}

function Effects() {
  return (
    <EffectComposer disableNormalPass autoClear={false} multisampling={4}>
      <N8AO halfRes aoSamples={5} aoRadius={0.3} distanceFalloff={0.5} intensity={1.5} />
      <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.3} radius={0.5} />
      <TiltShift2 samples={5} blur={0.05} />
      <ToneMapping />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  )
}