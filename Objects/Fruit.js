import * as THREE from 'three';
import { scene } from '../Core/Scene';

const gridBoundary = 20; 

let fruit = null;
let fruitPosition = { x: 0, z: 0 };

function createFruit(x, z) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: '#e41212' });
  fruit = new THREE.Mesh(geometry, material);

  const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 'black'});
    const outline = new THREE.LineSegments(edgeGeometry, lineMaterial);
  fruit.add(outline);
  fruit.castShadow = true
  fruit.position.set(x, 0.5, z);
  scene.add(fruit);
}

function fruitSpawnPosition() {
  const x = Math.floor(Math.random() * gridBoundary - gridBoundary / 2);
  const z = Math.floor(Math.random() * gridBoundary - gridBoundary / 2);
  return { x: x, z: z };
}


export function spawnFruit() {
  let newPos = fruitSpawnPosition();
  fruitPosition = newPos;

  if (!fruit) {
    createFruit(newPos.x, newPos.z);
  } else {
    fruit.position.set(newPos.x, 0.5, newPos.z);
  }
}


export function checkFruitCollision(snakeHead) {
  if(snakeHead.x === fruitPosition.x && snakeHead.z === fruitPosition.z)
    return true;
    else
    return false;
}