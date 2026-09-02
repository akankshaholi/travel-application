import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function Travel3DBusRoute() {
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
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
    const height = container.clientHeight || 150;

    // ── 1. Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 7, 24);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ── 2. Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(12, 18, 12);
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x0284c7, 3, 35);
    cyanLight.position.set(10, 4, 8);
    scene.add(cyanLight);

    // ── 3. Build 3D Modern Coach Bus Model ──
    const busGroup = new THREE.Group();

    // Main Bus Chassis Body
    const bodyGeo = new THREE.BoxGeometry(4.2, 1.35, 1.5);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Sleek ocean blue
      metalness: 0.6,
      roughness: 0.2,
    });
    const busBody = new THREE.Mesh(bodyGeo, bodyMat);
    busBody.position.y = 0.8;
    busGroup.add(busBody);

    // Roof Top Accent
    const roofGeo = new THREE.BoxGeometry(4.0, 0.15, 1.4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
    const busRoof = new THREE.Mesh(roofGeo, roofMat);
    busRoof.position.y = 1.55;
    busGroup.add(busRoof);

    // Side Windows Tinted Glass (Left & Right)
    const glassGeo = new THREE.BoxGeometry(3.6, 0.55, 1.54);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.1,
    });
    const windows = new THREE.Mesh(glassGeo, glassMat);
    windows.position.y = 1.0;
    busGroup.add(windows);

    // Front Windshield
    const windshieldGeo = new THREE.BoxGeometry(0.1, 0.7, 1.36);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(2.11, 0.95, 0);
    busGroup.add(windshield);

    // Front Headlights
    const lightGeo = new THREE.BoxGeometry(0.08, 0.2, 0.35);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a }); // Warm bright light
    const headlightLeft = new THREE.Mesh(lightGeo, lightMat);
    headlightLeft.position.set(2.11, 0.45, 0.5);
    const headlightRight = new THREE.Mesh(lightGeo, lightMat);
    headlightRight.position.set(2.11, 0.45, -0.5);
    busGroup.add(headlightLeft);
    busGroup.add(headlightRight);

    // Rear Taillights
    const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tailLeft = new THREE.Mesh(lightGeo, tailLightMat);
    tailLeft.position.set(-2.11, 0.45, 0.5);
    const tailRight = new THREE.Mesh(lightGeo, tailLightMat);
    tailRight.position.set(-2.11, 0.45, -0.5);
    busGroup.add(tailLeft);
    busGroup.add(tailRight);

    // 4 Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16);
    wheelGeo.rotateX(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.8 });

    const wheelPositions = [
      [1.3, 0.35, 0.78],
      [1.3, 0.35, -0.78],
      [-1.3, 0.35, 0.78],
      [-1.3, 0.35, -0.78],
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(x, y, z);

      // Hubcap rim
      const rimGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.32, 12);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.set(x, y, z);

      busGroup.add(wheel);
      busGroup.add(rim);
    });

    busGroup.scale.set(0.7, 0.7, 0.7);
    scene.add(busGroup);

    // ── 4. Winding Highway Curve ──
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18, 0, -2),
      new THREE.Vector3(-9, 0, 3),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(9, 0, 3),
      new THREE.Vector3(18, 0, -2),
    ]);

    // Dashed Lane Line
    const points = roadCurve.getPoints(120);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.7,
      gapSize: 0.4,
      linewidth: 2,
    });
    const roadLine = new THREE.Line(lineGeo, lineMat);
    roadLine.computeLineDistances();
    scene.add(roadLine);

    // Bus Stop Waypoint Markers
    const markerGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16);
    const markerMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.5 });
    [-18, -9, 0, 9, 18].forEach((xPos, idx) => {
      const pt = roadCurve.getPointAt(idx / 4);
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pt);
      scene.add(marker);
    });

    // ── 5. Animation Loop ──
    let animationFrameId;
    let progress = 0;

    const animate = () => {
      if (!reducedMotion) {
        progress += 0.0018; // Smooth steady highway speed
        if (progress > 1) progress = 0;

        const point = roadCurve.getPointAt(progress);
        const tangent = roadCurve.getTangentAt(progress).normalize();

        busGroup.position.copy(point);

        // Align bus orientation with road heading direction
        const lookTarget = point.clone().add(tangent);
        busGroup.lookAt(lookTarget);

        // Subtle suspension sway in turns
        const turnSway = Math.sin(progress * Math.PI * 4) * 0.08;
        busGroup.rotation.z = turnSway;
      } else {
        // Static position for reduced motion
        const pt = roadCurve.getPointAt(0.5);
        busGroup.position.copy(pt);
        busGroup.rotation.set(0, 0, 0);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // ── 6. Resize Handler ──
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 150;
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
      glassGeo.dispose();
      glassMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, [reducedMotion]);

  return (
    <div className="travel-3d-bus-wrapper" aria-label="Animated 3D bus road trail">
      <div className="travel-3d-bus-badge">🚌 Road Explorer Trail</div>
      <div ref={containerRef} className="travel-3d-bus-canvas-container" />
    </div>
  );
}

export default Travel3DBusRoute;
