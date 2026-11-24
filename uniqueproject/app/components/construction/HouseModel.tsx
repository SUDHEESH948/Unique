import { memo, useLayoutEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Matrix4, type Group, type InstancedMesh } from "three";

type Vector = [number, number, number];
type Finish = "earth" | "concrete" | "stone" | "steel" | "timber" | "glass" | "grass" | "leaf" | "light";
type Piece = { position: Vector; size: Vector; finish: Finish; shape?: "tree" };

const finishes = {
  earth: { color: "#76634d", roughness: 1 },
  concrete: { color: "#bbb1a1", roughness: 0.91 },
  stone: { color: "#e0d6c6", roughness: 0.74 },
  steel: { color: "#292c2a", roughness: 0.37, metalness: 0.67 },
  timber: { color: "#92603b", roughness: 0.62 },
  glass: { color: "#6e949f", roughness: 0.14, metalness: 0.28, transparent: true, opacity: 0.56, depthWrite: false },
  grass: { color: "#777e54", roughness: 1 },
  leaf: { color: "#455a38", roughness: 0.96 },
  light: { color: "#ffdd9e", emissive: "#ffb34e", emissiveIntensity: 2.2 },
};

function box(finish: Finish, position: Vector, size: Vector): Piece {
  return { finish, position, size };
}

const columnPositions: [number, number][] = [
  [-4.8, -2.8], [0, -2.8], [4.8, -2.8],
  [-4.8, 2.8], [0, 2.8], [4.8, 2.8], [4.8, 0],
];

const wallPanels = [1.54, 4.12].flatMap((y) => [
  box("stone", [0, y, -2.8], [9.5, 2.24, 0.24]),
  box("stone", [-4.8, y, 0], [0.24, 2.24, 5.4]),
  box("concrete", [-1.45, y, -0.6], [0.18, 2.24, 4.15]),
  box("stone", [-3.5, y, 2.8], [2.4, 2.24, 0.25]),
  box("stone", [4.8, y, -1.5], [0.24, 2.24, 2.4]),
]);

function glazing(x: number, y: number, z: number, width: number, side = false) {
  const pane = (finish: Finish, shift: number, height: number, w: number, h: number, depth: number) =>
    box(finish, side ? [x, y + height, z + shift] : [x + shift, y + height, z],
      side ? [depth, h, w] : [w, h, depth]);

  return [
    pane("glass", 0, 0, width, 2.18, 0.07),
    ...[-width / 2, 0, width / 2].map((shift) => pane("steel", shift, 0, 0.075, 2.22, 0.12)),
    ...[-1.09, 1.09].map((height) => pane("steel", 0, height, width, 0.075, 0.12)),
  ];
}

const trees: [number, number][] = [[-7.3, 1.65], [7.4, -2.7], [6.8, 3.95], [-6.65, -3.95]];

