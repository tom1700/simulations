import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const createBasicScene = (
    canvasElement: HTMLDivElement,
    size: number
) => {
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    camera.position.z = size * 3;

    const ambientLight = new THREE.AmbientLight(0x808080);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.x = camera.position.x;
    light.position.y = camera.position.y;
    light.position.z = camera.position.z;

    scene.add(light);

    new OrbitControls(camera, canvasElement);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    canvasElement.appendChild(renderer.domElement);

    const removeScene = () => {
        canvasElement.removeChild(renderer.domElement);
    }

    const render = () => {
        renderer.render(scene, camera);
    }

    return { scene, removeScene, render };
}