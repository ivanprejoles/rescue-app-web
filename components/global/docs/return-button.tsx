/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

export function ReturnToCenterControl({ center, zoom = 15 }: any) {
  const map = useMap();

  useEffect(() => {
    const Control = L.Control.extend({
      onAdd: () => {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
        );

        const btn = L.DomUtil.create("a", "", container);
        btn.innerHTML = "𖦏"; // icon
        btn.href = "#";
        btn.title = "Return to center";

        L.DomEvent.on(btn, "click", (e) => {
          L.DomEvent.preventDefault(e);
          map.setView(center, zoom);
        });

        return container;
      },
    });

    const instance = new Control({ position: "topright" });
    instance.addTo(map);

    return () => {
      map.removeControl(instance);
    };
  }, [map, center, zoom]);

  return null;
}
