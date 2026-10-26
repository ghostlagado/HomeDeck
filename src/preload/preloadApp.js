export async function preloadApp({
  images = [],
  fonts = [],
} = {}) {
  const imageTasks = images.map(
    (src) =>
      new Promise((resolve) => {
        const image = new Image();

        image.onload = () => resolve({
          src,
          loaded: true,
        });

        image.onerror = () => resolve({
          src,
          loaded: false,
        });

        image.src = src;

        // Reutiliza imagens já disponíveis no cache.
        if (image.complete) {
          resolve({
            src,
            loaded: image.naturalWidth > 0,
          });
        }
      })
  );

  const fontTasks = fonts.map(async (font) => {
    try {
      await document.fonts.load(font);

      return {
        font,
        loaded: true,
      };
    } catch {
      return {
        font,
        loaded: false,
      };
    }
  });

  const tasks = [
    ...imageTasks,
    ...fontTasks,
    document.fonts.ready,
  ];

  return Promise.allSettled(tasks);
}