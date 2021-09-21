import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { fragmentShader, vertexShader } from "./shaders"
import * as dat from "dat.gui"

//_ Select the canvas
const canvas = document.querySelector("canvas.webgl")

//_ Set dimensions
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//_ Create a scene
const scene = new THREE.Scene()

//_ Create Geometry
const box = new THREE.PlaneGeometry(60, 60, 150, 150)

//_ Create Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  wireframe: false,
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uElevation: { value: 0.5 },
    uWaves: { value: 0.25 },
  },
})

//_ Create mesh
const mesh = new THREE.Mesh(box, material)
mesh.rotation.set(-Math.PI / 2, 0, 0)
scene.add(mesh)

//_ Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.01,
  1000
)
camera.position.set(2, 5, 10)
scene.add(camera)

//_ Create renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})

renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//_ Resize events
window.addEventListener("resize", () => {
  //* Update sizes
  size.width = window.innerWidth
  size.height = window.innerHeight

  //* Update camera
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()

  //* Update renderer
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//_ Add controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//_ Frame function
const clock = new THREE.Clock()

const frame = () => {
  const elpasedTime = clock.getElapsedTime()

  controls.update()

  material.uniforms.uTime.value = elpasedTime

  renderer.render(scene, camera)

  window.requestAnimationFrame(frame)
}

frame()
