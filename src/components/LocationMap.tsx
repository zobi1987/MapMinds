import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import geography from 'world-atlas/countries-110m.json'
import { feature } from 'topojson-client'
import type { FeatureCollection } from 'geojson'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { useState } from 'react'
import { useLanguage } from '../i18n'

const topology = geography as unknown as Topology<{
  countries: GeometryCollection
}>
const countries = feature(topology, topology.objects.countries) as FeatureCollection

interface LocationMapProps {
  coordinates: [number, number]
  label: string
}

export function LocationMap({ coordinates, label }: LocationMapProps) {
  const { copy } = useLanguage()
  const [zoom, setZoom] = useState(4)

  return (
    <div className="world-map" aria-label={`${copy.landmarkMapLabel}: ${label}`}>
      <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 150 }} width={800} height={400}>
        <ZoomableGroup
          minZoom={1}
          maxZoom={16}
          center={coordinates}
          zoom={4}
          onMove={({ zoom: nextZoom }) => setZoom(nextZoom ?? 1)}
        >
          <Geographies geography={countries}>
            {({ geographies }) => geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} className="map-country" tabIndex={-1} />
            ))}
          </Geographies>
          <Marker coordinates={coordinates}>
            <g transform={`scale(${1 / zoom})`}>
              <g className="map-marker map-marker--birth">
                <circle r={8} />
                <circle className="map-marker__pulse" r={15} />
              </g>
              <text className="map-marker__label" textAnchor="middle" y={-20}>{label}</text>
            </g>
          </Marker>
        </ZoomableGroup>
      </ComposableMap>
      <div className="map-legend" aria-hidden="true">
        <small>{copy.dragZoom}</small>
      </div>
    </div>
  )
}