const batches: { start: number; end: number; offset: Vector; pieces: Piece[]; grow?: boolean }[] = [
  {
    start: 0.018, end: 0.19, offset: [0, -0.65, 0],
    pieces: [
      ...columnPositions.map(([x, z]) => box("concrete", [x, 0.01, z], [1.18, 0.25, 1.12])),
      box("concrete", [0, 0.25, 0], [10.4, 0.32, 6.25]),
      box("concrete", [1.15, 0.085, 3.75], [6.2, 0.22, 1.46]),
    ],
  },
  {
    start: 0.20, end: 0.257, offset: [0, -2.2, 0], grow: true,
    pieces: columnPositions.map(([x, z]) => box("steel", [x, 1.55, z], [0.23, 2.27, 0.23])),
  },
  {
    start: 0.257, end: 0.329, offset: [-0.9, 0.26, -0.5],
    pieces: [
      ...[-2.8, 2.8].map((z) => box("steel", [0, 2.71, z], [9.85, 0.25, 0.22])),
      ...[-4.8, -3.2, -1.6, 0, 1.6, 3.2, 4.8].map((x) => box("steel", [x, 2.71, 0], [0.16, 0.22, 5.4])),
      box("concrete", [0.22, 2.91, 0.36], [10.18, 0.18, 6.62]),
    ],
  },
  {
    start: 0.329, end: 0.395, offset: [0, -2.15, 0], grow: true,
    pieces: columnPositions.map(([x, z]) => box("steel", [x, 4.12, z], [0.22, 2.24, 0.22])),
  },
  { start: 0.40, end: 0.50, offset: [0, -1.4, 0], grow: true, pieces: wallPanels },
  {
    start: 0.50, end: 0.595, offset: [-1.15, 0.65, -0.65],
    pieces: [
      ...[-2.8, 2.8].map((z) => box("steel", [0, 5.36, z], [9.85, 0.24, 0.22])),
      ...[-4.8, -2.4, 0, 2.4, 4.8].map((x) => box("steel", [x, 5.36, 0], [0.19, 0.22, 5.45])),
      ...[-3.94, -1.31, 1.32, 3.95].map((x) => box("stone", [x, 5.55, 0], [2.63, 0.27, 6.78])),
      box("steel", [0, 5.71, 0], [10.58, 0.09, 6.84]),
    ],
  },
  {
    start: 0.60, end: 0.665, offset: [0, 0.38, 0.44],
    pieces: [
      box("timber", [-3.50, 1.55, 2.95], [2.39, 2.22, 0.08]),
      box("timber", [-3.50, 4.12, 2.95], [2.39, 2.22, 0.08]),
      ...[1.55, 4.12].flatMap((y) =>
        Array.from({ length: 12 }, (_, i) => box(i % 3 === 0 ? "steel" : "timber", [-4.54 + i * 0.19, y, 3.01], [0.057, 2.19, 0.07])),
      ),
      box("timber", [4.94, 4.12, -1.5], [0.08, 2.22, 2.4]),
    ],
  },
  {
    start: 0.665, end: 0.748, offset: [0.32, 0.28, 0.42],
    pieces: [
      ...[1.55, 4.12].flatMap((y) => [
        ...glazing(-1.15, y, 2.8, 2.18),
        ...glazing(2.41, y, 2.8, 4.55),
        ...glazing(4.8, y, 1.42, 2.62, true),
      ]),
      box("steel", [-0.54, 1.46, 2.89], [0.04, 0.49, 0.07]),
    ],
  },
  {
    start: 0.748, end: 0.797, offset: [0, 0.45, 0.5],
    pieces: [
      box("stone", [1.78, 2.88, 3.49], [6.7, 0.24, 1.55]),
      box("steel", [1.78, 3.9, 4.23], [6.65, 0.057, 0.075]),
      box("steel", [-1.53, 3.9, 3.61], [0.057, 0.057, 1.22]),
      box("steel", [5.08, 3.9, 3.61], [0.057, 0.057, 1.22]),
      ...[-1.53, 0.12, 1.77, 3.42, 5.08].map((x) => box("steel", [x, 3.45, 4.23], [0.052, 0.91, 0.052])),
      box("glass", [1.78, 3.49, 4.23], [6.6, 0.79, 0.044]),
      box("glass", [-1.53, 3.49, 3.61], [0.044, 0.79, 1.22]),
      box("glass", [5.08, 3.49, 3.61], [0.044, 0.79, 1.22]),
    ],
  },
  {
    start: 0.81, end: 0.95, offset: [0, -0.36, 0], grow: true,
    pieces: [
      box("grass", [-5.92, 0.055, 0.2], [1.28, 0.09, 7.1]),
      box("grass", [6.15, 0.055, -0.29], [1.9, 0.09, 6.6]),
      ...[4.66, 5.29, 5.92, 6.55].map((z) => box("stone", [-0.73, 0.06, z], [2.06, 0.095, 0.51])),
      ...trees.flatMap(([x, z], index) => [
        box("timber", [x, 0.65, z], [0.16, 1.28, 0.16]),
        { finish: "leaf" as const, position: [x, 1.48 + index * 0.07, z] as Vector, size: [0.72, 1.04, 0.67] as Vector, shape: "tree" as const },
      ]),
      ...[-4.77, -4.02, -3.27, 3.7, 4.4, 5.12].map((x): Piece => ({
        finish: "leaf", position: [x, 0.3, 4.5], size: [0.43, 0.34, 0.48], shape: "tree",
      })),
    ],
  },
  {
    start: 0.955, end: 0.99, offset: [0, 0, 0],
    pieces: [
      box("light", [1.76, 2.749, 3.51], [6.16, 0.035, 0.04]),
      box("light", [0.06, 5.411, 3.23], [9.4, 0.035, 0.043]),
      ...[4.6, 5.9].map((z) => box("light", [-1.92, 0.16, z], [0.18, 0.14, 0.13])),
    ],
  },
];

