import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as CANNON from 'cannon-es'

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 50, -50)
orbit.update()
// orbit.enabled = false

const textureLoader = new THREE.TextureLoader()

const groundPhysMat = new CANNON.Material()

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true,
    material: groundPhysMat
})
const groundMesh = new THREE.Mesh(groundGeo, groundMat)
scene.add(groundMesh)

const boxPhysMat = new CANNON.Material()

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true,
    material: boxPhysMat
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const spherePhysMat = new CANNON.Material()

const sphereGeo = new THREE.SphereGeometry(5)
const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xf00000,
    wireframe: true,
    material: spherePhysMat,
})
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
sphereMesh.position.set(0, 50, 0)
scene.add(sphereMesh)

const ambientLight = new THREE.AmbientLight(0x444444)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xFFFFFF, 3500, 300)
scene.add(pointLight)

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0),
})

const groundBody = new CANNON.Body({
    //shape: new CANNON.Plane(),
    //mass: 10
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat,
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(0, 20, 0),
    material: boxPhysMat
});
world.addBody(boxBody)

// Rotacao 
boxBody.angularVelocity.set(0,5,0)

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {friction: 0.04}
);

world.addContactMaterial(groundBoxContactMat);

const sphereBody = new CANNON.Body({
    mass: 4,
    shape: new CANNON.Sphere(5),
    position: new CANNON.Vec3(0.5, 10, 0),
    material: spherePhysMat
});

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {
        friction: 1,
        restitution: 1
    }
);

world.addContactMaterial(groundSphereContactMat);

// Air Resistance
sphereBody.linearDamping = 0.31

world.addBody(sphereBody)

const timeStep = 1 / 60

function animate() {
    world.step(timeStep)

    groundMesh.position.copy(groundBody.position)
    groundMesh.quaternion.copy(groundBody.quaternion)

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    // groundBody.position.z += 0.01
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})