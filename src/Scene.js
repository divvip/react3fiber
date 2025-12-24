import { useState, useMemo } from "react";
import * as THREE from 'three';
import { RoundedBox, Cylinder, Box, Float, Text, MeshReflectorMaterial, useTexture } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";

export function Scene({ config }) {
  const { 
    width, depth, 
    mattressPattern, backrestPattern, armrestPattern,
    mattressColor, backrestColor, armrestColor, embroideryColor, floorColor 
  } = config;
  
  const [hovered, setHover] = useState(null);

  const sideOffset = width / 2;
  const backOffset = depth / 2;

  const commonProps = {
    hovered, setHover,
    colors: { mattress: mattressColor, backrest: backrestColor, armrest: armrestColor, embroidery: embroideryColor },
    patterns: { mattress: mattressPattern, backrest: backrestPattern, armrest: armrestPattern }
  };

  return (
    <group>
      {/* --- Luxurious Marble Floor --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={0.1}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={floorColor}
          metalness={0.2}
          mirror={0.7}
        />
      </mesh>

      {/* --- Wall Decor (Marble Panels) --- */}
      <group position={[0, 2, -backOffset - 0.5]}>
         <Box args={[width + 2, 4, 0.2]}>
            <meshPhysicalMaterial color="#222" roughness={0.5} metalness={0.5} />
         </Box>
         {/* Gold strips on wall */}
         <Box args={[width + 2, 0.05, 0.22]} position={[0, 1, 0]}>
            <meshStandardMaterial color={embroideryColor} metalness={1} roughness={0.1} />
         </Box>
         <Box args={[width + 2, 0.05, 0.22]} position={[0, -1, 0]}>
            <meshStandardMaterial color={embroideryColor} metalness={1} roughness={0.1} />
         </Box>
      </group>

      {/* --- U-Shape Majlis --- */}
      <MajlisSection {...commonProps} position={[0, 0, -backOffset]} rotation={[0, 0, 0]} length={width} name="BACK" />
      <MajlisSection {...commonProps} position={[-sideOffset, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={depth - 0.9} name="LEFT" />
      <MajlisSection {...commonProps} position={[sideOffset, 0, 0]} rotation={[0, -Math.PI / 2, 0]} length={depth - 0.9} name="RIGHT" />

      {/* Corner Towers */}
      <MadaaCorner position={[-sideOffset, 0, -backOffset]} color={armrestColor} patternColor={embroideryColor} />
      <MadaaCorner position={[sideOffset, 0, -backOffset]} color={armrestColor} patternColor={embroideryColor} />

      {/* --- Center Pieces --- */}
      <ModernTable position={[0, 0, 0]} color={backrestColor} accent={embroideryColor} />
      
      {/* Rug */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[width - 1.5, depth - 1.5]} />
        <meshPhysicalMaterial color={mattressColor} roughness={1} sheen={0.5} />
      </mesh>

      {/* --- Floating Modern TV Unit --- */}
      <TVWallUnit 
        position={[0, 1.5, backOffset + 2]} 
        rotation={[0, Math.PI, 0]} 
        woodColor={armrestColor}
        accentColor={embroideryColor}
      />

    </group>
  );
}

// --- Furniture Logic ---

function MajlisSection({ position, rotation, length, colors, patterns, hovered, setHover, name }) {
  const cushionWidth = 0.95;
  const count = Math.floor(length / cushionWidth);
  
  return (
    <group position={position} rotation={rotation}>
      <Select enabled={hovered === name}>
        <group onPointerOver={(e) => (e.stopPropagation(), setHover(name))} onPointerOut={() => setHover(null)}>
          
          {/* 1. Base Platform (Marble/Wood) */}
          <Box args={[length, 0.2, 0.85]} position={[0, 0.1, 0]} castShadow>
             <meshStandardMaterial color="#1a1a1a" roughness={0.1} />
          </Box>
          <Box args={[length, 0.02, 0.86]} position={[0, 0.2, 0]}>
             <meshStandardMaterial color={colors.embroidery} metalness={1} roughness={0.1} />
          </Box>

          {/* 2. Mattress (Velvet) */}
          <group position={[0, 0.35, 0]}>
            <RoundedBox args={[length, 0.3, 0.85]} radius={0.05} smoothness={8} castShadow receiveShadow>
              <FabricMaterial color={colors.mattress} />
            </RoundedBox>
            {/* Front Embroidery */}
            <EmbroideryStrip 
              type={patterns.mattress} length={length} width={0.25}
              position={[0, 0, 0.43]} rotation={[Math.PI/2, 0, 0]} 
              color={colors.embroidery} 
            />
          </group>

          {/* 3. Backrest */}
          <group position={[0, 0.75, -0.3]}>
            <RoundedBox args={[length, 0.5, 0.2]} radius={0.05} smoothness={8} castShadow>
              <FabricMaterial color={colors.backrest} />
            </RoundedBox>
            <EmbroideryStrip 
              type={patterns.backrest} length={length - 0.2} width={0.3}
              position={[0, 0, 0.11]} rotation={[0, 0, 0]} 
              color={colors.embroidery} scale={0.9}
            />
          </group>

          {/* 4. Armrests & Pillows */}
          {Array.from({ length: count + 1 }).map((_, i) => {
            const xPos = -length/2 + (i * (length / count));
            if (i === count && xPos > length/2 - 0.1) return null;

            return (
              <group key={i} position={[xPos, 0.5, 0]}>
                {/* Armrest (Mada'a) */}
                <RoundedBox args={[0.15, 0.4, 0.85]} radius={0.03} smoothness={4} castShadow>
                   <FabricMaterial color={colors.armrest} />
                </RoundedBox>
                {/* Top decorative plate */}
                <Box args={[0.16, 0.02, 0.86]} position={[0, 0.21, 0]}>
                   <meshStandardMaterial color={colors.embroidery} metalness={1} roughness={0.1} />
                </Box>
                
                {/* Armrest Pattern Side */}
                <EmbroideryStrip 
                  type={patterns.armrest} length={0.7} width={0.15}
                  position={[0.08, 0, 0]} rotation={[0, Math.PI/2, 0]}
                  color={colors.embroidery} scale={0.6}
                />

                {/* Modern Scatter Pillow */}
                {i < count && (
                  <group position={[0.45, 0.1, 0.1]} rotation={[-0.1, 0, 0]}>
                    <RoundedBox args={[0.45, 0.45, 0.12]} radius={0.08} smoothness={8} castShadow>
                      <FabricMaterial color={i % 2 === 0 ? colors.backrest : colors.armrest} />
                    </RoundedBox>
                    {/* Metallic Button */}
                    <mesh position={[0, 0, 0.055]} scale={[1,1,0.5]}>
                       <sphereGeometry args={[0.04, 16, 16]} />
                       <meshStandardMaterial color={colors.embroidery} metalness={1} />
                    </mesh>
                  </group>
                )}
              </group>
            )
          })}
        </group>
      </Select>
    </group>
  );
}

// --- Specialized Components ---

// Reusable Velvet-like material
function FabricMaterial({ color }) {
  return (
    <meshPhysicalMaterial 
      color={color} 
      roughness={0.7} 
      metalness={0.1}
      sheen={1.0}
      sheenRoughness={0.5}
      sheenColor="white"
      clearcoat={0}
    />
  );
}

function MadaaCorner({ position, color, patternColor }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.9, 0.7, 0.9]} radius={0.02} smoothness={4} position={[0, 0.35, 0]} castShadow>
        <FabricMaterial color={color} />
      </RoundedBox>
      <Box args={[0.92, 0.02, 0.92]} position={[0, 0.71, 0]}>
         <meshStandardMaterial color={patternColor} metalness={1} roughness={0.2} />
      </Box>
      {/* Decorative Lamp on top */}
      <group position={[0, 0.72, 0]}>
         <Cylinder args={[0.1, 0.15, 0.1, 8]} position={[0, 0.05, 0]}>
            <meshStandardMaterial color="#111" />
         </Cylinder>
         <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshPhysicalMaterial color="white" transmission={0.9} roughness={0.1} thickness={0.1} />
         </mesh>
         <pointLight intensity={0.5} color="#ffaa00" distance={2} position={[0, 0.3, 0]} />
      </group>
    </group>
  )
}

