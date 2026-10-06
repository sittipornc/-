// ===== Water Level Monitoring Map =====
// Uses Leaflet.js + OpenStreetMap (no API key required)

// ── Station Data ──
const stationsData = [
    // กาญจนบุรี
    {
        id: "K001",
        name: "สถานี ท่าม่วง",
        province: "Kanchanaburi",
        latitude: 13.9636,
        longitude: 99.6369,
        water_height: 2.3,
        bank_height: 4.5,
        alert_level: "ปกติ",
        datetime: "2026-10-06 13:00"
    },
    {
        id: "K002",
        name: "สถานี เมืองกาญจนบุรี",
        province: "Kanchanaburi",
        latitude: 14.0043,
        longitude: 99.5328,
        water_height: 4.1,
        bank_height: 4.5,
        alert_level: "เฝ้าระวัง",
        datetime: "2026-10-06 13:00"
    },
    {
        id: "K003",
        name: "สถานี ศรีสวัสดิ์",
        province: "Kanchanaburi",
        latitude: 14.3547,
        longitude: 99.1092,
        water_height: 5.2,
        bank_height: 4.5,
        alert_level: "ล้นตลิ่ง",
        datetime: "2026-10-06 12:30"
    },
    {
        id: "K004",
        name: "สถานี ไทรโยค",
        province: "Kanchanaburi",
        latitude: 14.2150,
        longitude: 98.8467,
        water_height: 3.0,
        bank_height: 4.5,
        alert_level: "ปกติ",
        datetime: "2026-10-06 13:00"
    },
    {
        id: "K005",
        name: "สถานี พนมทวน",
        province: "Kanchanaburi",
        latitude: 13.7939,
        longitude: 99.7300,
        water_height: 4.3,
        bank_height: 4.5,
        alert_level: "เฝ้าระวัง",
        datetime: "2026-10-06 12:30"
    },
    // ราชบุรี
    {
        id: "R001",
        name: "สถานี เมืองราชบุรี",
        province: "Ratchaburi",
        latitude: 13.5352,
        longitude: 99.8234,
        water_height: 1.8,
        bank_height: 3.5,
        alert_level: "ปกติ",
        datetime: "2026-10-06 13:00"
    },
    {
        id: "R002",
        name: "สถานี โพธาราม",
        province: "Ratchaburi",
        latitude: 13.6940,
        longitude: 99.8528,
        water_height: 3.3,
        bank_height: 3.5,
        alert_level: "เฝ้าระวัง",
        datetime: "2026-10-06 12:00"
    },
    {
        id: "R003",
        name: "สถานี ปากท่อ",
        province: "Ratchaburi",
        latitude: 13.4069,
        longitude: 99.8625,
        water_height: 4.0,
        bank_height: 3.5,
        alert_level: "ล้นตลิ่ง",
        datetime: "2026-10-06 12:30"
    },
    {
        id: "R004",
        name: "สถานี ดำเนินสะดวก",
        province: "Ratchaburi",
        latitude: 13.5250,
        longitude: 99.9544,
        water_height: 2.0,
        bank_height: 3.5,
        alert_level: "ปกติ",
        datetime: "2026-10-06 13:00"
    },
    {
        id: "R005",
        name: "สถานี บ้านโป่ง",
        province: "Ratchaburi",
        latitude: 13.8167,
        longitude: 99.8833,
        water_height: 3.4,
        bank_height: 3.5,
        alert_level: "เฝ้าระวัง",
        datetime: "2026-10-06 12:00"
    }
];

// ── Province centres ──
const provinceCenters = {
    Kanchanaburi: { lat: 14.00, lng: 99.53, zoom: 10 },
    Ratchaburi:   { lat: 13.55, lng: 99.85, zoom: 11 }
};

// ── Colour helpers ──
function alertColor(level) {
    switch (level) {
        case "ปกติ":     return "#2ecc71";
        case "เฝ้าระวัง": return "#f1c40f";
        case "ล้นตลิ่ง":  return "#e74c3c";
        default:          return "#95a5a6";
    }
}

function alertClass(level) {
    switch (level) {
        case "ปกติ":     return "green";
        case "เฝ้าระวัง": return "yellow";
        case "ล้นตลิ่ง":  return "red";
        default:          return "green";
    }
}

function alertDescription(level) {
    switch (level) {
        case "ปกติ":     return "ระดับปกติ";
        case "เฝ้าระวัง": return "เฝ้าระวังใกล้ล้นตลิ่ง";
        case "ล้นตลิ่ง":  return "น้ำล้นตลิ่ง";
        default:          return "-";
    }
}

