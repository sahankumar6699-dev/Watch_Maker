import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============ STATE ============
const state = {
    dialColor: '#1a1a1a',
    caseMaterial: 'steel',
    caseSize: 42,
    strap: 'leather-black',
    handsStyle: 'classic',
    basePrice: 4850
};

const materialPrices = {
    steel: 0,
    gold: 3500,
    'rose-gold': 4200,
    titanium: 1800
};

const strapPrices = {
    'leather-black': 0,
    'leather-brown': 0,
    steel: 450,
    rubber: 200
};

// ============ THREE.JS SETUP ============
const canvas = document.getElementById('watch-canvas');
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true, 
    alpha: true 
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2.5;
controls.maxDistance = 8;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// ============ LIGHTING ============
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xd4af37, 0.5);
fillLight.position.set(-5, 0, 5);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(0, -5, -5);
scene.add(rimLight);

// ============ WATCH MODEL ============
const watchGroup = new THREE.Group();
scene.add(watchGroup);

// Materials
const materials = {
    steel: new THREE.MeshStandardMaterial({ 
        color: 0xc0c0c0, 
        metalness: 0.9, 
        roughness: 0.2 
    }),
    gold: new THREE.MeshStandardMaterial({ 
        color: 0xd4af37, 
        metalness: 0.95, 
        roughness: 0.15 
    }),
    roseGold: new THREE.MeshStandardMaterial({ 
        color: 0xb76e79, 
        metalness: 0.95, 
        roughness: 0.15 
    }),
    titanium: new THREE.MeshStandardMaterial({ 
        color: 0x8a8a8a, 
        metalness: 0.85, 
        roughness: 0.3 
    })
};

const dialMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.3,
    roughness: 0.8
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 0.95,
    thickness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0
});

// Watch Case (main body)
let caseGeometry = new THREE.CylinderGeometry(1, 1, 0.25, 64);
let caseMesh = new THREE.Mesh(caseGeometry, materials.steel);
caseMesh.rotation.x = Math.PI / 2;
watchGroup.add(caseMesh);

// Bezel
const bezelGeometry = new THREE.TorusGeometry(1, 0.08, 16, 64);
const bezelMesh = new THREE.Mesh(bezelGeometry, materials.steel);
bezelMesh.position.z = 0.12;
watchGroup.add(bezelMesh);

// Crown
const crownGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 32);
const crownMesh = new THREE.Mesh(crownGeometry, materials.steel);
crownMesh.rotation.z = Math.PI / 2;
crownMesh.position.set(1.15, 0, 0);
watchGroup.add(crownMesh);

// Dial
const dialGeometry = new THREE.CylinderGeometry(0.9, 0.9, 0.02, 64);
const dialMesh = new THREE.Mesh(dialGeometry, dialMaterial);
dialMesh.rotation.x = Math.PI / 2;
dialMesh.position.z = 0.1;
watchGroup.add(dialMesh);

// Hour markers
const markerGroup = new THREE.Group();
for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const isMain = i % 3 === 0;
    
    const markerGeom = new THREE.BoxGeometry(
        isMain ? 0.08 : 0.04,
        isMain ? 0.2 : 0.12,
        0.02
    );
    const markerMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.2
    });
    const marker = new THREE.Mesh(markerGeom, markerMat);
    
    marker.position.x = Math.sin(angle) * 0.75;
    marker.position.y = Math.cos(angle) * 0.75;
    marker.position.z = 0.12;
    marker.rotation.z = -angle;
    
    markerGroup.add(marker);
}
watchGroup.add(markerGroup);

// Watch Hands
const handsGroup = new THREE.Group();

// Hour hand
const hourHandGeom = new THREE.BoxGeometry(0.04, 0.4, 0.02);
hourHandGeom.translate(0, 0.2, 0);
const hourHandMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1
});
const hourHand = new THREE.Mesh(hourHandGeom, hourHandMat);
hourHand.position.z = 0.15;
handsGroup.add(hourHand);

