import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

const crimes = [
  {
    id: 1,
    city: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    risk: "High",
    reports: 2840,
    type: "Theft",
  },
  {
    id: 2,
    city: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    risk: "Medium",
    reports: 2140,
    type: "Fraud",
  },
  {
    id: 3,
    city: "Bengaluru",
    lat: 12.9716,
    lng: 77.5946,
    risk: "Low",
    reports: 1280,
    type: "Cyber Crime",
  },
  {
    id: 4,
    city: "Chandigarh",
    lat: 30.7333,
    lng: 76.7794,
    risk: "Low",
    reports: 640,
    type: "Robbery",
  },
  {
    id: 5,
    city: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    risk: "Medium",
    reports: 1760,
    type: "Assault",
  },
  {
    id: 6,
    city: "Hyderabad",
    lat: 17.385,
    lng: 78.4867,
    risk: "High",
    reports: 2310,
    type: "Cyber Crime",
  },
];

const riskColors = {
  High: "#ef4444",
  Medium: "#facc15",
  Low: "#22c55e",
};

export default function CrimeMap() {
  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-500/20">
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        minZoom={4}
        maxZoom={10}
        scrollWheelZoom={true}
        style={{
          height: "360px",
          width: "100%",
          background: "#020617",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {crimes.map((crime) => {
          const color = riskColors[crime.risk];

          return (
            <CircleMarker
              key={crime.id}
              center={[crime.lat, crime.lng]}
              radius={10}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.75,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[170px]">
                  <h3 className="text-base font-bold">
                    {crime.city}
                  </h3>

                  <p className="mt-1 text-sm">
                    Crime Type: {crime.type}
                  </p>

                  <p className="mt-1 text-sm">
                    Reports: {crime.reports.toLocaleString()}
                  </p>

                  <p
                    className="mt-2 font-bold"
                    style={{ color }}
                  >
                    Risk: {crime.risk}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}