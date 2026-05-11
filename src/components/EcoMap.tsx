import { useEffect, useRef } from "react";

type DriveItem = {
  lat: number;
  lng: number;
  name: string;
  date: string;
  address: string;
};

type PolicyItem = {
  lat: number;
  lng: number;
  state: string;
  policy: string;
  details: string;
  color: string;
};

export type MapItem = DriveItem | PolicyItem;

interface EcoMapProps {
  data: MapItem[];
  center: [number, number];
  zoom?: number;
}

export function EcoMap({ data, center, zoom = 6 }: EcoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let cancelled = false;
    let map: any;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      // Fix default marker icons (Leaflet + bundlers)
      const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
      const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
      const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

      map = L.map(containerRef.current).setView(center, zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      data.forEach((item) => {
        const marker = L.marker([item.lat, item.lng]).addTo(map);
        const popup =
          "name" in item
            ? `<div style="font-family:inherit"><b>${item.name}</b><br/>📅 ${item.date}<br/>📍 ${item.address}<br/>♻️ Accepting all electronics</div>`
            : `<div style="font-family:inherit"><b>${item.state}</b><br/>${item.color} <b>${item.policy}</b><br/>📝 ${item.details}</div>`;
        marker.bindPopup(popup);
      });
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [data, center, zoom]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl overflow-hidden border border-border shadow-soft"
      style={{ minHeight: 480 }}
    />
  );
}
