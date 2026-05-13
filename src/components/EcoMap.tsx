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

type LeafletMap = {
  remove: () => void;
};

type LeafletModule = {
  map: (element: HTMLElement) => {
    setView: (center: [number, number], zoom: number) => LeafletMap;
  };
  tileLayer: (
    url: string,
    options: { attribution: string },
  ) => {
    addTo: (map: LeafletMap) => void;
  };
  marker: (position: [number, number]) => {
    addTo: (map: LeafletMap) => {
      bindPopup: (html: string) => void;
    };
  };
  Icon: {
    Default: {
      prototype: Record<string, unknown>;
      mergeOptions: (options: {
        iconUrl: string;
        iconRetinaUrl: string;
        shadowUrl: string;
      }) => void;
    };
  };
};

export function EcoMap({ data, center, zoom = 6 }: EcoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let cancelled = false;
    let map: LeafletMap | undefined;

    (async () => {
      const L = (await import("leaflet")).default as unknown as LeafletModule;
      if (cancelled || !containerRef.current) return;

      const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
      const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
      const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

      map = L.map(containerRef.current).setView(center, zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "OpenStreetMap contributors",
      }).addTo(map);

      data.forEach((item) => {
        const marker = L.marker([item.lat, item.lng]).addTo(map!);
        const popup =
          "name" in item
            ? `<div style="font-family:inherit"><b>${item.name}</b><br/>Date: ${item.date}<br/>Location: ${item.address}<br/>Accepting appliances and household e-waste</div>`
            : `<div style="font-family:inherit"><b>${item.state}</b><br/>${item.color} <b>${item.policy}</b><br/>Details: ${item.details}</div>`;
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
      className="h-full w-full overflow-hidden rounded-2xl border border-border shadow-soft"
      style={{ minHeight: 480 }}
    />
  );
}
