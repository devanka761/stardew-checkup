const minMajor = 1
const minMinor = 6
const minPatch = 15

export const minVersion = `v${minMajor}.${minMinor}.${minPatch}`

export function isValidGameVersion(version: string): boolean {
  const major = Number(version.split(".")[0] || 0)

  const minor = Number(version.split(".")[1] || 0)

  const patch = Number(version.split(".")[2] || 0)

  if (major < minMajor) return false

  if (minor < minMinor && major === minMajor) return false

  if (patch < minPatch && minor === minMinor && major === minMajor) return false

  return true
}
