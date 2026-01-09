import { useEffect, useRef } from 'react';

interface YandexMapProps {
  latitude?: number;
  longitude?: number;
  placeName?: string;
  zoom?: number;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMap({ 
  latitude = 61.6681, 
  longitude = 50.8357, 
  placeName = 'Сыктывкар',
  zoom = 13 
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      if (!window.ymaps) {
        console.error('Yandex Maps API not loaded');
        return;
      }

      window.ymaps.ready(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
        }

        const map = new window.ymaps.Map(mapRef.current, {
          center: [latitude, longitude],
          zoom: zoom,
          controls: ['zoomControl', 'fullscreenControl']
        });

        // Добавляем метку
        const placemark = new window.ymaps.Placemark(
          [latitude, longitude],
          {
            balloonContent: placeName,
            hintContent: placeName
          },
          {
            preset: 'islands#redDotIcon'
          }
        );

        map.geoObjects.add(placemark);
        mapInstanceRef.current = map;
      });
    };

    // Проверяем, загружен ли API
    if (window.ymaps) {
      initMap();
    } else {
      // Ждем загрузки API
      const checkYmaps = setInterval(() => {
        if (window.ymaps) {
          clearInterval(checkYmaps);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkYmaps);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, placeName, zoom]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
}
