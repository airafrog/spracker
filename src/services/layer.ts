import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export class LayerService {
  private gltf: GLTF;
  height: number; // percentage (0-1)
  sliceThickness: number;
  private modelHeight: number; // actual model height
  private modelMinY: number; // minimum Y position of the model

  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  lowerClippingPlane: THREE.Plane;
  upperClippingPlane: THREE.Plane;

  canvas: HTMLCanvasElement = document.createElement("canvas");

  constructor(gltf: GLTF, height: number, sliceThickness: number = 1) {
    this.gltf = gltf;
    this.height = height; // percentage (0-1)
    this.sliceThickness = sliceThickness;

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    this.modelHeight = size.y;
    this.modelMinY = box.min.y;

    // Convert percentage height to actual world position
    const actualHeight = this.modelMinY + this.height * this.modelHeight;

    this.scene = new THREE.Scene();

    // Create lower clipping plane (clips everything below height - thickness/2)
    this.lowerClippingPlane = new THREE.Plane(
      new THREE.Vector3(0, 1, 0),
      -(actualHeight - sliceThickness / 2)
    );

    // Create upper clipping plane (clips everything above height + thickness/2)
    this.upperClippingPlane = new THREE.Plane(
      new THREE.Vector3(0, -1, 0),
      actualHeight + sliceThickness / 2
    );

    this.camera = new THREE.OrthographicCamera(
      -size.x / 2,
      size.x / 2,
      size.z / 2, // y is up
      -size.z / 2, // y is up
      -100,
      100
    );
    this.camera.position.set(0, size.y, 0);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.clippingPlanes = [
      this.lowerClippingPlane,
      this.upperClippingPlane,
    ];
    this.renderer.localClippingEnabled = true;

    this.scene.add(gltf.scene);

    // Enable clipping on all materials in the scene
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            material.clippingPlanes = [
              this.lowerClippingPlane,
              this.upperClippingPlane,
            ];
          });
        } else {
          child.material.clippingPlanes = [
            this.lowerClippingPlane,
            this.upperClippingPlane,
          ];
        }
      }
    });

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);

    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  updateHeight(newHeight: number) {
    this.height = newHeight; // percentage (0-1)
    const actualHeight = this.modelMinY + this.height * this.modelHeight;
    this.lowerClippingPlane.constant = -(
      actualHeight -
      this.sliceThickness / 2
    );
    this.upperClippingPlane.constant = actualHeight + this.sliceThickness / 2;
    this.render();
  }

  updateSliceThickness(newThickness: number) {
    this.sliceThickness = newThickness;
    const actualHeight = this.modelMinY + this.height * this.modelHeight;
    this.lowerClippingPlane.constant = -(actualHeight - newThickness / 2);
    this.upperClippingPlane.constant = actualHeight + newThickness / 2;
    this.render();
  }

  // Helper method to get the actual world height from percentage
  getActualHeight(): number {
    return this.modelMinY + this.height * this.modelHeight;
  }

  // Helper method to convert world height to percentage
  getPercentageHeight(worldHeight: number): number {
    return (worldHeight - this.modelMinY) / this.modelHeight;
  }
}
