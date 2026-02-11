export const normalizeRemoteBaseDirPath = (remoteBaseDir: string) => {
  return remoteBaseDir
    .split("/")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .join("/");
};
