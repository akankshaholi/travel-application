import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Real-world NASA Satellite Earth Texture URLs from official public-domain repositories
const EARTH_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
const EARTH_NORMAL_URL = 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg';
const EARTH_SPECULAR_URL = 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg';
const EARTH_CLOUDS_URL = 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png';

function Earth3DHero() {
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
    const height = container.clientHeight || 580;

    // ── 1. Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1, 24);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── 2. Realistic Cinematic Lighting ──
    // Ambient light kept low to maintain dark night side
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    // Key Sunlight illuminating the day side
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(28, 12, 18);
    scene.add(sunLight);

    // Soft atmosphere fill light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(-20, -10, -10);
    scene.add(fillLight);

    // ── 3. Texture Loader & Realistic Satellite Earth ──
    const textureLoader = new THREE.TextureLoader();

    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, -0.6, 0);

    // Load Satellite Textures
    const earthMap = textureLoader.load(EARTH_TEXTURE_URL);
    const normalMap = textureLoader.load(EARTH_NORMAL_URL);
    const specularMap = textureLoader.load(EARTH_SPECULAR_URL);
    const cloudsMap = textureLoader.load(EARTH_CLOUDS_URL);

    // Earth Sphere Geometry
    const earthGeo = new THREE.SphereGeometry(7.0, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      specularMap: specularMap,
      specular: new THREE.Color(0x333333),
      shininess: 25,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.rotation.y = Math.PI * 0.85; // Initial view highlighting Europe, Africa & Asia
    earthGroup.add(earthMesh);

    // Realistic Cloud Layer Sphere
    const cloudGeo = new THREE.SphereGeometry(7.15, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // Thin Blue Atmospheric Fresnel Halo Glow
    const atmosphereGeo = new THREE.SphereGeometry(7.35, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity * 0.85;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    scene.add(earthGroup);

    // ── 4. Glowing 3D Travel Routes across Earth ──
    const routePoints = [
      new THREE.Vector3(-4.5, 3.2, 5.0),  // New York
      new THREE.Vector3(0.5, 4.2, 5.6),   // Paris
      new THREE.Vector3(3.8, 2.1, 5.8),   // Dubai
      new THREE.Vector3(6.2, 3.0, 3.2),   // Tokyo
      new THREE.Vector3(-4.5, 3.2, 5.0),  // Loop back
    ];

    const flightCurve = new THREE.CatmullRomCurve3(routePoints, true);
    const routePointsArray = flightCurve.getPoints(120);
    const routeGeo = new THREE.BufferGeometry().setFromPoints(routePointsArray);
    const routeMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.5,
      gapSize: 0.3,
      linewidth: 2,
    });
    const flightRouteLine = new THREE.Line(routeGeo, routeMat);
    flightRouteLine.computeLineDistances();
    earthGroup.add(flightRouteLine);

    // Waypoint Markers on surface
    const waypointGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const waypointMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    routePoints.slice(0, 4).forEach((pt) => {
      const marker = new THREE.Mesh(waypointGeo, waypointMat);
      marker.position.copy(pt);
      earthGroup.add(marker);
    });

    // ── 5. Moving 3D Airplane (Air Travel) ──
    const airplaneGroup = new THREE.Group();
    const bodyGeo = new THREE.ConeGeometry(0.4, 2.2, 12);
    bodyGeo.rotateX(Math.PI / 2);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, planeMat);
    airplaneGroup.add(body);

    const wingGeo = new THREE.BoxGeometry(3.6, 0.05, 0.6);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const wing = new THREE.Mesh(wingGeo, wingMat);
    wing.position.z = 0.2;
    airplaneGroup.add(wing);

    airplaneGroup.scale.set(0.5, 0.5, 0.5);
    scene.add(airplaneGroup);

    // ── 6. Moving 3D Bus (Road Travel) ──
    const busGroup = new THREE.Group();
    const busBodyGeo = new THREE.BoxGeometry(2.8, 1.0, 1.1);
    const busMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.7, roughness: 0.3 });
    const busBody = new THREE.Mesh(busBodyGeo, busMat);
    busBody.position.y = 0.5;
    busGroup.add(busBody);

    const busGlassGeo = new THREE.BoxGeometry(2.4, 0.4, 1.14);
    const busGlassMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const busGlass = new THREE.Mesh(busGlassGeo, busGlassMat);
    busGlass.position.y = 0.65;
    busGroup.add(busGlass);

    busGroup.scale.set(0.42, 0.42, 0.42);
    scene.add(busGroup);

    const busRoadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-14, -8, 2),
      new THREE.Vector3(-6, -6, 4),
      new THREE.Vector3(4, -8, 3),
      new THREE.Vector3(14, -6, 1),
    ]);

    // ── 7. Deep Space Particle Starfield ──
    const particleCount = 220;
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
      size: 0.16,
      transparent: true,
      opacity: 0.65,
    });
    const starfield = new THREE.Points(particleGeo, particleMat);
    scene.add(starfield);

    // ── 8. Animation Loop ──
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (!reducedMotion) {
        // Slow Realistic Earth & Cloud Rotation
        earthMesh.rotation.y = Math.PI * 0.85 + elapsedTime * 0.05; // Smooth slow rotation
        cloudMesh.rotation.y = Math.PI * 0.85 + elapsedTime * 0.07; // Clouds drift slightly faster

        // Plane Flight Along Route Curve
        const planeProgress = (elapsedTime * 0.05) % 1;
        const planeLocalPt = flightCurve.getPointAt(planeProgress);
        const planeTangent = flightCurve.getTangentAt(planeProgress).normalize();

        const planeWorldPt = planeLocalPt.clone().applyMatrix4(earthGroup.matrixWorld);
        airplaneGroup.position.copy(planeWorldPt);

        const lookTarget = planeWorldPt.clone().add(planeTangent);
        airplaneGroup.lookAt(lookTarget);
        airplaneGroup.rotation.z = Math.sin(elapsedTime * 2) * 0.15;

        // Bus Highway Motion Along Lower Road Curve
        const busProgress = (elapsedTime * 0.03) % 1;
        const busPt = busRoadCurve.getPointAt(busProgress);
        const busTangent = busRoadCurve.getTangentAt(busProgress).normalize();

        busGroup.position.copy(busPt);
        busGroup.lookAt(busPt.clone().add(busTangent));

        // Particle Drift
        starfield.rotation.y = elapsedTime * 0.01;
      } else {
        // Static frame when reduced motion is preferred
        earthMesh.rotation.y = Math.PI * 0.85;
        const pPt = flightCurve.getPointAt(0.2).applyMatrix4(earthGroup.matrixWorld);
        airplaneGroup.position.copy(pPt);
        busGroup.position.copy(busRoadCurve.getPointAt(0.5));
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // ── 9. Resize Listener ──
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 580;
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
      earthGeo.dispose();
      earthMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [reducedMotion]);

  return (
    <div className="earth-3d-hero-wrapper" aria-hidden="true">
      <div ref={containerRef} className="earth-3d-canvas" />
    </div>
  );
}

export default Earth3DHero;
