import { defineStore } from "pinia";
import * as THREE from "three";
import { shallowRef } from "vue";

export const useModelStore = defineStore("model", () => {
  const model = shallowRef<THREE.Object3D>();
  const modelBox = shallowRef(new THREE.Box3());
  const modelSize = shallowRef(new THREE.Vector3());
  const modelCenter = shallowRef(new THREE.Vector3());

  function setModel(object: THREE.Object3D) {
    modelBox.value = new THREE.Box3().setFromObject(object);
    modelSize.value = modelBox.value.getSize(new THREE.Vector3());
    modelCenter.value = modelBox.value.getCenter(new THREE.Vector3());

    // Center the model
    object.position.set(
      -modelCenter.value.x,
      -modelBox.value.min.y,
      -modelCenter.value.z
    );

    // Remove metalness and roughness from all meshes
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.metalness = 0;
        // child.material.roughness = 1;
        child.material.needsUpdate = true;
      }
    });

    model.value = object;
  }

  return {
    model,
    modelBox,
    modelSize,
    setModel,
  };
});
