import { CameraControls, ContactShadows, Edges, Grid, TransformControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildPart } from "@/lib/cad/geometry";
import { MATERIALS, SCENE } from "@/lib/cad/materials";
import { useCadStore } from "@/lib/cad/store";
import type { CadPart, Vec3 } from "@/lib/cad/types";

const DEG = Math.PI / 180;
const TARGET: Vec3 = [0, 34, 0];
const PRESETS: Record<string, Vec3> = {
  iso: [150, 118, 168],
  front: [0, 52, 230],
  top: [0, 280, 0.2],
  right: [230, 52, 0],
  left: [-230, 52, 0],
};

const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

export function Viewport() {
  return (
    <div className="absolute inset-0 touch-none bg-bg">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: PRESETS.iso, fov: 40, near: 0.5, far: 2500 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          localClippingEnabled: true,
          alpha: false,
        }}
        onPointerMissed={() => useCadStore.getState().select(null)}
        onCreated={({ gl }) => {
          gl.setClearColor(SCENE.clear, 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
        <SceneLights />
        <SceneGrid />
        <Parts />
        <CameraControls
          makeDefault
          smoothTime={0.22}
          minDistance={24}
          maxDistance={900}
          draggingSmoothTime={0.12}
        />
        <CameraRig />
        <CaptureRig />
      </Canvas>
    </div>
  );
}

function SceneLights() {
  return (
    <>
      <hemisphereLight args={[SCENE.hemiSky, SCENE.hemiGround, 0.52]} />
      <ambientLight intensity={0.16} />
      <directionalLight
        position={[130, 190, 90]}
        intensity={1.32}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={20}
        shadow-camera-far={640}
        shadow-camera-left={-180}
        shadow-camera-right={180}
        shadow-camera-top={180}
        shadow-camera-bottom={-180}
        color={SCENE.key}
      />
      <directionalLight position={[-100, 70, -80]} intensity={0.32} color={SCENE.fill} />
      <directionalLight position={[40, 50, 140]} intensity={0.18} color={SCENE.rim} />
      <ContactShadows opacity={0.42} scale={420} blur={2.1} far={90} position={[0, 0, 0]} />
    </>
  );
}

function SceneGrid() {
  const grid = useCadStore((s) => s.grid);
  if (!grid) return null;
  return (
    <Grid
      position={[0, 0.02, 0]}
      args={[1, 1]}
      cellSize={10}
      cellThickness={0.55}
      cellColor={SCENE.gridCell}
      sectionSize={50}
      sectionThickness={1.05}
      sectionColor={SCENE.gridSection}
      fadeDistance={520}
      fadeStrength={1.15}
      infiniteGrid
    />
  );
}

function Parts() {
  const parts = useCadStore((s) => s.parts);
  const selectedId = useCadStore((s) => s.selectedId);
  const explode = useCadStore((s) => s.explode);
  const section = useCadStore((s) => s.section);
  const tool = useCadStore((s) => s.tool);
  return (
    <>
      {parts.map((part) => (
        <PartInstance
          key={part.id}
          part={part}
          selected={part.id === selectedId}
          explode={explode}
          section={section}
          tool={tool}
        />
      ))}
    </>
  );
}

function PartInstance({
  part,
  selected,
  explode,
  section,
  tool,
}: {
  part: CadPart;
  selected: boolean;
  explode: number;
  section: boolean;
  tool: string;
}) {
  const group = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const [gizmoReady, setGizmoReady] = useState(false);
  const select = useCadStore((s) => s.select);
  const setTransform = useCadStore((s) => s.setTransform);
  const controls = useThree((s) => s.controls) as { enabled: boolean } | null;
  const pos = useMemo(
    () => explodedPos(part.position, explode),
    [part.position, explode],
  );
  const rot = part.rotation;

  useLayoutEffect(() => {
    if (group.current) setGizmoReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!group.current || dragging.current) return;
    group.current.position.set(pos[0], pos[1], pos[2]);
    group.current.rotation.set(rot[0] * DEG, rot[1] * DEG, rot[2] * DEG);
  }, [pos, rot]);

  const showGizmo = selected && !part.locked && explode < 0.02 && (tool === "move" || tool === "rotate") && gizmoReady;

  return (
    <>
      <group
        ref={group}
        visible={part.visible}
        onPointerDown={(e) => {
          e.stopPropagation();
          select(part.id);
        }}
      >
        <PartMeshes part={part} selected={selected} section={section} />
      </group>
      {showGizmo && group.current ? (
        <TransformControls
          object={group.current}
          mode={tool === "rotate" ? "rotate" : "translate"}
          size={0.85}
          space="world"
          onMouseDown={() => {
            dragging.current = true;
            if (controls) controls.enabled = false;
          }}
          onMouseUp={() => {
            dragging.current = false;
            if (controls) controls.enabled = true;
            const g = group.current;
            if (!g) return;
            const step = useCadStore.getState().snap ? useCadStore.getState().snapStep : 0;
            let nextPos: Vec3 = [g.position.x, g.position.y, g.position.z];
            let nextRot: Vec3 = [g.rotation.x / DEG, g.rotation.y / DEG, g.rotation.z / DEG];
            if (step && tool === "move") {
              nextPos = nextPos.map((v) => Math.round(v / step) * step) as Vec3;
              g.position.set(...nextPos);
            }
            if (step && tool === "rotate") {
              nextRot = nextRot.map((v) => Math.round(v / 15) * 15) as Vec3;
              g.rotation.set(nextRot[0] * DEG, nextRot[1] * DEG, nextRot[2] * DEG);
            }
            setTransform(part.id, nextPos, nextRot);
          }}
        />
      ) : null}
    </>
  );
}

