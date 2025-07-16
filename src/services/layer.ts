import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export class LayerService {
  private gltf: GLTF;
  private gltfBox = new THREE.Box3();
  public gltfSize = new THREE.Vector3();
  private layerThickness = 0;
  private layerHeight = 0;

  protected static canvas: HTMLCanvasElement = document.createElement("canvas");
  public canvasDataUrl = LayerService.canvas.toDataURL();

  private scene = new THREE.Scene();
  private lowerClippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
  private upperClippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0));

  private static camera = new THREE.OrthographicCamera();
  static {
    LayerService.camera.near = -500;
    LayerService.camera.far = 500;
  }

  private static renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: LayerService.canvas,
  });
  static {
    LayerService.renderer.localClippingEnabled = true;
    LayerService.renderer.setClearColor(0x000000, 0); // Set clear color to black with alpha 0
  }

  constructor(gltf: GLTF, layerHeight: number, layerThickness: number) {
    if (layerHeight < 0 || layerHeight > 1) {
      throw new Error("Height must be a percentage between 0 and 1");
    }
    if (layerThickness <= 0) {
      throw new Error("Slice thickness must be positive");
    }

    this.gltf = gltf;
    this.gltfBox.setFromObject(gltf.scene);
    this.gltfBox.getSize(this.gltfSize);
    this.setLayerHeight(layerHeight);
    this.setLayerThickness(layerThickness);
    this.configureCamera();

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
    this.scene.add(this.gltf.scene);

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);

    this.render();
  }

  private configureCamera() {
    LayerService.camera.left = -this.gltfSize.x / 2;
    LayerService.camera.right = this.gltfSize.x / 2;
    LayerService.camera.top = this.gltfSize.z / 2;
    LayerService.camera.bottom = -this.gltfSize.z / 2;
    LayerService.camera.updateProjectionMatrix();

    LayerService.camera.position.set(0, this.gltfSize.y, 0);
    LayerService.camera.lookAt(0, 0, 0);
  }

  private getActualHeight(): number {
    return this.gltfBox.min.y + this.layerHeight * this.gltfSize.y;
  }

  public render() {
    LayerService.renderer.clippingPlanes = [
      this.lowerClippingPlane,
      this.upperClippingPlane,
    ];
    LayerService.renderer.render(this.scene, LayerService.camera);
    this.canvasDataUrl = LayerService.canvas.toDataURL();
  }

  public setLayerHeight(newHeight: number) {
    this.layerHeight = newHeight; // percentage (0-1)
    const actualHeight = this.getActualHeight();

    this.lowerClippingPlane.constant = -(
      actualHeight -
      this.layerThickness / 2
    );
    this.upperClippingPlane.constant = actualHeight + this.layerThickness / 2;
  }

  public getLayerHeight(): number {
    return this.layerHeight;
  }

  public setLayerThickness(newThickness: number) {
    this.layerThickness = newThickness;
    const actualHeight = this.getActualHeight();
    this.lowerClippingPlane.constant = -(actualHeight - newThickness / 2);
    this.upperClippingPlane.constant = actualHeight + newThickness / 2;
  }

  public getLayerThickness(): number {
    return this.layerThickness;
  }

  public dispose() {
    this.scene.remove(this.gltf.scene);
    this.gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            material.dispose();
          });
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
