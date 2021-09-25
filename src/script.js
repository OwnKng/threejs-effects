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
const plane = new THREE.PlaneGeometry(200, 200, 600, 600)

//_ Create Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  wireframe: false,
  side: THREE.DoubleSide,
  // blending: THREE.AdditiveBlending,
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uElevation: { value: 3.0 },
    uElevationDetail: { value: 0.0 },
    uElevationGeneral: { value: 1.2 },
    uElevationFill: { value: 0.0 },
    uWaves: { value: 0.0 },
  },
})

//_ Create mesh
const mesh = new THREE.Mesh(plane, material)
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
renderer.setClearColor("#08121C")

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

//_ Debug
const gui = new dat.GUI()

gui
  .add(material.uniforms.uWaves, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uWaves")

gui
  .add(material.uniforms.uElevation, "value")
  .min(0)
  .max(5)
  .step(0.001)
  .name("uElevation")

gui
  .add(material.uniforms.uElevationDetail, "value")
  .min(0)
  .max(5)
  .step(0.001)
  .name("uElevationDetail")

gui
  .add(material.uniforms.uElevationGeneral, "value")
  .min(0)
  .max(5)
  .step(0.001)
  .name("uElevationGeneral")

gui
  .add(material.uniforms.uElevationFill, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uElevationFill")

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
