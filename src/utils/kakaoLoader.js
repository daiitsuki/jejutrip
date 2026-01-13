export const loadKakaoSdk = () => {
  return new Promise((resolve, reject) => {
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;

    if (!apiKey) {
      console.warn('VITE_KAKAO_API_KEY is not defined in .env.local');
      resolve(); 
      return;
    }

    // 1. Load Main Kakao JS SDK (for Navi)
    const loadMainSdk = () => {
      return new Promise((res) => {
        if (window.Kakao && window.Kakao.isInitialized()) {
          res();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js';
        script.onload = () => {
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init(apiKey);
          }
          res();
        };
        document.head.appendChild(script);
      });
    };

    // 2. Load Maps SDK (for Geocoder)
    const loadMapsSdk = () => {
      return new Promise((res) => {
        if (window.kakao && window.kakao.maps) {
          res();
          return;
        }
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
        script.async = true;
        script.onload = () => {
          window.kakao.maps.load(() => res());
        };
        document.head.appendChild(script);
      });
    };

    Promise.all([loadMainSdk(), loadMapsSdk()])
      .then(() => {
        console.log('All Kakao SDKs loaded');
        resolve();
      })
      .catch(reject);
  });
};