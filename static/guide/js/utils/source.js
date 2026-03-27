function normalizeSourcePath(relativePath) {
  return `/static/guide/source/yunnan_trip_v4/${String(relativePath).replace(/^\.\//, "")}`;
}

export { normalizeSourcePath };
