import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { Text, RoundedBox, Cylinder, Float, Box } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";

/*
  Yemeni Arabic Majlis
  Palette: Deep Reds, Blacks, Whites, Turquoise/Teal accents
*/

const PALETTE = {
  fabricRed: "#8a0303",     // Deep Yemeni Red
  fabricTeal: "#008080",    // Turquoise accent from image
  fabricBlack: "#111111",
  fabricWhite: "#eeeeee",
  fabricGold: "#d4af37",
  floor: "#e8e0d5"
};

export function Scene(props) {
  const [hovered, hover] = useState(null);
  
  // Debounce hover to prevent flickering
  const debouncedHover = useCallback(debounce(hover, 30), []);
  const over = (name) => (e) => (e.stopPropagation(), debouncedHover(name));
  
  // Simple interaction state
  const [clicked, setClicked] = useState(null);
  const handleClick = (name) => () => setClicked(name === clicked ? null : name);

  return (
    <group {...props}>
      {/* --- Room Environment --- */}
      {/* Floor - Marble/Tile look */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={PALETTE.floor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* --- U-Shaped Seating Layout --- */}
      
      {/* BACK WALL SEATING */}
      <group position={[0, 0, -2]}>
        <YemeniSection 
          name="CENTER_1" position={[-1.6, 0, 0]} 
          hovered={hovered} over={over} onOut={() => debouncedHover(null)}
        />
        <YemeniSection 
          name="CENTER_2" position={[0, 0, 0]} 
          hovered={hovered} over={over} onOut={() => debouncedHover(null)}
        />
        <YemeniSection 
          name="CENTER_3" position={[1.6, 0, 0]} 
          hovered={hovered} over={over} onOut={() => debouncedHover(null)}
        />
      </group>

      {/* LEFT WALL SEATING */}
      <group position={[-2.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <YemeniSection 
          name="LEFT_1" position={[-0.5, 0, 0]} 
          hovered={hovered} over={over} onOut={() => debouncedHover(null)}
        />
        <YemeniSection 
          name="LEFT_2" position={[1.1, 0, 0]} 
          hovered={hovered} over={over} onOut={() => debouncedHover(null)}
        />
      </group>

      {/* RIGHT WALL SEATING */}
      <group position={[2.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <YemeniSection 
          name="RIGHT_1" position={[-0.5, 0, 0]} 
          hovered={hovered} over={over} onOut={() => debouncedHover(null)}
        />
        <YemeniSection 
          name="RIGHT_2" position={[1.1, 0, 0]} 
          hovered={hovered} over={over} onOut={() => debouncedHover(null)}
        />
      </group>

      {/* CORNER PIECES (Boxy) */}
      <CornerBlock position={[-2.5, 0, -2]} />
      <CornerBlock position={[2.5, 0, -2]} />

      {/* --- Central Decor --- */}
      
      {/* Large Carpet */}
      <Select enabled={hovered === "CARPET"}>
        <group position={[0, 0.01, 0.5]} onPointerOver={over("CARPET")} onPointerOut={() => debouncedHover(null)}>
          <mesh rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[3.5, 2.5]} />
            <meshStandardMaterial color={PALETTE.fabricTeal} roughness={0.9} />
          </mesh>
          {/* Inner pattern */}
          <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.001, 0]}>
            <planeGeometry args={[3.2, 2.2]} />
            <meshStandardMaterial color={PALETTE.fabricRed} roughness={0.9} />
          </mesh>
          {/* Center design */}
          <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.002, 0]}>
            <circleGeometry args={[0.5, 32]} />
            <meshStandardMaterial color={PALETTE.fabricGold} roughness={0.8} />
          </mesh>
        </group>
      </Select>

      {/* Low Tables */}
      <LowTable position={[0, 0, 0.5]} />
      <LowTable position={[-1.2, 0, 0.5]} />
      <LowTable position={[1.2, 0, 0.5]} />

      {/* Floating Text */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.2} floatingRange={[0, 0.2]}>
        <Text 
          position={[0, 2.2, -2]} 
          color={PALETTE.fabricBlack} 
          fontSize={0.25} 
          font="Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
        >
          YEMENI MAJLIS
        </Text>
      </Float>
    </group>
  );
}

// --- Components ---

