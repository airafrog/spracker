import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ref } from "vue";
import type { Axis } from "../types";

export class CameraService {
  private cameraMode = ref<"perspective" | "orthographic">("perspective");
  private perspectiveOrbitControls: OrbitControls | null = null;
  private orthographicOrbitControls: OrbitControls | null = null;

  public perspectiveCamera: THREE.PerspectiveCamera;
  public orthographicCamera: THREE.OrthographicCamera;
  public camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

  constructor() {
    this.perspectiveCamera = new THREE.PerspectiveCamera();
    this.orthographicCamera = new THREE.OrthographicCamera();
    this.camera = this.perspectiveCamera;

    this.setPosition(0, 10, 10);
    this.orthographicCamera.near = -500;
    this.orthographicCamera.far = 500;
  }

  public toggleCameraMode() {
    if (this.cameraMode.value === "perspective") {
      this.cameraMode.value = "orthographic";
      this.camera = this.orthographicCamera;
    } else {
      this.cameraMode.value = "perspective";
      this.camera = this.perspectiveCamera;
    }
  }

  public enableOrbitControls(canvas: HTMLCanvasElement) {
    this.perspectiveOrbitControls = new OrbitControls(
      this.perspectiveCamera,
      canvas
    );

    this.orthographicOrbitControls = new OrbitControls(
      this.orthographicCamera,
      canvas
    );
  }

  public getCameraMode() {
    return this.cameraMode;
  }

  public resize(width: number, height: number) {
    const aspectRatio = width / height;

    this.perspectiveCamera.aspect = aspectRatio;
    this.perspectiveCamera.updateProjectionMatrix();

    this.orthographicCamera.left = -aspectRatio * 5;
    this.orthographicCamera.right = aspectRatio * 5;
    this.orthographicCamera.top = 5;
    this.orthographicCamera.bottom = -5;
    this.orthographicCamera.updateProjectionMatrix();
  }

  public setPosition(x: number, y: number, z: number) {
    this.perspectiveCamera.position.set(x, y, z);
    this.orthographicCamera.position.set(x, y, z);
    this.perspectiveCamera.lookAt(0, 0, 0);
    this.orthographicCamera.lookAt(0, 0, 0);
  }

  public viewAxis(axis: Axis, distance: number) {
    switch (axis) {
      case "x":
        this.setPosition(distance, 0, 0);
        break;
      case "y":
        this.setPosition(0, distance, 0);
        break;
      case "z":
        this.setPosition(0, 0, distance);
        break;
    }
  }

  public animate(_delta?: number) {
    if (this.perspectiveOrbitControls) this.perspectiveOrbitControls.update();
    if (this.orthographicOrbitControls) this.orthographicOrbitControls.update();
  }
}
