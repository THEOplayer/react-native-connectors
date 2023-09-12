export function toKiloBitsPerSecond(bitsPerSecond: number): number {
  return bitsPerSecond * 0.001;
}

export function bytesToBits(bytes: number): number {
  return bytes * 8;
}
