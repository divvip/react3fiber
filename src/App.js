import { Canvas } from "@react-three/fiber"
import { Environment, Bvh, OrbitControls, ContactShadows } from "@react-three/drei"
import { EffectComposer, N8AO, TiltShift2, ToneMapping, Bloom, Vignette } from "@react-three/postprocessing"
import { Scene } from "./Scene"

export const App = () => (
  <Canvas shadows dpr={[1, 2]} gl={{ antialias: false }} camera={{ position: [5, 3, 5], fov: 45, near: 0.1, far: 20 }}>
    <color attach="background" args={['#fdfcf5']} />
    
    {/* Lighting environment */}
    <ambientLight intensity={0.6} />
    <spotLight position={[5, 8, 5]} angle={0.5} penumbra={1} intensity={1.5} castShadow />
    <spotLight position={[-5, 8, -5]} angle={0.5} penumbra={1} intensity={0.5} color="#ffdcb4" />
    <Environment preset="city" />

    <Bvh firstHitOnly>
      <group position={[0, -0.5, 0]}>
        <Scene />
        {/* Soft realistic shadows underneath the furniture */}
        <ContactShadows resolution={1024} scale={30} blur={2} opacity={0.6} far={10} color="#1a0a0a" />
      </group>
    </Bvh>

    {/* Controls to move around the room - targeting floor level */}
    <OrbitControls 
      minPolarAngle={0} 
      maxPolarAngle={Math.PI / 2.1} 
      maxDistance={12}
      minDistance={2}
      target={[0, 0.2, 0]}
      enableDamping={true}
    />

    <Effects />
  </Canvas>
)

function Effects() {
  return (
    <EffectComposer disableNormalPass autoClear={false} multisampling={4}>
      <N8AO halfRes aoSamples={5} aoRadius={0.3} distanceFalloff={0.5} intensity={1.5} />
      <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.3} radius={0.5} />
      <TiltShift2 samples={5} blur={0.05} />
      <ToneMapping />
      <Vignette eskil={false} offset={0.1} darkness={0.6} />
    </EffectComposer>
  )
}