function PartMeshes({
  part,
  selected,
  section,
}: {
  part: CadPart;
  selected: boolean;
  section: boolean;
}) {
  const key = JSON.stringify(part.params);
  const built = useMemo(() => buildPart(part.kind, part.params), [part.kind, key]);
  useEffect(() => () => built.dispose(), [built]);
  const look = MATERIALS[part.material];
  const planes = section ? [clipPlane] : [];

  return (
    <>
      {built.meshes.map((mesh, i) => {
        const accent = mesh.role === "accent";
        return (
          <mesh key={i} geometry={mesh.geometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={accent ? MATERIALS.stainless.color : look.color}
              metalness={accent ? 0.95 : look.metalness}
              roughness={accent ? 0.16 : look.roughness}
              emissive={selected ? "#9aadc0" : "#000000"}
              emissiveIntensity={selected ? 0.14 : 0}
              clippingPlanes={planes}
              clipShadows
            />
            <Edges
              threshold={24}
              color={selected ? SCENE.edgeSelected : SCENE.edge}
            />
          </mesh>
        );
      })}
    </>
  );
}

function CameraRig() {
  const viewTick = useCadStore((s) => s.viewTick);
  const parts = useCadStore((s) => s.parts);
  const clearView = useCadStore((s) => s.clearView);
  const controls = useThree((s) => s.controls) as {
    setLookAt: (
      x: number,
      y: number,
      z: number,
      tx: number,
      ty: number,
      tz: number,
      t?: boolean,
    ) => Promise<unknown>;
    fitToBox: (box: THREE.Box3, t: boolean) => Promise<unknown>;
  } | null;

  useEffect(() => {
    if (!viewTick || !controls) return;
    const run = async () => {
      if (viewTick === "fit") {
        const box = new THREE.Box3();
        for (const p of parts) {
          box.expandByPoint(new THREE.Vector3(...p.position));
        }
        if (box.isEmpty()) {
          await controls.setLookAt(150, 118, 168, TARGET[0], TARGET[1], TARGET[2], true);
        } else {
          box.expandByScalar(55);
          await controls.fitToBox(box, true);
        }
      } else {
        const eye = PRESETS[viewTick] ?? PRESETS.iso;
        await controls.setLookAt(eye[0], eye[1], eye[2], TARGET[0], TARGET[1], TARGET[2], true);
      }
      clearView();
    };
    void run();
  }, [viewTick, controls, parts, clearView]);
  return null;
}

function CaptureRig() {
  const tick = useCadStore((s) => s.captureTick);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const prev = useRef(0);
  useEffect(() => {
    if (!tick || tick === prev.current) return;
    prev.current = tick;
    gl.render(scene, camera);
    const link = document.createElement("a");
    link.href = gl.domElement.toDataURL("image/png");
    link.download = "alyazh.png";
    link.click();
  }, [tick, gl, scene, camera]);
  return null;
}

export default Viewport;

function explodedPos(pos: Vec3, explode: number): Vec3 {
  if (explode <= 0.002) return pos;
  const len = Math.hypot(pos[0], pos[2]);
  const nx = len > 0.01 ? pos[0] / len : 0;
  const nz = len > 0.01 ? pos[2] / len : 0;
  const k = explode * 38;
  return [pos[0] + nx * k, pos[1] + explode * 10, pos[2] + nz * k];
}
