import * as THREE from 'three';

const container = document.querySelector('#app');

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setClearColor(0x1b1e2b, 1);

container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);

camera.position.z = 1;

const positions = new Float32Array([
  -0.5,  0.0, 0,  
   0.5,  0.0, 0,   
   0.0,  0.87, 0   
]);

const colors = new Float32Array([
  0, 1, 0,  
  0, 0, 1,   
  1, 0, 0    
]);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.MeshBasicMaterial({
  vertexColors: true,
  side: THREE.DoubleSide
});

const triangle = new THREE.Mesh(geometry, material);
scene.add(triangle);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -aspect;
  camera.right = aspect;
  camera.top = 1;
  camera.bottom = -1;
  camera.updateProjectionMatrix();
});

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