// Minute hand
const minuteHandGeom = new THREE.BoxGeometry(0.03, 0.55, 0.02);
minuteHandGeom.translate(0, 0.275, 0);
const minuteHandMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1
});
const minuteHand = new THREE.Mesh(minuteHandGeom, minuteHandMat);
minuteHand.position.z = 0.17;
handsGroup.add(minuteHand);

// Second hand
const secondHandGeom = new THREE.BoxGeometry(0.015, 0.65, 0.01);
secondHandGeom.translate(0, 0.3, 0);
const secondHandMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.8,
    roughness: 0.2
});
const secondHand = new THREE.Mesh(secondHandGeom, secondHandMat);
secondHand.position.z = 0.19;
handsGroup.add(secondHand);

// Center pin
const centerPinGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 32);
const centerPinMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1
});
const centerPin = new THREE.Mesh(centerPinGeom, centerPinMat);
centerPin.rotation.x = Math.PI / 2;
centerPin.position.z = 0.17;
handsGroup.add(centerPin);

watchGroup.add(handsGroup);

// Glass crystal
const glassGeom = new THREE.CylinderGeometry(0.95, 0.95, 0.05, 64);
const glassMesh = new THREE.Mesh(glassGeom, glassMaterial);
glassMesh.rotation.x = Math.PI / 2;
glassMesh.position.z = 0.16;
watchGroup.add(glassMesh);

// Strap
const strapGroup = new THREE.Group();

// Top strap
const topStrapGeom = new THREE.BoxGeometry(0.5, 2, 0.1);
const topStrapMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.1,
    roughness: 0.9
});
const topStrap = new THREE.Mesh(topStrapGeom, topStrapMat);
topStrap.position.y = 1.5;
topStrap.position.z = -0.05;
strapGroup.add(topStrap);

// Bottom strap
const bottomStrapGeom = new THREE.BoxGeometry(0.5, 2, 0.1);
const bottomStrapMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.1,
    roughness: 0.9
});
const bottomStrap = new THREE.Mesh(bottomStrapGeom, bottomStrapMat);
bottomStrap.position.y = -1.5;
bottomStrap.position.z = -0.05;
strapGroup.add(bottomStrap);

// Strap connectors (lugs)
const lugGeom = new THREE.BoxGeometry(0.6, 0.15, 0.12);
const lugMesh1 = new THREE.Mesh(lugGeom, materials.steel);
lugMesh1.position.y = 0.95;
lugMesh1.position.z = 0;
strapGroup.add(lugMesh1);

const lugMesh2 = new THREE.Mesh(lugGeom, materials.steel);
lugMesh2.position.y = -0.95;
lugMesh2.position.z = 0;
strapGroup.add(lugMesh2);

watchGroup.add(strapGroup);

// ============ UPDATE FUNCTIONS ============
function updateDialColor(color) {
    dialMaterial.color.set(color);
}

function updateCaseMaterial(materialName) {
    const mat = materials[materialName];
    caseMesh.material = mat;
    bezelMesh.material = mat;
    crownMesh.material = mat;
    lugMesh1.material = mat;
    lugMesh2.material = mat;
}

function updateStrap(strapType) {
    const strapColors = {
        'leather-black': 0x1a1a1a,
        'leather-brown': 0x3d2a1a,
        'steel': 0xa0a0a0,
        'rubber': 0x0a0a0a
    };
    
    const isMetal = strapType === 'steel';
    const color = strapColors[strapType];
    
    topStrapMat.color.set(color);
    topStrapMat.metalness = isMetal ? 0.8 : 0.1;
    topStrapMat.roughness = isMetal ? 0.2 : 0.9;
    
    bottomStrapMat.color.set(color);
    bottomStrapMat.metalness = isMetal ? 0.8 : 0.1;
    bottomStrapMat.roughness = isMetal ? 0.2 : 0.9;
}

