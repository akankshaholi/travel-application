import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function Travel3DRoute() {
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check user accessibility setting for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 160;

    // ── 1. Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ── 2. Lights ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(15, 20, 15);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x6366f1, 3, 40);
    blueLight.position.set(-10, 5, 10);
    scene.add(blueLight);

    // ── 3. Build 3D Airplane Model (Low-poly Jet) ──
    const airplaneGroup = new THREE.Group();

    // Body / Fuselage
    const bodyGeo = new THREE.ConeGeometry(0.7, 4, 16);
    bodyGeo.rotateX(Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      metalness: 0.7,
      roughness: 0.2,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    airplaneGroup.add(body);

    // Cabin Nose Accent
    const noseGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      metalness: 0.9,
      roughness: 0.1,
    });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.z = 1.8;
    nose.scale.set(0.9, 0.7, 1);
    airplaneGroup.add(nose);

    // Main Wings
    const wingGeo = new THREE.BoxGeometry(7, 0.08, 1.2);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x3730a3,
      metalness: 0.6,
      roughness: 0.3,
    });
    const mainWings = new THREE.Mesh(wingGeo, wingMat);
    mainWings.position.set(0, 0, 0.2);
    airplaneGroup.add(mainWings);

    // Wingtips (Winglets)
    const wingletGeo = new THREE.BoxGeometry(0.08, 0.6, 0.4);
    const wingletLeft = new THREE.Mesh(wingletGeo, bodyMat);
    wingletLeft.position.set(3.5, 0.25, 0.2);
    const wingletRight = new THREE.Mesh(wingletGeo, bodyMat);
    wingletRight.position.set(-3.5, 0.25, 0.2);
    airplaneGroup.add(wingletLeft);
    airplaneGroup.add(wingletRight);

    // Tail Fin (Vertical Stabilizer)
    const tailFinGeo = new THREE.BoxGeometry(0.08, 1.2, 0.9);
    tailFinGeo.rotateX(-Math.PI / 6);
    const tailFinMat = new THREE.MeshStandardMaterial({ color: 0x4338ca });
    const tailFin = new THREE.Mesh(tailFinGeo, tailFinMat);
    tailFin.position.set(0, 0.6, -1.6);
    airplaneGroup.add(tailFin);

    // Tail Horizontal Stabilizers
    const tailWingsGeo = new THREE.BoxGeometry(2.4, 0.06, 0.6);
    const tailWings = new THREE.Mesh(tailWingsGeo, wingMat);
    tailWings.position.set(0, 0.1, -1.7);
    airplaneGroup.add(tailWings);

    // Engine Nacelles
    const engineGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.9, 12);
    engineGeo.rotateX(Math.PI / 2);
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.8 });
    const engineLeft = new THREE.Mesh(engineGeo, engineMat);
    engineLeft.position.set(1.4, -0.25, 0.3);
    const engineRight = new THREE.Mesh(engineGeo, engineMat);
    engineRight.position.set(-1.4, -0.25, 0.3);
    airplaneGroup.add(engineLeft);
    airplaneGroup.add(engineRight);

    airplaneGroup.scale.set(0.65, 0.65, 0.65);
    scene.add(airplaneGroup);

    // ── 4. Curve Flight Path ──
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18, -2, 2),
      new THREE.Vector3(-10, 3, -2),
      new THREE.Vector3(0, -1, 3),
      new THREE.Vector3(10, 4, -1),
      new THREE.Vector3(18, -1, 2),
    ]);

    // Dotted flight route line
    const points = curve.getPoints(100);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x818cf8,
      dashSize: 0.6,
      gapSize: 0.4,
      linewidth: 2,
    });
    const flightPathLine = new THREE.Line(lineGeo, lineMat);
    flightPathLine.computeLineDistances();
    scene.add(flightPathLine);

    // Glowing Waypoint Dots along the route
    const waypointsGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const waypointsMat = new THREE.MeshBasicMaterial({ color: 0xc7d2fe });
    [-18, -10, 0, 10, 18].forEach((xPos, idx) => {
      const pt = curve.getPointAt(idx / 4);
      const dot = new THREE.Mesh(waypointsGeo, waypointsMat);
      dot.position.copy(pt);
      scene.add(dot);
    });

    // ── 5. Animation Loop ──
    let animationFrameId;
    let progress = 0;

    const animate = () => {
      if (!reducedMotion) {
        progress += 0.0022;
        if (progress > 1) progress = 0;

        // Position plane along curve
        const point = curve.getPointAt(progress);
        const tangent = curve.getTangentAt(progress).normalize();

        airplaneGroup.position.copy(point);

        // Orient plane along direction vector
        const lookTarget = point.clone().add(tangent);
        airplaneGroup.lookAt(lookTarget);

        // Bank / Roll into turns naturally
        const bankAngle = Math.sin(progress * Math.PI * 4) * 0.25;
        airplaneGroup.rotation.z = bankAngle;
      } else {
        // Static center position for reduced motion
        const pt = curve.getPointAt(0.5);
        airplaneGroup.position.copy(pt);
        airplaneGroup.rotation.set(0, Math.PI / 4, 0);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // ── 6. Responsive Resize ──
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 160;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // ── Cleanup ──
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      wingGeo.dispose();
      wingMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, [reducedMotion]);

  return (
    <div className="travel-3d-route-wrapper" aria-label="Animated 3D flight path">
      <div className="travel-3d-route-badge">✈️ Live Flight Trail</div>
      <div ref={containerRef} className="travel-3d-canvas-container" />
    </div>
  );
}

export default Travel3DRoute;
