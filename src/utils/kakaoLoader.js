export const loadKakaoSdk = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;

    if (!apiKey) {
      console.warn('VITE_KAKAO_API_KEY is not defined in .env.local');
      // Resolve anyway to prevent app crash, button will just alert user
      resolve(); 
      return;
    }

    const script = document.createElement('script');
    // libraries=services is required for Geocoder
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log('Kakao Maps SDK loaded');
        resolve();
      });
    };
    
    script.onerror = (err) => {
      console.error('Failed to load Kakao Maps SDK', err);
      reject(err);
    };

    document.head.appendChild(script);
  });
};
