export default function (fn) {
  return new Promise((resolve) => {
    const wait = setInterval(() => {
      if (fn()) {
        clearInterval(wait);
        resolve(null);
      }
    }, 10);
  });
}
