export default function getCurrentPositions() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(coordinates);
        },
        (error) => reject(error),
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
}
