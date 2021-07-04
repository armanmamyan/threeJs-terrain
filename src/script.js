import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const mountainTexture = textureLoader.load('/texture.jpg');
const height = textureLoader.load('/height.png');
const alphaMap = textureLoader.load('/alpha.jpg');

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneBufferGeometry(3,3, 1000, 1000);


// Materials
const material = new THREE.MeshStandardMaterial({
    color: 'gray',
    map: mountainTexture,
    displacementMap: height,
    displacementScale:  .6,
    transparent: true,
    alphaMap: alphaMap,
    depthTest: false,
    wireframe: true,
})
gui.add(material, 'displacementScale').min(0.01).max(1)
// Mesh
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = 181
scene.add(plane);

gui.add(plane.rotation, 'x').min(0).max(600)

// Lights

const pointLight = new THREE.PointLight('#00b3ff', 3)
pointLight.position.x = 0.2
pointLight.position.y = 10
pointLight.position.z = 4.4
gui.add(pointLight.position, 'x').min(0).max(600)
gui.add(pointLight.position, 'y').min(0).max(600)
gui.add(pointLight.position, 'z').min(0).max(600)
scene.add(pointLight)

const color = {
    color: '#00ff00'
}

gui.addColor(color, 'color').onChange(() => {
    pointLight.color.set(new THREE.Color(color.color))
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    plane.rotation.z = 0.5 * elapsedTime;
    const planeAngle = - elapsedTime * 0.18;
    plane.material.displacementScale = Math.abs(Math.cos(planeAngle))


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()