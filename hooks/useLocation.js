import { useSearchParams } from "react-router-dom";

export function useLocation() {
  const [searchParams] = useSearchParams();
  const Lat = searchParams.get("lat");
  const Lng = searchParams.get("lng");
  if (!Lat || !Lng) return [0, 0];
  return [Lat, Lng];
}