function ModernTable({ position, color, accent }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.4, 0.05, 1.0]} radius={0.02} position={[0, 0.35, 0]} castShadow>
        <meshPhysicalMaterial color="black" roughness={0.1} metalness={0.1} clearcoat={1} />
      </RoundedBox>
      {/* Gold Frame */}
      <Box args={[1.42, 0.02, 1.02]} position={[0, 0.35, 0]}>
         <meshStandardMaterial color={accent} metalness={1} roughness={0.1} />
      </Box>
      {/* Legs */}
      <group position={[0, 0.175, 0]}>
         <Box args={[1.2, 0.35, 0.8]}><meshStandardMaterial color={color} /></Box>
      </group>
    </group>
  )
}

function TVWallUnit({ position, rotation, woodColor, accentColor }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Floating Console */}
      <RoundedBox args={[2.8, 0.4, 0.5]} radius={0.02} position={[0, -0.5, 0]} castShadow>
         <meshStandardMaterial color={woodColor} roughness={0.2} />
      </RoundedBox>
      {/* Gold Inlay */}
      <Box args={[2.82, 0.05, 0.52]} position={[0, -0.6, 0]}>
         <meshStandardMaterial color={accentColor} metalness={1} roughness={0.2} />
      </Box>
      
      {/* Wall Panel */}
      <Box args={[3.0, 2.5, 0.1]} position={[0, 1, -0.3]}>
         <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </Box>

      {/* TV Screen */}
      <group position={[0, 1.0, 0]}>
        <RoundedBox args={[2.2, 1.25, 0.05]} radius={0.01} castShadow>
          <meshStandardMaterial color="#050505" roughness={0.2} metalness={0.8} />
        </RoundedBox>
        {/* Glow of screen */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[2.15, 1.2]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      </group>
    </group>
  )
}

