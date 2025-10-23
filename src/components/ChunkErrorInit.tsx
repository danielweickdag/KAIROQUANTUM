'use client';

// This component ensures chunk error handling is initialized on the client only.
// It imports the module for side effects and renders nothing.
import '@/lib/chunkErrorHandler';

export default function ChunkErrorInit() {
  return null;
}