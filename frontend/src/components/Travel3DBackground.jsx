import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function Travel3DBackground() {
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

    const width = window.innerWidth;
    const height = window.innerHeight;

    // ── 1. Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2, 28);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── 2. Vibrant Gradient Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Cyan / Teal Light (Left)
    const cyanLight = new THREE.PointLight(0x06b6d4, 4, 50);
    cyanLight.position.set(-18, 10, 10);
    scene.add(cyanLight);

    // Purple / Pink Light (Right)
    const pinkLight = new THREE.PointLight(0xec4899, 4, 50);
    pinkLight.position.set(18, -10, 10);
    scene.add(pinkLight);

    // Deep Blue Key Light
    const dirLight = new THREE.DirectionalLight(0x6366f1, 2.5);
    dirLight.position.set(10, 20, 20);
    scene.add(dirLight);

    // ── 3. Glowing 3D World Globe ──
    const globeGroup = new THREE.Group();
    globeGroup.position.set(12, 4, -8); // Positioned elegantly to the upper right background

    // Wireframe Globe Surface
    const globeGeo = new THREE.IcosahedronGeometry(5.2, 4);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      metalness: 0.8,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Inner Glowing Core
    const coreGeo = new THREE.SphereGeometry(4.9, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Globe Orbital Ring (Latitude/Longitude ring)
    const ringGeo = new THREE.TorusGeometry(7.2, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.4 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    globeGroup.add(ringMesh);

    scene.add(globeGroup);

    // ── 4. Orbiting 3D Airplane (Air Travel) ──
    const planeGroup = new THREE.Group();
    const bodyGeo = new THREE.ConeGeometry(0.5, 2.8, 12);
    bodyGeo.rotateX(Math.PI / 2);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, planeMat);
    planeGroup.add(body);

    const wingsGeo = new THREE.BoxGeometry(4.8, 0.06, 0.8);
    const wingsMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const wings = new THREE.Mesh(wingsGeo, wingsMat);
    wings.position.z = 0.2;
    planeGroup.add(wings);

    const tailGeo = new THREE.BoxGeometry(0.06, 0.8, 0.6);
    tailGeo.rotateX(-Math.PI / 6);
    const tail = new THREE.Mesh(tailGeo, planeMat);
    tail.position.set(0, 0.4, -1.1);
    planeGroup.add(tail);

    planeGroup.scale.set(0.55, 0.55, 0.55);
    scene.add(planeGroup);

    // ── 5. 3D Bus on Road Path (Road Travel) ──
    const busGroup = new THREE.Group();
    const busBodyGeo = new THREE.BoxGeometry(3.2, 1.1, 1.2);
    const busMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.6, roughness: 0.2 });
    const busBody = new THREE.Mesh(busBodyGeo, busMat);
    busBody.position.y = 0.6;
    busGroup.add(busBody);

    const busGlassGeo = new THREE.BoxGeometry(2.8, 0.45, 1.24);
    const busGlassMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const busGlass = new THREE.Mesh(busGlassGeo, busGlassMat);
    busGlass.position.y = 0.8;
    busGroup.add(busGlass);

    busGroup.position.set(-14, -6, -4);
    busGroup.scale.set(0.5, 0.5, 0.5);
    scene.add(busGroup);

    // Road Curve Path for Bus
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-22, -8, -4),
      new THREE.Vector3(-12, -5, 0),
      new THREE.Vector3(-2, -9, -2),
      new THREE.Vector3(8, -6, -5),
    ]);

    // ── 6. Soft Floating 3D Clouds ──
    const cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.9,
    });

    const createCloud = (x, y, z, scale) => {
      const c = new THREE.Group();
      const p1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 1), cloudMat);
      const p2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0, 1), cloudMat);
      p2.position.set(1.1, 0.2, 0);
      const p3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), cloudMat);
      p3.position.set(-1.1, -0.1, 0);
      c.add(p1, p2, p3);
      c.position.set(x, y, z);
      c.scale.set(scale, scale, scale);
      return c;
    };

    cloudsGroup.add(createCloud(-16, 8, -10, 1.2));
    cloudsGroup.add(createCloud(4, -8, -12, 1.5));
    cloudsGroup.add(createCloud(-8, -4, -6, 0.9));
    scene.add(cloudsGroup);

    // ── 7. Glowing Particle Starfield ──
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 30 - 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.15,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── 8. Animation Loop ──
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (!reducedMotion) {
        // Globe Slow Rotation
        globeMesh.rotation.y = elapsedTime * 0.15;
        globeMesh.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;
        ringMesh.rotation.z = elapsedTime * 0.08;

        // Plane Orbit around Globe
        const planeAngle = elapsedTime * 0.35;
        const radius = 8.5;
        const px = globeGroup.position.x + Math.cos(planeAngle) * radius;
        const py = globeGroup.position.y + Math.sin(planeAngle * 0.7) * 2.5;
        const pz = globeGroup.position.z + Math.sin(planeAngle) * radius;

        planeGroup.position.set(px, py, pz);
        planeGroup.rotation.y = -planeAngle + Math.PI / 2;
        planeGroup.rotation.z = Math.sin(planeAngle) * 0.2;

        // Bus Highway Motion along road curve
        const busProgress = (elapsedTime * 0.04) % 1;
        const busPt = roadCurve.getPointAt(busProgress);
        const busTangent = roadCurve.getTangentAt(busProgress).normalize();
        busGroup.position.copy(busPt);
        busGroup.lookAt(busPt.clone().add(busTangent));

        // Floating Clouds Drift
        cloudsGroup.children.forEach((cloud, i) => {
          cloud.position.x += Math.sin(elapsedTime * 0.2 + i) * 0.005;
          cloud.position.y += Math.cos(elapsedTime * 0.3 + i) * 0.003;
        });

        // Gentle Particle Motion
        particles.rotation.y = elapsedTime * 0.02;
      } else {
        // Static layout for reduced motion
        globeMesh.rotation.y = 0.5;
        planeGroup.position.set(globeGroup.position.x - 7, globeGroup.position.y + 1, globeGroup.position.z + 2);
        busGroup.position.copy(roadCurve.getPointAt(0.5));
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // ── 9. Resize Handler ──
    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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
      globeGeo.dispose();
      globeMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [reducedMotion]);

  return (
    <div className="travel-3d-bg-wrapper" aria-hidden="true">
      <div ref={containerRef} className="travel-3d-bg-canvas" />
    </div>
  );
}

export default Travel3DBackground;
