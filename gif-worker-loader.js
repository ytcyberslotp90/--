// This script creates a Blob URL for the gif.worker.js
// This is necessary to make the worker work when the page is loaded from a local file (file://)
const workerCode = `
    importScripts('https://cdn.jsdelivr.net/npm/gif.js.optimized/dist/gif.worker.js');
`;
const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
window.gifWorkerUrl = URL.createObjectURL(workerBlob);

// Clean up the URL when the window is closed
window.addEventListener('beforeunload', () => {
    URL.revokeObjectURL(window.gifWorkerUrl);
});