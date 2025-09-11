import { useMap } from "react-leaflet";
import { useEffect } from "react";

import type { LatLngBoundsExpression } from "leaflet";

function BoundDragHandler({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.setMaxBounds(bounds);

    function onDrag() {
      map.panInsideBounds(bounds, { animate: false });
    }

    map.on("drag", onDrag);

    return () => {
      map.off("drag", onDrag);
    };
  }, [map, bounds]);

  return null;
}
export default BoundDragHandler;
