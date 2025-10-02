import L from "leaflet";

const GEOAPIFY_API_KEY = "2f2e0cfbd9054b0da856edf3b1d44a84";

export const geoapifyMarkerIcon = L.icon({
  iconUrl: `https://api.geoapify.com/v2/icon?type=awesome&color=%2352b74c&contentColor=%23FFFF00&size=66&contentSize=40&icon=tree&noWhiteCircle&scaleFactor=2&apiKey=${GEOAPIFY_API_KEY}`,
  iconSize: [45, 66], // Width and height of the icon
  iconAnchor: [22, 62], // Point corresponding to marker location (bottom center)
  popupAnchor: [0, -58], // Point where popup opens relative to iconAnchor
});

export function createGeoapifyIcon(
  colorHex: string,
  iconName: string,
  iconColorHex: string
) {
  // Remove # and encode colors for URL
  const markerColor = encodeURIComponent(colorHex.replace(/^#/, ""));
  const iconColor = encodeURIComponent(iconColorHex.replace(/^#/, ""));

  const url =
    `https://api.geoapify.com/v2/icon?type=awesome` +
    `&color=%23${markerColor}` +
    `&size=66` +
    `&contentSize=25` +
    `&icon=${iconName}` +
    `&scaleFactor=2` +
    `&strokeColor=%23${iconColor}` +
    `&apiKey=${GEOAPIFY_API_KEY}`;

  return L.icon({
    iconUrl: url,
    iconSize: [45, 66],
    iconAnchor: [22, 62],
    popupAnchor: [0, -58],
  });
}
