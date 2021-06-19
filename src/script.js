import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const scene = new THREE.Scene();
const gui = new dat.GUI();

// scene.add(axisHelper);
//created  a Galaxy
const fog = new THREE.Fog("red", 0, 10);
scene.add(fog);
const parameters = {};
parameters.count = 50000;
parameters.size = 0.01;
parameters.radius = 3;
parameters.branches = 3;
parameters.randomness = 0.2;
parameters.insideColor = "#004028";
parameters.outsideColor = "#001675";
parameters.spin = 4;
parameters.randomnessPower = 10;

let geometry = null;
let points = null;
let pointMaterial = null;

const galaxyGenrator = () => {
  if (points !== null) {
    geometry.dispose();
    pointMaterial.dispose();
    scene.remove(points);
  }
  geometry = new THREE.BufferGeometry();
  const position = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count * 3; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
      (((i % parameters.branches) + spinAngle) / parameters.branches) *
      Math.PI *
      2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    position[i3] = Math.sin(branchAngle) * radius + randomX;
    position[i3 + 1] = randomY;
    position[i3 + 2] = Math.cos(branchAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  pointMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    // color: "cyan",
    vertexColors: true,
  });
  points = new THREE.Points(geometry, pointMaterial);

  scene.add(points);
};
gui
  .add(parameters, "size")
  .min(0.01)
  .max(0.1)
  .step(0.01)
  .onFinishChange(galaxyGenrator);
gui
  .add(parameters, "randomnessPower")
  .min(0.01)
  .max(10)
  .step(0.002)
  .onFinishChange(galaxyGenrator);
gui
  .add(parameters, "radius")
  .min(1)
  .max(20)
  .step(2)
  .onFinishChange(galaxyGenrator);

gui
  .add(parameters, "count")
  .min(400)
  .max(100000)
  .step(50)
  .onFinishChange(galaxyGenrator);
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(galaxyGenrator);
gui.addColor(parameters, "insideColor").onFinishChange(galaxyGenrator);
gui.addColor(parameters, "outsideColor").onFinishChange(galaxyGenrator);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.01)
  .onFinishChange(galaxyGenrator);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.01)
  .onFinishChange(galaxyGenrator);
galaxyGenrator();
//MadeCamera
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});

const camera = new THREE.PerspectiveCamera(45, size.width / size.height);

camera.position.z = 5;

//renderd at html element
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);
// renderer.setClearColor("#262837");
const clock = new THREE.Clock();
const control = new OrbitControls(camera, canvas);
renderer.setPixelRatio(window.devicePixelRatio);
control.enableDamping = true;
const ticker = () => {
  // const elapsedTime = clock.getElapsedTime();
  const time = clock.getElapsedTime();
  renderer.render(scene, camera);
  control.update();
  window.requestAnimationFrame(ticker);
};
ticker();
