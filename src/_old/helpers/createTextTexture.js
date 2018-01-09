const DEFAULT_TEXT_TEXTURE_OPTIONS = {
  horizontalAlignment: 'left',
  verticalAlignment: 'top',
};

function measure(ctx, part, options) {
  let width = 0;

  if (typeof part === 'string') {
    width += ctx.measureText(part).width;
  } else if (Array.isArray(part)) {
    part.forEach((part) => {
      width += measure(ctx, part);
    });
  } else {
    Object.assign(ctx, part);
  }

  return width;
}

function write(ctx, part, x, y, options) {
  if (typeof part === 'string') {
    ctx.fillText(part, x, y);
    x += ctx.measureText(part).width;
  } else if (Array.isArray(part)) {
    part.forEach((part) => {
      x = write(ctx, part, x, y);
    });
  } else {
    Object.assign(ctx, part);
  }

  return x;
}

function createTextTexture(width, height, text, options) {
  options = Object.assign({}, DEFAULT_TEXT_TEXTURE_OPTIONS, options);

  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  const ctx = canvas.getContext('2d');

  let x = 0, y = 0;

  if (options.verticalAlignment === 'center') {
    ctx.textBaseline = 'middle';
    y = height / 2;
  } else if (options.verticalAlignment === 'top') {
    ctx.textBaseline = 'hanging';
  } else if (options.verticalAlignment === 'bottom') {
    ctx.textBaseline = 'bottom';
    y = height;
  }

  if (options.horizontalAlignment === 'center') {
    x = width / 2 - measure(ctx, text, options) / 2;
  } else if (options.horizontalAlignment === 'right') {
    x = width - measure(ctx, text, options);
  }

  write(ctx, text, x, y, options);

  const texture = new THREE.CanvasTexture(canvas);
  //texture.premultiplyAlpha = true;
  //texture.anisotropy = 0;

  //document.body.appendChild(canvas);

  return texture;
}

function ceilPow2( number ){
  return Math.pow(2, Math.ceil(Math.log(number) / Math.log(2)));
}

export function createTextTextureV2(width, height, text, options) {
  const textureWidth = ceilPow2(width);
  const textureHeight = ceilPow2(height);

  const texture = createTextTexture(textureWidth, textureHeight, text, options);

  /*const widthRepeat = textureWidth / width;
  const heightRepeat = textureHeight / height;

  const widthOffset = (textureWidth - width) / textureWidth / -2;
  const heightOffset = (textureHeight - height) / textureHeight / 2;

  //texture.repeat.set(widthRepeat, heightRepeat);
  //texture.offset.set(widthOffset, heightOffset);*/

  return texture;
}

export default createTextTexture;