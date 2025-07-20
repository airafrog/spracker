import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

import { textureLoader } from "./texture";

export class LayerService {
  private scene = new THREE.Scene();
  private gltfBox = new THREE.Box3();
  public gltfSize = new THREE.Vector3();
  private thickness = 0;
  private height = 0;
  private lowerClippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
  private upperClippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0));
  private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
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
    LayerService.renderer.setSize(64, 64);
    LayerService.renderer.localClippingEnabled = true;
    LayerService.renderer.setClearColor(0x000000, 0); // Set clear color to black with alpha 0
  }

  constructor(gltf: GLTF, layerHeight: number, thickness: number) {
    this.gltfBox.setFromObject(gltf.scene);
    this.gltfBox.getSize(this.gltfSize);
    this.setHeight(layerHeight);
    this.setThickness(thickness);
    this.configureCamera();

    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.gltfSize.x, this.gltfSize.z, 1, 1),
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        transparent: true,
      })
    );

    const clonedScene = this.prepareGltfScene(gltf);
    this.scene.add(clonedScene);

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);
  }

  private prepareGltfScene(gltf: GLTF) {
    const clonedScene = gltf.scene.clone();

    // Enable clipping on all materials in the cloned scene
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((material) => {
            const clonedMaterial = material.clone();
            clonedMaterial.clippingPlanes = [
              this.lowerClippingPlane,
              this.upperClippingPlane,
            ];
            return clonedMaterial;
          });
        } else {
          // Clone the material to avoid conflicts between layers
          const clonedMaterial = child.material.clone();
          clonedMaterial.clippingPlanes = [
            this.lowerClippingPlane,
            this.upperClippingPlane,
          ];
          child.material = clonedMaterial;
        }
      }
    });

    return clonedScene;
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

  private updateClippingPlanes() {
    const actualHeight = this.getWorldHeight();
    const worldThickness = this.getWorldThickness();

    this.lowerClippingPlane.constant = -(actualHeight - worldThickness / 2);
    this.upperClippingPlane.constant = actualHeight + worldThickness / 2;
  }

  /**
   * Gets the actual layer height in world coordinates.
   * This is calculated as the minimum y-coordinate of the GLTF model plus the layer height
   * multiplied by the GLTF model's height.
   */
  public getWorldHeight(): number {
    return this.gltfBox.min.y + this.height * this.gltfSize.y;
  }

  /**
   * Gets the thickness of the layer in world coordinates.
   * @returns The thickness of the layer in world coordinates.
   */
  public getWorldThickness(): number {
    return this.thickness * this.gltfSize.y;
  }

  /**
   * Gets the mesh representing the layer.
   * @returns The mesh of the layer.
   */
  public getMesh(): THREE.Mesh {
    return this.mesh;
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
    const canvasDataUrl = LayerService.canvas.toDataURL();

    // Load the texture from the canvas data URL and apply it to the mesh
    const texture = textureLoader.load(canvasDataUrl);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    this.mesh.material.map = texture;
    this.mesh.material.needsUpdate = true;

    return canvasDataUrl;
  }

  /**
   * Sets the layer height as a percentage of the GLTF model's height.
   * @param height - The new height as a percentage (0-1).
   * @throws Will throw an error if the new height is not between 0 and 1.
   */
  public setHeight(height: number) {
    if (height < 0 || height > 100) {
      throw new Error("Layer height must be a percentage between 0 and 100");
    }
    this.height = height / 100;
    this.updateClippingPlanes();
  }

  /**
   * Sets the layer thickness as a percentage of the GLTF model's height.
   * @param thickness - The new thickness as a percentage (0-1).
   * @throws Will throw an error if the new thickness is not between 0 and 1.
   */
  public setThickness(thickness: number) {
    if (thickness < 1 || thickness > 100) {
      throw new Error("Layer thickness must be a percentage between 1 and 100");
    }
    this.thickness = thickness / 100;
    this.updateClippingPlanes();
  }

  /**
   * Disposes of the layer resources.
   */
  public dispose() {
    // Remove and dispose of the cloned scene
    this.scene.traverse((child) => {
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
    this.scene.clear();
  }
}
