import { useEffect, useRef, useState } from 'react';

const KakaoMap = ({ schedules }) => {
  const mapContainer = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      setError('Kakao Maps API가 로드되지 않았습니다.');
      setLoading(false);
      return;
    }

    const locations = schedules.filter(s => s.location && s.location.trim() !== '');

    if (locations.length === 0) {
      setError('지도에 표시할 위치 정보가 없습니다.');
      setLoading(false);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    const coordsPromises = locations.map(item => {
      return new Promise((resolve) => {
        geocoder.addressSearch(item.location, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            resolve({
              ...item,
              lat: result[0].y,
              lng: result[0].x
            });
          } else {
            console.warn(`Failed to geocode: ${item.location}`);
            resolve(null);
          }
        });
      });
    });

    Promise.all(coordsPromises).then(results => {
      const validResults = results.filter(r => r !== null);
      
      if (validResults.length === 0) {
        setError('유효한 위치 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      initializeMap(validResults);
      setLoading(false);
    });

  }, [schedules]);

  const initializeMap = (points) => {
    if (!mapContainer.current) return;

    const mapOption = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667), // Default center (Jeju)
      level: 9
    };

    const map = new window.kakao.maps.Map(mapContainer.current, mapOption);
    const bounds = new window.kakao.maps.LatLngBounds();
    const linePath = [];

    points.forEach((point, index) => {
      const position = new window.kakao.maps.LatLng(point.lat, point.lng);
      linePath.push(position);
      bounds.extend(position);

      // Custom Overlay for numbered marker
      const content = `
        <div style="
          position: relative;
          width: 24px;
          height: 24px;
          background-color: #007AFF;
          border-radius: 50%;
          color: white;
          text-align: center;
          line-height: 24px;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
          border: 2px solid white;
        ">
          ${index + 1}
        </div>
        <div style="
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
          font-size: 11px;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          opacity: 0.9;
        ">
          ${point.title}
        </div>
      `;

      new window.kakao.maps.CustomOverlay({
        position: position,
        content: content,
        map: map,
        yAnchor: 1 // Bottom anchor
      });
    });

    // Draw Polyline
    const polyline = new window.kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 3,
      strokeColor: '#007AFF',
      strokeOpacity: 0.8,
      strokeStyle: 'solid'
    });

    polyline.setMap(map);

    // Fit bounds if there are multiple points
    if (points.length > 0) {
      map.setBounds(bounds);
    }
  };

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200 shadow-inner bg-gray-50 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10 text-gray-500 text-sm">
          지도 로딩 중...
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10 text-red-500 text-sm p-4 text-center">
          {error}
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full"></div>
    </div>
  );
};

export default KakaoMap;
