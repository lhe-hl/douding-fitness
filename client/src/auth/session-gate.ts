let sessionReady: Promise<void> = Promise.resolve()

export function bindSessionReady(pending: Promise<void>): void {
  sessionReady = pending
}

export function whenSessionReady(): Promise<void> {
  return sessionReady
}
