// ============================================
// THREE.JS — Real GLTF Human (RobotExpressive)
// ============================================
(function () {
  const canvas = document.getElementById('threejs-bg');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(5, 2, 10);
  camera.lookAt(3, 1, 0);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const keyLight = new THREE.PointLight(0xff3cac, 5, 25);
  keyLight.position.set(5, 8, 5);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x3b82f6, 2, 20);
  fillLight.position.set(-3, 3, 4);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xf9f002, 2, 15);
  rimLight.position.set(4, -1, -4);
  scene.add(rimLight);

  // Ground glow
  const glowGeo = new THREE.CircleGeometry(2.5, 32);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xff3cac, transparent: true, opacity: 0.07 });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.set(3, -0.01, 0);
  scene.add(glow);

  // Particles around figure
  const pCount = 350;
  const pPos = new Float32Array(pCount * 3);
  const pCol = new Float32Array(pCount * 3);
  const palette = [new THREE.Color('#ff3cac'), new THREE.Color('#f9f002'), new THREE.Color('#39ff14'), new THREE.Color('#3b82f6'), new THREE.Color('#a855f7')];
  for (let i = 0; i < pCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.8 + Math.random() * 2.5;
    pPos[i*3]   = 3 + Math.cos(a) * r;
    pPos[i*3+1] = Math.random() * 5.5;
    pPos[i*3+2] = Math.sin(a) * r;
    const c = palette[Math.floor(Math.random() * palette.length)];
    pCol[i*3] = c.r; pCol[i*3+1] = c.g; pCol[i*3+2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.8 });
  const pts = new THREE.Points(pGeo, pMat);
  scene.add(pts);

  // ── GLTF Model ─────────────────────────────
  let mixer = null;
  let actions = {};
  let currentAction = null;
  let modelRoot = null;

  // Animation names in RobotExpressive.glb
  const ANIM = {
    idle:     'Idle',
    walk:     'Walking',
    wave:     'Wave',
    dance:    'Dance',
    thumbsup: 'ThumbsUp',
  };

  function fadeToAction(name, duration = 0.4) {
    if (!actions[name] || currentAction === actions[name]) return;
    const next = actions[name];
    if (currentAction) {
      currentAction.fadeOut(duration);
    }
    next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play();
    currentAction = next;
  }

  const loader = new THREE.GLTFLoader();
  loader.load(
    'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    (gltf) => {
      modelRoot = gltf.scene;
      modelRoot.position.set(3, 0, 0);
      modelRoot.scale.setScalar(1.0);
      scene.add(modelRoot);

      // Cast shadows
      modelRoot.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          // Tint with accent color
          if (c.material) {
            c.material = c.material.clone();
            c.material.emissive = new THREE.Color(0xff3cac);
            c.material.emissiveIntensity = 0.05;
          }
        }
      });

      mixer = new THREE.AnimationMixer(modelRoot);
      gltf.animations.forEach(clip => {
        actions[clip.name] = mixer.clipAction(clip);
      });

      // Start idle
      fadeToAction(ANIM.idle, 0);

      // Hide loading hint
      const hint = document.getElementById('loadingHint');
      if (hint) hint.style.display = 'none';
    },
    (xhr) => {
      const pct = Math.round((xhr.loaded / xhr.total) * 100);
      const hint = document.getElementById('loadingHint');
      if (hint) hint.textContent = `loading model... ${pct}%`;
    },
    (err) => console.warn('GLTF load error', err)
  );

  // ── Scroll & mouse ──────────────────────
  let mouseX = 0, mouseY = 0;
  let scrollProgress = 0;
  let lastSection = '';

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    scrollProgress = max > 0 ? window.scrollY / max : 0;

    if (!mixer) return;

    let section;
    if      (scrollProgress < 0.15) section = 'idle';
    else if (scrollProgress < 0.40) section = 'walk';
    else if (scrollProgress < 0.65) section = 'wave';
    else if (scrollProgress < 0.85) section = 'dance';
    else                             section = 'thumbsup';

    if (section !== lastSection) {
      lastSection = section;
      fadeToAction(ANIM[section]);
    }
  }, { passive: true });

  // ── Animate loop ────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();

    if (mixer) mixer.update(dt);

    // Rotate model to face slightly toward viewer, mouse tilt
    if (modelRoot) {
      modelRoot.rotation.y += (mouseX * 0.3 - modelRoot.rotation.y) * 0.06;
    }

    // Key light pulse
    keyLight.intensity = 4.5 + Math.sin(clock.elapsedTime * 2) * 0.5;

    // Particles orbit
    pts.rotation.y += 0.003;

    // Camera gentle sway
    camera.position.x += (5 + mouseX * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (2  - mouseY * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(3, 1.2, 0);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ============================================
// Scroll reveal
// ============================================
const reveals = document.querySelectorAll('.bcard, .pcard, .contact__simple, .projects__header');
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

reveals.forEach(el => observer.observe(el));

// ============================================
// Active nav highlight
// ============================================
const navLinks = document.querySelectorAll('.nav__pill a');
const sections = document.querySelectorAll('section[id]');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => { l.style.background = ''; l.style.color = ''; });
      const a = document.querySelector(`.nav__pill a[href="#${e.target.id}"]`);
      if (a) { a.style.background = 'rgba(255,60,172,0.12)'; a.style.color = '#ff3cac'; }
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObs.observe(s));
