export default function (latitude: number, longitude: number) {
  let latitudeStr = "";
  if (latitude > 0)
    latitudeStr = `${latitude.toFixed(1)}N`;
  else
    latitudeStr = `${Math.abs(latitude).toFixed(1)}S`;

  let longitudeStr = "";
  if (longitude > 0)
    longitudeStr = `${longitude.toFixed(1)}E`;
  else
    longitudeStr = `${Math.abs(longitude).toFixed(1)}W`;

  return `${latitudeStr}, ${longitudeStr}`;
}
