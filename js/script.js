// Inicializar mapa centrado en Oruro
const map = L.map('map').setView([-18.586000, -67.626000], 7.5);

// Capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Capa de radiación (tiles generados en QGIS)
const radiacionTiles = L.tileLayer('../capas/radiacion/{z}/{x}/{y}.png', {
  attribution: 'Radiación solar - Proyecto SIG Oruro',
  minZoom: 6,
  maxZoom: 13
});

// Checkbox para activar/desactivar radiación
document.getElementById('radiacion').addEventListener('change', e => {
  if (e.target.checked) {
    radiacionTiles.addTo(map);
  } else {
    map.removeLayer(radiacionTiles);
  }
});

// Capa de pendiente (tiles generados en QGIS)
const pendienteTiles = L.tileLayer('../capas/pendiente/{z}/{x}/{y}.png', {
  attribution: 'Pendiente - Proyecto SIG Oruro',
  minZoom: 6,
  maxZoom: 13
});

// Checkbox para activar/desactivar pendiente
document.getElementById('pendiente').addEventListener('change', e => {
  if (e.target.checked) {
    pendienteTiles.addTo(map);
  } else {
    map.removeLayer(pendienteTiles);
  }
});

// Cargar carreteras en GeoJSON
let carreterasLayer; // declaramos la variable fuera

fetch('../capas/carreteras/carreteras.geojson')
  .then(res => res.json())
  .then(data => {
    carreterasLayer = L.geoJSON(data, {
      style: {
        color: 'blue',
        weight: 2
      },
      onEachFeature: (feature, layer) => {
        // Popup con información de carreteras
        layer.bindPopup(`${feature.properties.name}`);
      }
    });

    // Solo se añade si el checkbox está marcado
    document.getElementById('carreteras').addEventListener('change', e => {
      if (e.target.checked) carreterasLayer.addTo(map);
      else map.removeLayer(carreterasLayer);
    });
  });

// cargar capa de lineas electricas 
fetch('../capas/lineasElectricas/linElect.geojson')
  .then(res => res.json())
  .then(data => {
    const lineasLayer = L.geoJSON(data, {
      style: feature => {
        const v = feature.properties.Un; // ahora usamos el campo "Un"
        if (v == 25)  return { color: 'green',  weight: 2 };
        if (v == 69)  return { color: 'blue',   weight: 2 };
        if (v == 115) return { color: 'orange', weight: 2 };
        if (v == 230) return { color: 'red',    weight: 3 };
        return { color: 'gray', weight: 1 }; // valor por defecto
      },
      onEachFeature: (feature, layer) => {
        // Popup con información de la linea electrica
        layer.bindPopup(`Linea eléctrica de: ${feature.properties.Un} kV`);
      }
    });

    // Control con checkbox
    document.getElementById('lineas').addEventListener('change', e => {
      if (e.target.checked) lineasLayer.addTo(map);
      else map.removeLayer(lineasLayer);
    });
  });

  //Cargar capa de comunidades principales 
  fetch('../capas/ComuniPrincipales/comPrinc.geojson')
  .then(res => res.json())
  .then(data => {
    const comunidadesLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: 'yellow',
          color: 'black',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: (feature, layer) => {
        // Popup con información de la comunidad
        layer.bindPopup(`Comunidad: ${feature.properties.name}`);
      }
    });

    // Control con checkbox
    document.getElementById('comunidades').addEventListener('change', e => {
      if (e.target.checked) comunidadesLayer.addTo(map);
      else map.removeLayer(comunidadesLayer);
    });
  });

  //Capa de areas protegidas y lagos 
  fetch('../capas/zonProtLagos/zonPLag.geojson')
  .then(res => res.json())
  .then(data => {
    const areasLayer = L.geoJSON(data, {
      style: {
        color: 'darkgreen',     // borde
        weight: 2,              // grosor del borde
        fillColor: 'lightgreen',// relleno
        fillOpacity: 0.4        // transparencia
      },
      onEachFeature: (feature, layer) => {
        // Popup con información de cada área protegida
        layer.bindPopup(`Área protegida`);
      }
    });

    // Control con checkbox
    document.getElementById('areas').addEventListener('change', e => {
      if (e.target.checked) areasLayer.addTo(map);
      else map.removeLayer(areasLayer);
    });
  });

