import L from "leaflet";

export const geoapifyMarkerIcon = L.icon({
  iconUrl:
    "https://api.geoapify.com/v1/icon?type=awesome&color=%2352b74c&size=x-large&icon=tree&noWhiteCircle=true&scaleFactor=2&apiKey=2f2e0cfbd9054b0da856edf3b1d44a84",
  iconSize: [45, 66], // Width and height of the icon in pixels (adjust if needed)
  iconAnchor: [22, 62], // The point of the icon which corresponds to marker's location (bottom center)
  popupAnchor: [0, -58], // Point from which the popup should open relative to iconAnchor
});

const GEOAPIFY_API_KEY = "2f2e0cfbd9054b0da856edf3b1d44a84";

export function createGeoapifyIcon(
  colorHex: string,
  iconName: string,
  iconColor: string
) {
  console.log(iconColor);
  // colorHex must be in hex format without '#', encode properly
  const color = encodeURIComponent(colorHex.replace(/^#/, ""));

  const url = `https://api.geoapify.com/v1/icon?type=awesome&color=%23${color}&size=x-large&icon=${iconName}&scaleFactor=2&apiKey=${GEOAPIFY_API_KEY}`;

  return L.icon({
    iconUrl: url,
    iconSize: [45, 66],
    iconAnchor: [22, 62],
    popupAnchor: [0, -58],
  });
}
