export const CELL_WIDTH = 2;
export const CELL_HEIGHT = 2.3;
export const LEVEL_HEIGHT = 0.2;

export function place(object3D, column, row = 0, level = 0) {
  object3D.position.set(row * CELL_HEIGHT, level * LEVEL_HEIGHT, column * CELL_WIDTH);
}
