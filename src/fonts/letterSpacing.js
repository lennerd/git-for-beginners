export default function letterSpacing(font, spacing) {
  const { glyphs } = font.data;
  const spacedGylphs = {};

  for (let [char, glyph] of Object.entries(glyphs)) {
    spacedGylphs[char] = {
      ...glyph,
      ha: glyph.ha * spacing,
    };
  }

  return new THREE.Font({
    ...font.data,
    glyphs: spacedGylphs,
  });
}