function formatDateTime(dtString) {
    if (!dtString) return "-";
    const d = new Date(dtString.replace(" ", "T"));
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear() + 543; // พ.ศ.
    const hours = d.getHours().toString().padStart(2, "0");
    const mins = d.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${mins} น.`;
}

// ── Initialise Map ──
const map = L.map("map", {
    center: [13.8, 99.6],
    zoom: 9,
    zoomControl: false
});

// Add zoom control to bottom-right
L.control.zoom({ position: "bottomright" }).addTo(map);

// ── Base Layers ──
const roadMap = L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
});

const satellite = L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
});

const hybrid = L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
});

const terrain = L.tileLayer("https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
});

// Add default layer
roadMap.addTo(map);

// Layer control
const baseLayers = {
    "🗺️ แผนที่ถนน": roadMap,
    "🛰️ ดาวเทียม": satellite,
    "🌍 ดาวเทียม + ชื่อถนน": hybrid,
    "⛰️ ภูมิประเทศ": terrain
};

L.control.layers(baseLayers, null, { position: "topright", collapsed: true }).addTo(map);

// ── Marker Layer ──
let markerLayer = L.layerGroup().addTo(map);

function clearMarkers() {
    markerLayer.clearLayers();
}

function createPulsingIcon(color, cssClass) {
    return L.divIcon({
        className: "",
        html: `
            <div style="position:relative;width:28px;height:28px;">
                <div style="
                    position:absolute;
                    top:50%;left:50%;
                    transform:translate(-50%,-50%);
                    width:28px;height:28px;
                    border-radius:50%;
                    background:${color};
                    opacity:0.3;
                    animation:pulse 2s ease-out infinite;
                "></div>
                <div style="
                    position:absolute;
                    top:50%;left:50%;
                    transform:translate(-50%,-50%);
                    width:16px;height:16px;
                    border-radius:50%;
                    background:${color};
                    border:2px solid #fff;
                    box-shadow:0 2px 8px rgba(0,0,0,0.4);
                "></div>
            </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
}

// Inject pulse animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes pulse {
        0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.4; }
        100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

function addStationMarker(station) {
    const color = alertColor(station.alert_level);
    const cls   = alertClass(station.alert_level);
    const icon  = createPulsingIcon(color, cls);

    const marker = L.marker([station.latitude, station.longitude], { icon })
        .addTo(markerLayer);

    // Click → show info panel only (no popup)
    marker.on("click", () => showInfoPanel(station));
}

// ── Info Panel ──
const infoPanel   = document.getElementById("info-panel");
const infoContent = document.getElementById("info-content");
const closeBtn    = document.getElementById("close-panel");

closeBtn.addEventListener("click", () => {
    infoPanel.classList.add("hidden");
});

function showInfoPanel(station) {
    const cls = alertClass(station.alert_level);
    const pct = Math.min((station.water_height / station.bank_height) * 100, 100);

    infoContent.innerHTML = `
        <div class="info-station-name">${station.name}</div>

        <div class="info-row">
            <span class="info-label">รหัสสถานี</span>
            <span class="info-value">${station.id}</span>
        </div>
        <div class="info-row">
            <span class="info-label">ระดับน้ำ</span>
            <span class="info-value">${station.water_height} m</span>
        </div>
        <div class="info-row">
            <span class="info-label">ความสูงตลิ่ง</span>
            <span class="info-value">${station.bank_height} m</span>
        </div>
        <div class="info-row">
            <span class="info-label">สถานะ</span>
            <span class="status-badge ${cls}">${alertDescription(station.alert_level)}</span>
        </div>
        <div class="info-row">
            <span class="info-label">วันที่-เวลา</span>
            <span class="info-value">${formatDateTime(station.datetime)}</span>
        </div>

        <div class="water-bar-container">
            <div class="water-bar-label">ระดับน้ำเทียบกับตลิ่ง (${pct.toFixed(0)}%)</div>
            <div class="water-bar-track">
                <div class="water-bar-fill ${cls}" style="width:${pct}%"></div>
            </div>
        </div>
    `;

    infoPanel.classList.remove("hidden");
}

// ── Province Selector ──
const provinceSelect = document.getElementById("province-select");
provinceSelect.addEventListener("change", () => {
    const province = provinceSelect.value;
    clearMarkers();
    infoPanel.classList.add("hidden");

    if (!province) {
        map.setView([13.8, 99.6], 9);
        return;
    }

    const centre = provinceCenters[province];
    map.flyTo([centre.lat, centre.lng], centre.zoom, { duration: 1.2 });

    const filtered = stationsData.filter(s => s.province === province);
    filtered.forEach(addStationMarker);
});