function updateHands() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const hourAngle = -((hours + minutes / 60) / 12) * Math.PI * 2;
    const minuteAngle = -((minutes + seconds / 60) / 60) * Math.PI * 2;
    const secondAngle = -(seconds / 60) * Math.PI * 2;
    
    hourHand.rotation.z = hourAngle;
    minuteHand.rotation.z = minuteAngle;
    secondHand.rotation.z = secondAngle;
}

function updatePrice() {
    let price = state.basePrice;
    price += materialPrices[state.caseMaterial] || 0;
    price += strapPrices[state.strap] || 0;
    
    if (state.caseSize === 46) price += 300;
    
    document.getElementById('price-value').textContent = `$${price.toLocaleString()}`;
}

// ============ PARTICLES ============
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        container.appendChild(particle);
    }
}

// ============ TIME DISPLAY ============
function updateTimeDisplay() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    });
    const dateStr = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('current-time').textContent = timeStr;
    document.getElementById('current-date').textContent = dateStr;
}

// ============ EVENT LISTENERS ============
// Dial colors
document.querySelectorAll('#dial-colors .color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        document.querySelectorAll('#dial-colors .color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        state.dialColor = swatch.dataset.color;
        updateDialColor(state.dialColor);
    });
});

// Case materials
document.querySelectorAll('#case-materials .material-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#case-materials .material-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.caseMaterial = btn.dataset.material;
        updateCaseMaterial(state.caseMaterial);
        updatePrice();
    });
});

// Case sizes
document.querySelectorAll('#case-sizes .material-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#case-sizes .material-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.caseSize = parseInt(btn.dataset.size);
        
        // Scale watch based on size
        const scale = 0.9 + (state.caseSize - 38) * 0.025;
        watchGroup.scale.setScalar(scale);
        
        updatePrice();
    });
});

// Straps
document.querySelectorAll('#straps .strap-preview').forEach(preview => {
    preview.addEventListener('click', () => {
        document.querySelectorAll('#straps .strap-preview').forEach(p => p.classList.remove('active'));
        preview.classList.add('active');
        state.strap = preview.dataset.strap;
        updateStrap(state.strap);
        updatePrice();
    });
});

// Hands styles
document.querySelectorAll('#hands-styles .material-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#hands-styles .material-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.handsStyle = btn.dataset.hands;
    });
});

// Zoom controls
document.getElementById('zoom-in').addEventListener('click', () => {
    camera.position.z = Math.max(camera.position.z - 0.5, controls.minDistance);
});

document.getElementById('zoom-out').addEventListener('click', () => {
    camera.position.z = Math.min(camera.position.z + 0.5, controls.maxDistance);
});

document.getElementById('reset-view').addEventListener('click', () => {
    camera.position.set(0, 0, 5);
    controls.reset();
});

// Toggle panel
const toggleBtn = document.getElementById('toggle-panel');
const panel = document.getElementById('customization-panel');
const toggleIcon = document.getElementById('toggle-icon');

toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('hidden');
    toggleBtn.classList.toggle('panel-hidden');
    
    if (panel.classList.contains('hidden')) {
        toggleIcon.innerHTML = '<polyline points="9 18 15 12 9 6"></polyline>';
    } else {
        toggleIcon.innerHTML = '<polyline points="15 18 9 12 15 6"></polyline>';
    }
});

// ============ ANIMATION LOOP ============
function animate() {
    requestAnimationFrame(animate);
    
    updateHands();
    controls.update();
    
    // Subtle floating animation
    watchGroup.position.y = Math.sin(Date.now() * 0.001) * 0.02;
    
    renderer.render(scene, camera);
}

// ============ RESIZE HANDLER ============
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============ INIT ============
createParticles();
updateTimeDisplay();
setInterval(updateTimeDisplay, 1000);
animate();

// Initial scale based on default size
const initialScale = 0.9 + (state.caseSize - 38) * 0.025;
watchGroup.scale.setScalar(initialScale);
