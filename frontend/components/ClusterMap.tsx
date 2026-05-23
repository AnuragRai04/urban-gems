"use client";

import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

export default function ClusterMap({ places }: { places: any[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // Prevent map from initializing twice

    // 1. Set the API Key from your .env.local file
    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || '';

    // 2. Initialize the Map
    map.current = new maptilersdk.Map({
      container: mapContainer.current!,
      style: maptilersdk.MapStyle.DATAVIZ.DARK, // A sleek dark mode map
      center: [79.9339, 23.1815], // Default center (Central India)
      zoom: 4,
    });

    map.current.on('load', () => {
      // 3. Convert your MongoDB places into GeoJSON format for the map
      const geojson = {
        type: 'FeatureCollection',
        features: places.map(place => ({
          type: 'Feature',
          geometry: place.geometry,
          properties: {
            id: place._id,
            title: place.title,
            // We pre-build the HTML for the little popup when a pin is clicked
            popUpMarkup: `
              <div class="p-2">
                <a href="/places/${place._id}" class="font-bold text-blue-600 hover:underline text-lg">${place.title}</a>
                <p class="text-gray-600 text-sm mt-1">${place.location}</p>
              </div>
            `
          }
        }))
      };

      // 4. Add the data source to the map
      map.current!.addSource('places', {
        type: 'geojson',
        data: geojson as any,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster
      });

      // 5. Draw the giant cluster circles
      map.current!.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'places',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#3b82f6', 10, '#8b5cf6', 30, '#ec4899'],
          'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 30, 25],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // 6. Draw the numbers inside the clusters
      map.current!.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'places',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 14
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      // 7. Draw the individual, unclustered pins
      map.current!.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'places',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#ef4444',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });

      // Interactivity: Click a cluster to zoom in
 // Interactivity: Click a cluster to zoom in
map.current!.on('click', 'clusters', async (e) => { // <-- Add 'async' here
  const features = map.current!.queryRenderedFeatures(e.point, { layers: ['clusters'] });
  const clusterId = features[0].properties.cluster_id;
  const source = map.current!.getSource('places') as maptilersdk.GeoJSONSource;
  
  // Await the promise instead of passing a callback function!
  const zoom = await source.getClusterExpansionZoom(clusterId);
  
  map.current!.easeTo({
    center: (features[0].geometry as any).coordinates,
    zoom: zoom
  });
});

      // Interactivity: Click an individual pin to show the popup
      map.current!.on('click', 'unclustered-point', (e) => {
        const coordinates = (e.features![0].geometry as any).coordinates.slice();
        const popUpMarkup = e.features![0].properties.popUpMarkup;

        new maptilersdk.Popup()
          .setLngLat(coordinates)
          .setHTML(popUpMarkup)
          .addTo(map.current!);
      });

      // Make cursor look like a pointer when hovering over clickable things
      map.current!.on('mouseenter', 'clusters', () => { map.current!.getCanvas().style.cursor = 'pointer'; });
      map.current!.on('mouseleave', 'clusters', () => { map.current!.getCanvas().style.cursor = ''; });
      map.current!.on('mouseenter', 'unclustered-point', () => { map.current!.getCanvas().style.cursor = 'pointer'; });
      map.current!.on('mouseleave', 'unclustered-point', () => { map.current!.getCanvas().style.cursor = ''; });
    });
  }, [places]);

  return <div ref={mapContainer} className="w-full h-full rounded-xl" />;
}