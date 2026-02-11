function fileURLToPath(input) {
  const value = input instanceof URL ? input.toString() : String(input);
  if (!value.startsWith("file://")) {
    throw new TypeError("The URL must be of scheme file");
  }

  return decodeURIComponent(value.slice("file://".length));
}

module.exports = {
  fileURLToPath,
  URL,
  URLSearchParams,
};
