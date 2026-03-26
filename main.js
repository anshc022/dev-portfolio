// ============================================
// THREE.JS BACKGROUND — floating particle field
// ============================================
(function () {
  const canvas = document.getElementById('threejs-bg');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 40;

  // Particle field
  const count = 1800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color('#ff3cac'),
    new THREE.Color('#f9f002'),
    new THREE.Color('#3b82f6'),
    new THREE.Color('#39ff14'),
    new THREE.Color('#a855f7'),
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Floating wireframe icosahedrons
  const geoShapes = [
    new THREE.IcosahedronGeometry(3, 0),
    new THREE.OctahedronGeometry(2, 0),
    new THREE.TetrahedronGeometry(2.5, 0),
  ];

  const shapeColors = ['#ff3cac', '#f9f002', '#39ff14'];
  const meshes = [];

  for (let i = 0; i < 6; i++) {
    const g = geoShapes[i % geoShapes.length];
    const m = new THREE.MeshBasicMaterial({
      color: shapeColors[i % shapeColors.length],
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 30 - 10
    );
    mesh.userData.rotSpeed = {
      x: (Math.random() - 0.5) * 0.004,
      y: (Math.random() - 0.5) * 0.006,
    };
    scene.add(mesh);
    meshes.push(mesh);
  }

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animate
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.001;

    particles.rotation.y = t * 0.05 + mouseX * 0.04;
    particles.rotation.x = t * 0.03 + mouseY * 0.03;

    meshes.forEach(m => {
      m.rotation.x += m.userData.rotSpeed.x;
      m.rotation.y += m.userData.rotSpeed.y;
    });

    camera.position.x += (mouseX * 3 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 3 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
})();

// ============================================
// Scroll reveal
const reveals = document.querySelectorAll('.bcard, .pcard, .contact__left, .contact__right, .projects__header, .bento__grid');
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

// Contact form
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

// Active nav highlight
const navLinks = document.querySelectorAll('.nav__pill a');
const sections = document.querySelectorAll('section[id]');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        l.style.background = '';
        l.style.color = '';
      });
      const a = document.querySelector(`.nav__pill a[href="#${e.target.id}"]`);
      if (a) {
        a.style.background = 'rgba(255,60,172,0.12)';
        a.style.color = '#ff3cac';
      }
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObs.observe(s));