const animatedPieces = batches.flatMap(({ start, end, offset, pieces, grow }) => {
  const duration = end - start;
  return pieces.map((piece, index) => ({
    ...piece, offset, grow,
    start: start + duration * 0.64 * index / Math.max(1, pieces.length - 1),
    duration: duration * 0.36,
  }));
});

type AnimatedPiece = typeof animatedPieces[number];
const individualPieces = animatedPieces.filter((piece) => piece.shape || piece.finish === "glass");
const instanceBatches = Object.keys(finishes).map((key) => {
  const finish = key as Finish;
  return { finish, pieces: animatedPieces.filter((piece) => !piece.shape && piece.finish === finish && finish !== "glass") };
}).filter(({ pieces }) => pieces.length > 0);

const Geometry = memo(function Geometry({ piece, simple }: { piece: Piece; simple: boolean }) {
  return (
    <mesh scale={piece.size} castShadow={piece.finish !== "glass"} receiveShadow>
      {piece.shape === "tree" ? <icosahedronGeometry args={[1, simple ? 1 : 2]} /> : <boxGeometry />}
      <meshStandardMaterial {...finishes[piece.finish]} />
    </mesh>
  );
});

function pose(piece: AnimatedPiece, progress: number) {
  const { position, size, offset, grow, start, duration } = piece;
  const time = Math.max(0, Math.min(1, (progress - start) / duration));
  const settled = time * time * (3 - 2 * time);
  const remaining = 1 - settled;
  return {
    visible: time > 0,
    x: position[0] + offset[0] * remaining,
    y: position[1] + (grow ? -size[1] / 2 : offset[1]) * remaining,
    z: position[2] + offset[2] * remaining,
    height: grow ? Math.max(0.001, settled) : 1,
  };
}

export default function HouseModel({ progress }: { progress: number }) {
  const groups = useRef<(Group | null)[]>([]);
  const instances = useRef<(InstancedMesh | null)[]>([]);
  const invalidate = useThree((state) => state.invalidate);
  const simple = useThree((state) => state.size.width < 480);

  useLayoutEffect(() => {
    individualPieces.forEach((piece, index) => {
      const group = groups.current[index];
      if (!group) return;

      const { visible, x, y, z, height } = pose(piece, progress);
      group.visible = visible;
      group.position.set(x, y, z);
      group.scale.y = height;
    });

    const matrix = new Matrix4();
    instanceBatches.forEach(({ pieces }, index) => {
      const mesh = instances.current[index];
      if (!mesh) return;

      let count = 0;
      for (const piece of pieces) {
        const { visible, x, y, z, height } = pose(piece, progress);
        if (!visible) continue;

        matrix.makeScale(piece.size[0], piece.size[1] * height, piece.size[2]);
        matrix.setPosition(x, y, z);
        mesh.setMatrixAt(count++, matrix);
      }
      mesh.count = count;
      mesh.instanceMatrix.needsUpdate = true;
    });
    invalidate();
  }, [progress, invalidate]);

  const lightIntensity = Math.max(0, (progress - 0.955) / 0.045);
  return (
    <group>
      <mesh position={[0, -0.095, 0.15]} receiveShadow>
        <boxGeometry args={[15.8, 0.12, 11.4]} />
        <meshStandardMaterial {...finishes.earth} />
      </mesh>
      {instanceBatches.map(({ finish, pieces }, index) => (
        <instancedMesh
          key={finish}
          args={[undefined, undefined, pieces.length]}
          ref={(mesh) => { instances.current[index] = mesh; }}
          castShadow
          receiveShadow
          frustumCulled={false}
        >
          <boxGeometry />
          <meshStandardMaterial {...finishes[finish]} />
        </instancedMesh>
      ))}
      {individualPieces.map((piece, index) => (
        <group key={index} ref={(group) => { groups.current[index] = group; }}>
          <Geometry piece={piece} simple={simple} />
        </group>
      ))}
      <pointLight position={[1.45, 2.35, 3.48]} color="#ffc27d" intensity={lightIntensity * 16} distance={5} />
      <pointLight position={[0.5, 4.94, 2.7]} color="#ffc27d" intensity={lightIntensity * 17} distance={5} />
    </group>
  );
}
