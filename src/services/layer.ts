import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export class LayerService {
  private scene = new THREE.Scene();
  private gltf: GLTF;
  private gltfBox = new THREE.Box3();
  public gltfSize = new THREE.Vector3();
  private layerThickness = 0;
  private layerHeight = 0;
  private lowerClippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
  private upperClippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0));
  protected static canvas = document.createElement("canvas");

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
  }

  private configureCamera() {
    LayerService.camera.left = -this.gltfSize.x / 2;
    LayerService.camera.right = this.gltfSize.x / 2;
    LayerService.camera.top = this.gltfSize.z / 2;
    LayerService.camera.bottom = -this.gltfSize.z / 2;
    LayerService.camera.position.set(0, this.gltfSize.y, 0);
    LayerService.camera.lookAt(0, 0, 0);
    LayerService.camera.updateProjectionMatrix();
  }

  /**
   * Gets the actual layer height in world coordinates.
   * This is calculated as the minimum y-coordinate of the GLTF model plus the layer height
   * multiplied by the GLTF model's height.
   */
  public getActualLayerHeight(): number {
    return this.gltfBox.min.y + this.layerHeight * this.gltfSize.y;
  }

  /**
   * Renders the scene and updates the canvas data URL.
   * This method should be called whenever the layer height or thickness changes.
   */
  public render() {
    // Use the clipping planes relevant to the current layer
    LayerService.renderer.clippingPlanes = [
      this.lowerClippingPlane,
      this.upperClippingPlane,
    ];

    // Render the scene once and store the canvas data URL. The canvas will be reused for other layers
    LayerService.renderer.render(this.scene, LayerService.camera);
    return LayerService.canvas.toDataURL();
  }

  /**
   * Sets the layer height as a percentage of the GLTF model's height.
   * @param newHeight - The new height as a percentage (0-1).
   * @throws Will throw an error if the new height is not between 0 and 1.
   */
  public setLayerHeight(newHeight: number) {
    if (newHeight < 0 || newHeight > 1) {
      throw new Error("Layer height must be a percentage between 0 and 1");
    }

    this.layerHeight = newHeight; // percentage (0-1)
    const actualHeight = this.getActualLayerHeight();

    this.lowerClippingPlane.constant = -(
      actualHeight -
      this.layerThickness / 2
    );
    this.upperClippingPlane.constant = actualHeight + this.layerThickness / 2;
  }

  public getLayerHeight(): number {
    return this.layerHeight;
  }

  /**
   * Sets the layer thickness as a percentage of the GLTF model's height.
   * @param newThickness - The new thickness as a percentage (0-1).
   * @throws Will throw an error if the new thickness is not between 0 and 1.
   */
  public setLayerThickness(newThickness: number) {
    if (newThickness <= 0 || newThickness > 1) {
      throw new Error("Layer thickness must be a percentage between 0 and 1");
    }
    this.layerThickness = newThickness;

    // Calculate the world thickness based on the GLTF size and the new thickness percentage
    const actualHeight = this.getActualLayerHeight();
    const thickness = this.gltfSize.y * newThickness;

    this.lowerClippingPlane.constant = -(actualHeight - thickness / 2);
    this.upperClippingPlane.constant = actualHeight + thickness / 2;
  }

  /**
   * Gets the layer thickness as a percentage of the GLTF model's height.
   * @returns The layer thickness as a percentage (0-1).
   */
  public getLayerThickness(): number {
    return this.layerThickness;
  }

  /**
   * Disposes of the layer resources.
   */
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