// --- High Fidelity Pattern Generator ---
function EmbroideryStrip({ type, length, width, position, rotation, color, scale = 1 }) {
  if (type === "None") return null;

  const segmentSize = 0.3;
  const repeats = Math.max(1, Math.floor(length / segmentSize));
  
  const Geom = ({ index }) => {
    const x = -(length - 0.1)/2 + (segmentSize/2) + (index * ((length - 0.1) / repeats));
    const mat = <meshStandardMaterial color={color} metalness={0.8} roughness={0.4} />;
    
    return (
      <group position={[x, 0, 0.005]}>
        
        {type === "Sadu" && (
          <group>
            {/* Central Diamond */}
            <mesh rotation={[0, 0, Math.PI/4]}>
              <boxGeometry args={[0.15, 0.15, 0.01]} />
              {mat}
            </mesh>
            {/* Side Triangles */}
            <mesh position={[-0.12, 0, 0]} rotation={[0,0,-Math.PI/2]}>
               <coneGeometry args={[0.06, 0.08, 4]} />
               {mat}
            </mesh>
            <mesh position={[0.12, 0, 0]} rotation={[0,0,Math.PI/2]}>
               <coneGeometry args={[0.06, 0.08, 4]} />
               {mat}
            </mesh>
          </group>
        )}

        {type === "Royal" && (
          <group>
            {/* Islamic 8-point star simulation */}
            <mesh rotation={[0, 0, Math.PI/4]}>
              <boxGeometry args={[0.12, 0.12, 0.01]} />
              {mat}
            </mesh>
            <mesh>
              <boxGeometry args={[0.12, 0.12, 0.01]} />
              {mat}
            </mesh>
            <mesh position={[0,0,0.005]}>
               <cylinderGeometry args={[0.04, 0.04, 0.02, 8]} rotation={[Math.PI/2,0,0]} />
               {mat}
            </mesh>
          </group>
        )}

        {type === "Greek" && (
          <group>
             {/* Greek Key simplified */}
             <mesh position={[-0.08, 0.05, 0]}><boxGeometry args={[0.02, 0.1, 0.01]} />{mat}</mesh>
             <mesh position={[0, 0.09, 0]}><boxGeometry args={[0.18, 0.02, 0.01]} />{mat}</mesh>
             <mesh position={[0.08, 0, 0]}><boxGeometry args={[0.02, 0.2, 0.01]} />{mat}</mesh>
             <mesh position={[0, -0.09, 0]}><boxGeometry args={[0.18, 0.02, 0.01]} />{mat}</mesh>
             <mesh position={[-0.08, -0.05, 0]}><boxGeometry args={[0.02, 0.1, 0.01]} />{mat}</mesh>
          </group>
        )}

        {type === "Floral" && (
          <group>
             <mesh position={[0,0,0]} rotation={[0,0,Math.PI/4]}>
                <torusGeometry args={[0.06, 0.01, 8, 20]} />
                {mat}
             </mesh>
             <mesh position={[0.08, 0.05, 0]}><sphereGeometry args={[0.02]} />{mat}</mesh>
             <mesh position={[-0.08, -0.05, 0]}><sphereGeometry args={[0.02]} />{mat}</mesh>
          </group>
        )}

        {type === "Minimal" && (
          <group>
             <mesh position={[0, 0.04, 0]}><boxGeometry args={[0.28, 0.02, 0.01]} />{mat}</mesh>
             <mesh position={[0, -0.04, 0]}><boxGeometry args={[0.28, 0.02, 0.01]} />{mat}</mesh>
          </group>
        )}

      </group>
    )
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Background fabric strip for embroidery */}
      <mesh>
        <planeGeometry args={[length - 0.05, width]} />
        <meshStandardMaterial color="#000" transparent opacity={0.2} />
      </mesh>
      
      {Array.from({ length: repeats }).map((_, i) => <Geom key={i} index={i} />)}
      
      {/* Top/Bottom Piping for Strip */}
      <mesh position={[0, width/2, 0.005]}><boxGeometry args={[length, 0.005, 0.005]} />{<meshStandardMaterial color="white" />}</mesh>
      <mesh position={[0, -width/2, 0.005]}><boxGeometry args={[length, 0.005, 0.005]} />{<meshStandardMaterial color="white" />}</mesh>
    </group>
  )
}