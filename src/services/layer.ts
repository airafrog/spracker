import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export class LayerService {
  private gltf: GLTF;
  height: number;

  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;

  canvas: HTMLCanvasElement = document.createElement("canvas");

  constructor(gltf: GLTF, height: number) {
    this.gltf = gltf;
    this.height = height;

    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, -100, 100);
    this.camera.position.set(0, 10, 0);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });

    this.scene.add(gltf.scene);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    // console log the canvas url
    console.log(this.canvas.toDataURL("image/png"));
  }
}
