import * as THREE from "three";

import { textureLoader } from "@/services/texture";

export class LayerService {
  private scene = new THREE.Scene();
  private modelBox = new THREE.Box3();
  public modelSize = new THREE.Vector3();
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
    LayerService.renderer.localClippingEnabled = true;
    LayerService.renderer.setClearColor(0x000000, 0);
  }

  constructor(
    model: THREE.Object3D,
    modelBox: THREE.Box3,
    modelSize: THREE.Vector3,
    layerHeight: number,
    thickness: number,
    rendererWidth: number,
    rendererHeight: number
  ) {
    this.modelBox.copy(modelBox);
    this.modelSize.copy(modelSize);
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.modelSize.x, this.modelSize.z, 1, 1),
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        transparent: true,
      })
    );

    this.setHeight(layerHeight);
    this.setThickness(thickness);
    this.setRendererSize(rendererWidth, rendererHeight);
    this.configureCamera();

    const clonedModel = this.prepareModel(model);
    this.scene.add(clonedModel);

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);
  }

  private prepareModel(model: THREE.Object3D) {
    const clonedModel = model.clone();

    // Enable clipping on all materials in the cloned scene
    clonedModel.traverse((child) => {
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

    return clonedModel;
  }

  private configureCamera() {
    LayerService.camera.left = -this.modelSize.x / 2;
    LayerService.camera.right = this.modelSize.x / 2;
    LayerService.camera.top = this.modelSize.z / 2;
    LayerService.camera.bottom = -this.modelSize.z / 2;
    LayerService.camera.position.set(0, this.modelSize.y, 0);
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
   * Sets the size of the renderer.
   * @param width The new width of the renderer.
   * @param height The new height of the renderer.
   */
  public setRendererSize(width: number, height: number) {
    LayerService.renderer.setSize(width, height);
    LayerService.canvas.width = width;
    LayerService.canvas.height = height;
  }

  /**
   * Gets the actual layer height in world coordinates.
   * This is calculated as the minimum y-coordinate of the GLTF model plus the layer height
   * multiplied by the GLTF model's height.
   */
  public getWorldHeight(): number {
    return this.modelBox.min.y + this.height * this.modelSize.y;
  }

  /**
   * Gets the thickness of the layer in world coordinates.
   * @returns The thickness of the layer in world coordinates.
   */
  public getWorldThickness(): number {
    return this.thickness * this.modelSize.y;
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