/* A Single Seating Section: Mattress + Backrest + Armrest/Divider */
function YemeniSection({ name, position, hovered, over, onOut }) {
  const isHovered = hovered === name;
  const width = 1.6;
  const depth = 0.8;
  const height = 0.25; // Low seating

  return (
    <Select enabled={isHovered}>
      <group position={position} onPointerOver={over(name)} onPointerOut={onOut}>
        
        {/* 1. Floor Mattress (Mafranj) */}
        <RoundedBox args={[width - 0.1, height, depth]} radius={0.02} smoothness={4} position={[0, height/2, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={PALETTE.fabricTeal} roughness={0.8} />
        </RoundedBox>
        
        {/* Pattern Strip on Mattress (Front face) */}
        <mesh position={[0, height/2, depth/2 + 0.001]}>
          <planeGeometry args={[width - 0.1, height * 0.6]} />
          <meshStandardMaterial color={PALETTE.fabricWhite} />
        </mesh>
        <mesh position={[0, height/2, depth/2 + 0.002]}>
          <planeGeometry args={[width - 0.1, height * 0.2]} />
          <meshStandardMaterial color={PALETTE.fabricBlack} />
        </mesh>

        {/* 2. Backrest (Mada'a) */}
        <RoundedBox args={[width - 0.1, 0.45, 0.25]} radius={0.05} smoothness={4} position={[0, height + 0.225, -depth/2 + 0.125]} castShadow>
          <meshStandardMaterial color={PALETTE.fabricTeal} roughness={0.8} />
        </RoundedBox>
        
        {/* Pattern on Backrest */}
        <mesh position={[0, height + 0.225, -depth/2 + 0.251]}>
          <planeGeometry args={[width - 0.2, 0.3]} />
          <meshStandardMaterial color={PALETTE.fabricWhite} />
        </mesh>
        <mesh position={[0, height + 0.225, -depth/2 + 0.252]}>
          <planeGeometry args={[width - 0.2, 0.1]} />
          <meshStandardMaterial color={PALETTE.fabricRed} />
        </mesh>
        {/* Diamond Shape in center of backrest */}
        <mesh position={[0, height + 0.225, -depth/2 + 0.253]} rotation={[0,0,Math.PI/4]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshStandardMaterial color={PALETTE.fabricBlack} />
        </mesh>

        {/* 3. The Divider / Armrest (Tall Boxy Cushion) */}
        <RoundedBox args={[0.25, 0.5, depth]} radius={0.02} smoothness={4} position={[width/2, 0.25, 0]} castShadow>
           <meshStandardMaterial color={PALETTE.fabricTeal} roughness={0.8} />
        </RoundedBox>
        {/* Pattern on Armrest */}
        <mesh position={[width/2, 0.25, depth/2 + 0.001]}>
           <planeGeometry args={[0.2, 0.4]} />
           <meshStandardMaterial color={PALETTE.fabricWhite} />
        </mesh>
        <mesh position={[width/2, 0.25, depth/2 + 0.002]}>
           <planeGeometry args={[0.1, 0.3]} />
           <meshStandardMaterial color={PALETTE.fabricBlack} />
        </mesh>

      </group>
    </Select>
  );
}

function CornerBlock({ position }) {
  return (
    <group position={position}>
      <Box args={[0.8, 0.7, 0.8]} position={[0, 0.35, 0]} castShadow>
        <meshStandardMaterial color={PALETTE.fabricTeal} roughness={0.8} />
      </Box>
      {/* Decorative top pattern */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.701, 0]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial color={PALETTE.fabricWhite} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.702, 0]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshStandardMaterial color={PALETTE.fabricBlack} />
      </mesh>
    </group>
  )
}

function LowTable({ position }) {
  return (
    <group position={position}>
      {/* Table Body */}
      <Box args={[0.7, 0.25, 0.7]} position={[0, 0.125, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3d2817" roughness={0.2} />
      </Box>
      {/* Glass Top */}
      <Box args={[0.7, 0.02, 0.7]} position={[0, 0.26, 0]}>
        <meshPhysicalMaterial 
          color="#88ccff" 
          transmission={0.5} 
          opacity={0.5} 
          metalness={0} 
          roughness={0} 
          thickness={0.1}
          transparent
        />
      </Box>
      {/* Gold Edges */}
      <Box args={[0.72, 0.05, 0.72]} position={[0, 0.24, 0]}>
        <meshStandardMaterial color={PALETTE.fabricGold} metalness={0.8} roughness={0.2} />
      </Box>
    </group>
  )
}