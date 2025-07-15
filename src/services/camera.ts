import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ref } from "vue";

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

    this.perspectiveCamera.position.set(0, 0, 10);
    this.perspectiveCamera.lookAt(0, 0, 0);
    this.orthographicCamera.position.set(0, 0, 10);
    this.orthographicCamera.lookAt(0, 0, 0);
    this.orthographicCamera.near = -100;
    this.orthographicCamera.far = 100;
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

  public animate(_delta?: number) {
    if (this.perspectiveOrbitControls) this.perspectiveOrbitControls.update();
    if (this.orthographicOrbitControls) this.orthographicOrbitControls.update();
  }
}
