import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export class LayerService {
  private gltf: GLTF;
  private gltfBox = new THREE.Box3();
  public gltfSize = new THREE.Vector3();
  private sliceThickness: number;
  private layerHeight = 0;

  private scene = new THREE.Scene();
  private static camera = new THREE.OrthographicCamera();
  private renderer: THREE.WebGLRenderer;
  private lowerClippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
  private upperClippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0));

  public canvas: HTMLCanvasElement = document.createElement("canvas");

  constructor(gltf: GLTF, layerHeight: number, sliceThickness: number = 10) {
    if (layerHeight < 0 || layerHeight > 1) {
      throw new Error("Height must be a percentage between 0 and 1");
    }
    if (sliceThickness <= 0) {
      throw new Error("Slice thickness must be positive");
    }

    this.gltf = gltf;
    this.sliceThickness = sliceThickness;

    this.gltfBox.setFromObject(gltf.scene);
    this.gltfBox.getSize(this.gltfSize);

    this.scene = new THREE.Scene();
    this.scene.add(this.gltf.scene);

    this.setLayerHeight(layerHeight);
    this.initializeCamera();

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: this.canvas,
    });
    this.renderer.clippingPlanes = [
      this.lowerClippingPlane,
      this.upperClippingPlane,
    ];
    this.renderer.localClippingEnabled = true;
    this.renderer.setClearColor(0x000000, 0); // Set clear color to black with alpha 0

    // Enable clipping on all materials in the scene
    this.gltf.scene.traverse((child) => {
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

  private initializeCamera() {
    LayerService.camera.left = -this.gltfSize.x / 2;
    LayerService.camera.right = this.gltfSize.x / 2;
    LayerService.camera.top = this.gltfSize.z / 2;
    LayerService.camera.bottom = -this.gltfSize.z / 2;
    LayerService.camera.near = -100;
    LayerService.camera.far = 100;
    LayerService.camera.updateProjectionMatrix();

    LayerService.camera.position.set(0, this.gltfSize.y, 0);
    LayerService.camera.lookAt(0, 0, 0);
  }

  render() {
    this.renderer.render(this.scene, LayerService.camera);
  }

  setLayerHeight(newHeight: number) {
    this.layerHeight = newHeight; // percentage (0-1)
    const actualHeight = this.getActualHeight();

    this.lowerClippingPlane.constant = -(
      actualHeight -
      this.sliceThickness / 2
    );
    this.upperClippingPlane.constant = actualHeight + this.sliceThickness / 2;
  }

  updateSliceThickness(newThickness: number) {
    this.sliceThickness = newThickness;
    const actualHeight = this.getActualHeight();
    this.lowerClippingPlane.constant = -(actualHeight - newThickness / 2);
    this.upperClippingPlane.constant = actualHeight + newThickness / 2;
  }

  private getActualHeight(): number {
    return this.gltfBox.min.y + this.layerHeight * this.gltfSize.y;
  }
}
