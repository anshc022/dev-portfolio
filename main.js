// ============================================
// THREE.JS — Animated Human Figure
// ============================================
(function () {
  const canvas = document.getElementById('threejs-bg');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(6, 2, 14);
  camera.lookAt(3, 1, 0);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0xff3cac, 4, 30);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x3b82f6, 2, 20);
  fillLight.position.set(-4, 2, 4);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x39ff14, 1.5, 15);
  rimLight.position.set(3, -2, -5);
  scene.add(rimLight);

  // ── Materials ──────────────────────────────
  const bodyMat = new THREE.MeshPhongMaterial({
    color: 0x1a1a2e,
    emissive: 0xff3cac,
    emissiveIntensity: 0.08,
    shininess: 80,
  });

  const accentMat = new THREE.MeshPhongMaterial({
    color: 0xff3cac,
    emissive: 0xff3cac,
    emissiveIntensity: 0.4,
    shininess: 120,
  });

  const eyeMat = new THREE.MeshPhongMaterial({
    color: 0xf9f002,
    emissive: 0xf9f002,
    emissiveIntensity: 0.9,
  });

  // ── Build Human ────────────────────────────
  function cyl(rt, rb, h, segs, mat) {
    return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segs), mat);
  }
  function sph(r, segs, mat) {
    return new THREE.Mesh(new THREE.SphereGeometry(r, segs, segs), mat);
  }
  function box(w, h, d, mat) {
    return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  }

  const root = new THREE.Group();
  root.position.set(3, -1.5, 0);
  scene.add(root);

  // — Head group —
  const headGroup = new THREE.Group();
  headGroup.position.y = 3.4;
  root.add(headGroup);

  const head = sph(0.55, 10, bodyMat);
  headGroup.add(head);

  // Eyes
  const eyeL = sph(0.1, 6, eyeMat);
  eyeL.position.set(-0.2, 0.1, 0.48);
  headGroup.add(eyeL);

  const eyeR = sph(0.1, 6, eyeMat);
  eyeR.position.set(0.2, 0.1, 0.48);
  headGroup.add(eyeR);

  // Hair (stacked box)
  const hair = box(1.0, 0.25, 0.95, accentMat);
  hair.position.y = 0.42;
  headGroup.add(hair);

  // — Neck —
  const neck = cyl(0.14, 0.16, 0.3, 6, bodyMat);
  neck.position.y = 2.8;
  root.add(neck);

  // — Torso —
  const torso = box(1.1, 1.4, 0.55, bodyMat);
  torso.position.y = 1.8;
  root.add(torso);

  // Chest accent stripe
  const stripe = box(0.3, 0.9, 0.02, accentMat);
  stripe.position.set(0, 1.9, 0.28);
  root.add(stripe);

  // — Hip —
  const hip = box(0.95, 0.4, 0.5, bodyMat);
  hip.position.y = 0.9;
  root.add(hip);

  // — Left Shoulder group (pivot at shoulder) —
  const lShoulder = new THREE.Group();
  lShoulder.position.set(-0.75, 2.35, 0);
  root.add(lShoulder);

  const lUpperArm = cyl(0.14, 0.12, 0.85, 6, bodyMat);
  lUpperArm.position.y = -0.42;
  lShoulder.add(lUpperArm);

  const lElbow = new THREE.Group();
  lElbow.position.y = -0.85;
  lShoulder.add(lElbow);

  const lLowerArm = cyl(0.11, 0.09, 0.8, 6, bodyMat);
  lLowerArm.position.y = -0.4;
  lElbow.add(lLowerArm);

  const lHand = sph(0.13, 7, accentMat);
  lHand.position.y = -0.85;
  lElbow.add(lHand);

  // — Right Shoulder group —
  const rShoulder = new THREE.Group();
  rShoulder.position.set(0.75, 2.35, 0);
  root.add(rShoulder);

  const rUpperArm = cyl(0.14, 0.12, 0.85, 6, bodyMat);
  rUpperArm.position.y = -0.42;
  rShoulder.add(rUpperArm);

  const rElbow = new THREE.Group();
  rElbow.position.y = -0.85;
  rShoulder.add(rElbow);

  const rLowerArm = cyl(0.11, 0.09, 0.8, 6, bodyMat);
  rLowerArm.position.y = -0.4;
  rElbow.add(rLowerArm);

  const rHand = sph(0.13, 7, accentMat);
  rHand.position.y = -0.85;
  rElbow.add(rHand);

  // — Left Hip group (pivot at hip joint) —
  const lHip = new THREE.Group();
  lHip.position.set(-0.32, 0.7, 0);
  root.add(lHip);

  const lUpperLeg = cyl(0.17, 0.14, 1.0, 7, bodyMat);
  lUpperLeg.position.y = -0.5;
  lHip.add(lUpperLeg);

  const lKnee = new THREE.Group();
  lKnee.position.y = -1.0;
  lHip.add(lKnee);

  const lLowerLeg = cyl(0.12, 0.09, 0.95, 7, bodyMat);
  lLowerLeg.position.y = -0.47;
  lKnee.add(lLowerLeg);

  const lFoot = box(0.22, 0.12, 0.45, accentMat);
  lFoot.position.set(0, -0.98, 0.12);
  lKnee.add(lFoot);

  // — Right Hip group —
  const rHip = new THREE.Group();
  rHip.position.set(0.32, 0.7, 0);
  root.add(rHip);

  const rUpperLeg = cyl(0.17, 0.14, 1.0, 7, bodyMat);
  rUpperLeg.position.y = -0.5;
  rHip.add(rUpperLeg);

  const rKnee = new THREE.Group();
  rKnee.position.y = -1.0;
  rHip.add(rKnee);

  const rLowerLeg = cyl(0.12, 0.09, 0.95, 7, bodyMat);
  rLowerLeg.position.y = -0.47;
  rKnee.add(rLowerLeg);

  const rFoot = box(0.22, 0.12, 0.45, accentMat);
  rFoot.position.set(0, -0.98, 0.12);
  rKnee.add(rFoot);

  // ── Ground glow ────────────────────────────
  const groundGeo = new THREE.CircleGeometry(3, 32);
  const groundMat = new THREE.MeshBasicMaterial({
    color: 0xff3cac,
    transparent: true,
    opacity: 0.06,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(3, -2.5, 0);
  scene.add(ground);

  // ── Floating particles around figure ───────
  const partCount = 300;
  const partPos = new Float32Array(partCount * 3);
  const partCol = new Float32Array(partCount * 3);
  const palette = [
    new THREE.Color('#ff3cac'),
    new THREE.Color('#f9f002'),
    new THREE.Color('#39ff14'),
    new THREE.Color('#3b82f6'),
  ];

  for (let i = 0; i < partCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 3;
    partPos[i * 3]     = 3 + Math.cos(angle) * radius;
    partPos[i * 3 + 1] = -1 + Math.random() * 7;
    partPos[i * 3 + 2] = Math.sin(angle) * radius;
    const c = palette[Math.floor(Math.random() * palette.length)];
    partCol[i * 3] = c.r; partCol[i * 3 + 1] = c.g; partCol[i * 3 + 2] = c.b;
  }

  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
  partGeo.setAttribute('color', new THREE.BufferAttribute(partCol, 3));
  const partMat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.7 });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // ── Mouse & scroll tracking ─────────────
  let mouseX = 0, mouseY = 0;
  let scrollProgress = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }, { passive: true });

  // ── Lerp helper ─────────────────────────
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Current animated values (lerped each frame)
  const cur = {
    lShoulderX: 0, lShoulderZ: 0.1,
    rShoulderX: 0, rShoulderZ: -0.1,
    lElbowX: 0, rElbowX: 0,
    lHipX: 0, rHipX: 0,
    lKneeX: 0, rKneeX: 0,
    headY: 0, headX: 0,
    rootY: -1.5,
    rootRotY: 0.3,
    lElbowZ: 0, rElbowZ: 0,
  };

  // ── Animation ───────────────────────────
  let t = 0;
  const clock = new THREE.Clock();

  // Scroll-triggered label
  let scrollLabel = null;

  function getTargets(sp, dt) {
    const s = Math.sin;
    // walking cycle speed
    const wt = t * 3;

    if (sp < 0.15) {
      // ── IDLE / BREATHING ──
      return {
        lShoulderX: 0,
        lShoulderZ: 0.08 + s(t * 1.2) * 0.04,
        rShoulderX: 0,
        rShoulderZ: -0.08 - s(t * 1.2) * 0.04,
        lElbowX: 0.1, rElbowX: 0.1,
        lElbowZ: 0, rElbowZ: 0,
        lHipX: 0, rHipX: 0,
        lKneeX: 0, rKneeX: 0,
        headY: mouseX * 0.35,
        headX: -mouseY * 0.2,
        rootY: -1.5 + s(t * 1.5) * 0.04,
        rootRotY: 0.25 + s(t * 0.4) * 0.08,
      };
    } else if (sp < 0.38) {
      // ── WALKING ──
      return {
        lShoulderX: -s(wt) * 0.45,
        lShoulderZ: 0.08,
        rShoulderX: s(wt) * 0.45,
        rShoulderZ: -0.08,
        lElbowX: Math.max(0, s(wt + 1)) * 0.5,
        rElbowX: Math.max(0, -s(wt + 1)) * 0.5,
        lElbowZ: 0, rElbowZ: 0,
        lHipX: s(wt) * 0.55,
        rHipX: -s(wt) * 0.55,
        lKneeX: Math.max(0, s(wt + Math.PI / 2)) * 0.7,
        rKneeX: Math.max(0, -s(wt + Math.PI / 2)) * 0.7,
        headY: mouseX * 0.25,
        headX: -0.1,
        rootY: -1.5 + Math.abs(s(wt * 2)) * 0.06,
        rootRotY: 0.25 + s(t * 0.3) * 0.05,
      };
    } else if (sp < 0.62) {
      // ── WAVING ──
      return {
        lShoulderX: 0,
        lShoulderZ: 0.08,
        rShoulderX: 0,
        rShoulderZ: -Math.PI * 0.55 + s(t * 5) * 0.2,
        lElbowX: 0.1,
        rElbowX: 0,
        lElbowZ: 0,
        rElbowZ: s(t * 5 + 1) * 0.35,
        lHipX: 0,
        rHipX: 0,
        lKneeX: 0, rKneeX: 0,
        headY: mouseX * 0.3 + 0.2,
        headX: -0.15,
        rootY: -1.5 + s(t * 1.0) * 0.05,
        rootRotY: 0.4,
      };
    } else if (sp < 0.82) {
      // ── TYPING ──
      return {
        lShoulderX: -0.6,
        lShoulderZ: 0.15,
        rShoulderX: -0.6,
        rShoulderZ: -0.15,
        lElbowX: 0.9 + s(t * 9) * 0.1,
        rElbowX: 0.9 + s(t * 9 + 1.5) * 0.1,
        lElbowZ: 0, rElbowZ: 0,
        lHipX: 0, rHipX: 0,
        lKneeX: 0, rKneeX: 0,
        headY: mouseX * 0.2,
        headX: 0.2,
        rootY: -1.5,
        rootRotY: 0.2,
      };
    } else {
      // ── VICTORY / CELEBRATE ──
      return {
        lShoulderX: -2.4 + s(t * 4) * 0.15,
        lShoulderZ: 0.1,
        rShoulderX: -2.4 + s(t * 4 + 1) * 0.15,
        rShoulderZ: -0.1,
        lElbowX: -0.3, rElbowX: -0.3,
        lElbowZ: 0, rElbowZ: 0,
        lHipX: 0, rHipX: 0,
        lKneeX: 0, rKneeX: 0,
        headY: mouseX * 0.3,
        headX: -0.3,
        rootY: -1.5 + Math.abs(s(t * 6)) * 0.12,
        rootRotY: 0.3 + s(t * 0.5) * 0.1,
      };
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    t += dt;

    const sp = scrollProgress;
    const targets = getTargets(sp, dt);
    const speed = 6 * dt;

    // Lerp all values
    cur.lShoulderX = lerp(cur.lShoulderX, targets.lShoulderX, speed);
    cur.lShoulderZ = lerp(cur.lShoulderZ, targets.lShoulderZ, speed);
    cur.rShoulderX = lerp(cur.rShoulderX, targets.rShoulderX, speed);
    cur.rShoulderZ = lerp(cur.rShoulderZ, targets.rShoulderZ, speed);
    cur.lElbowX    = lerp(cur.lElbowX,    targets.lElbowX,    speed);
    cur.rElbowX    = lerp(cur.rElbowX,    targets.rElbowX,    speed);
    cur.lElbowZ    = lerp(cur.lElbowZ,    targets.lElbowZ,    speed);
    cur.rElbowZ    = lerp(cur.rElbowZ,    targets.rElbowZ,    speed);
    cur.lHipX      = lerp(cur.lHipX,      targets.lHipX,      speed);
    cur.rHipX      = lerp(cur.rHipX,      targets.rHipX,      speed);
    cur.lKneeX     = lerp(cur.lKneeX,     targets.lKneeX,     speed);
    cur.rKneeX     = lerp(cur.rKneeX,     targets.rKneeX,     speed);
    cur.headY      = lerp(cur.headY,      targets.headY,      speed);
    cur.headX      = lerp(cur.headX,      targets.headX,      speed);
    cur.rootY      = lerp(cur.rootY,      targets.rootY,      speed);
    cur.rootRotY   = lerp(cur.rootRotY,   targets.rootRotY,   speed);

    // Apply
    lShoulder.rotation.x = cur.lShoulderX;
    lShoulder.rotation.z = cur.lShoulderZ;
    rShoulder.rotation.x = cur.rShoulderX;
    rShoulder.rotation.z = cur.rShoulderZ;
    lElbow.rotation.x    = cur.lElbowX;
    rElbow.rotation.x    = cur.rElbowX;
    lElbow.rotation.z    = cur.lElbowZ;
    rElbow.rotation.z    = cur.rElbowZ;
    lHip.rotation.x      = cur.lHipX;
    rHip.rotation.x      = cur.rHipX;
    lKnee.rotation.x     = cur.lKneeX;
    rKnee.rotation.x     = cur.rKneeX;
    headGroup.rotation.y = cur.headY;
    headGroup.rotation.x = cur.headX;
    root.position.y      = cur.rootY;
    root.rotation.y      = cur.rootRotY;

    // Subtle torso sway
    torso.rotation.z = Math.sin(t * 1.3) * 0.012;

    // Emissive pulse on key light
    keyLight.intensity = 3.5 + Math.sin(t * 2.5) * 0.5;

    // Particles orbit
    particles.rotation.y = t * 0.08;

    // Camera subtle movement
    camera.position.x = 6 + mouseX * 0.4;
    camera.position.y = 2 + mouseY * -0.3;
    camera.lookAt(3, 1.2, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

})();

// ============================================
// Scroll reveal
// ============================================
const reveals = document.querySelectorAll('.bcard, .pcard, .contact__left, .contact__right, .projects__header');
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
// Contact form
// ============================================
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'sending... 📡';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'sent! talk soon 🎉';
    btn.style.background = '#39ff14';
    btn.style.color = '#000';
    btn.style.boxShadow = '0 0 20px rgba(57,255,20,0.4)';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = 'send it 🚀';
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.boxShadow = '';
    }, 3000);
  }, 1000);
});

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
