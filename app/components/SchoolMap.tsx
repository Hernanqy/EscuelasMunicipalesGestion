"use client";

import { useEffect, useRef } from "react";
import type { School } from "../data";

export default function SchoolMap({ schools, selected, onSelect, focusSelected = true }: { schools: School[]; selected: School | null; onSelect: (school: School) => void; focusSelected?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);

  useEffect(() => {
    let active = true;
    void import("leaflet").then((L) => {
      if (!active || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, { zoomControl: false, scrollWheelZoom: true }).setView([-36.897, -60.319], 13);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(map);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      window.setTimeout(() => map.invalidateSize(), 50);
    });
    return () => { active = false; mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !mapRef.current || !layerRef.current) return;
      layerRef.current.clearLayers();
      const bounds: [number, number][] = [];
      schools.forEach((school) => {
        const isSelected = selected?.id === school.id;
        const icon = L.divIcon({ className: "school-map-marker-wrap", html: `<span class="school-map-marker${isSelected ? " is-selected" : ""}" style="--marker:${school.color}"><span>${school.shortName.charAt(0)}</span></span>`, iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36], iconAnchor: [isSelected ? 22 : 18, isSelected ? 42 : 34] });
        const marker = L.marker([school.lat, school.lng], { icon, title: school.name });
        marker.on("click", () => onSelect(school));
        marker.bindTooltip(school.shortName, { direction: "top", offset: [0, -30] });
        marker.addTo(layerRef.current!);
        bounds.push([school.lat, school.lng]);
      });
      if (selected && focusSelected) mapRef.current.flyTo([selected.lat, selected.lng], Math.max(mapRef.current.getZoom(), 15), { duration: 0.6 });
      else if (bounds.length > 1) mapRef.current.fitBounds(bounds, { padding: [44, 44], maxZoom: 14 });
    });
    return () => { cancelled = true; };
  }, [schools, selected, onSelect, focusSelected]);

  return <div ref={containerRef} className="school-map" aria-label="Mapa interactivo de escuelas artísticas" />;
}
