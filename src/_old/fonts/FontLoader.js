class FontLoader extends THREE.FontLoader {
  load(url) {
    return new Promise((resolve, reject) => {
      super.load(url, resolve, null, reject);
    });
  }
}

export default FontLoader;
