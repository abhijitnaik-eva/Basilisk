import * as THREE from 'three';
import { scene } from '../Core/Scene';
import { spawnFruit, checkFruitCollision } from './Fruit';

const boardLimit = 10;
let score = 0;
let gameOver = false;


const scoreElement = document.getElementById('scoreValue');

const restartModal = document.getElementById('restartModal');
const restartButton = document.getElementById('restartButton');

function showRestartModal() {
  restartModal.classList.remove('hidden');
}

function hideRestartModal() {
  restartModal.classList.add('hidden');
}

let snake = [
  { x: 0, z: 0 }
];

let snakeMeshes = [];
let direction = { x: 1, z: 0 };


createSegment(0, 0);

spawnFruit();

function createSegment(x, z) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhysicalMaterial({ color: 'white' });

  const edgeGeometry = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 'black'});
  const outline = new THREE.LineSegments(edgeGeometry, lineMaterial);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0.5, z);
  mesh.add(outline);
  mesh.castShadow = true;

  scene.add(mesh);
  snakeMeshes.push(mesh);
}
export function playerMovement(keys) {
  if (keys['w'] || keys['ArrowUp'] && direction.z !== 1) {
    direction = { x: 0, z: -1 };
  }
  else if (keys['s'] || keys['ArrowDown'] && direction.z !== -1) {
    direction = { x: 0, z: 1 };
  }
  else if (keys['a'] || keys['ArrowLeft'] && direction.x !== 1) {
    direction = { x: -1, z: 0 };
  }
  else if (keys['d'] || keys['ArrowRight']&& direction.x !== -1) {
    direction = { x: 1, z: 0 };
  }
}

export function moveSnake() {
  if (gameOver) return;
  const head = snake[0];
  const newHead = {
    x: head.x + direction.x,
    z: head.z + direction.z
  };
  snake.unshift(newHead);

  if (checkFruitCollision(newHead)) {
    growSnake();
    spawnFruit();
    score += 10;
  scoreElement.textContent = score;
  } else {
    snake.pop();
  }

  checkWallCollision(newHead);
  if (checkSelfCollision()) {
    gameOver = true;
    showRestartModal();
    return;
  }

  updateMeshes();
}

function updateMeshes() {
  snake.forEach((segment, index) => {
    if (!snakeMeshes[index]) return;
    snakeMeshes[index].position.set(segment.x, 0.5, segment.z);
  });
}

export function growSnake() {
  const tail = snake[snake.length - 1];
  snake.push({ ...tail });
  createSegment(tail.x, tail.z);
}

function checkSelfCollision() {
  const head = snake[0];

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.z === snake[i].z) {
      return true;
    }
  }

  return false;
}

function checkWallCollision(position) {
  if (position.x > boardLimit) position.x = -boardLimit;
  if (position.x < -boardLimit) position.x = boardLimit;
  if (position.z > boardLimit) position.z = -boardLimit;
  if (position.z < -boardLimit) position.z = boardLimit;
}

function restartGame() {
  snakeMeshes.forEach(mesh => scene.remove(mesh));
  snake = [{ x: 0, z: 0 }];
  snakeMeshes = [];
  direction = { x: 1, z: 0 };
  score = 0;
  scoreElement.textContent = score;
  gameOver = false;
  createSegment(0, 0);
  spawnFruit();
  hideRestartModal();
}

restartButton.addEventListener('click', restartGame);