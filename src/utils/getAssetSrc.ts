export default function getAssetSrc(path: string, includeHost: boolean = false): string {
  const hostname = process.env.NEXT_PUBLIC_HOSTNAME ?? ''
  if (path.startsWith('http') && !path.startsWith(hostname)) {
    // Src points to a different host
    return path
  } else {
    // Src points to the same host
    return includeHost ? (path.startsWith(hostname) ? path : `${hostname}${path}`) : path
  }
}
