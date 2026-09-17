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
import type { Person } from '../domain/personSchema'
import { useLanguage } from '../i18n'

const topology = geography as unknown as Topology<{
  countries: GeometryCollection
}>
const countries = feature(topology, topology.objects.countries) as FeatureCollection

interface WorldMapProps {
  person: Person
  revealNames?: boolean
}

function MapMarker({
  coordinates,
  year,
  label,
  kind,
  offsetX = 0,
  zoom,
  birthLabel,
  deathLabel,
  bcSuffix,
}: {
  coordinates: [number, number]
  year: number
  label: string
  kind: 'birth' | 'death'
  offsetX?: number
  zoom: number
  birthLabel: string
  deathLabel: string
  bcSuffix: string
}) {
  return (
    <Marker coordinates={coordinates}>
      <g transform={`translate(${offsetX / zoom} 0) scale(${1 / zoom})`}>
        <g className={`map-marker map-marker--${kind}`}>
          <circle r={8} />
          <circle className="map-marker__pulse" r={15} />
        </g>
        <text className="map-marker__label" textAnchor="middle" y={-20}>
          {kind === 'birth' ? birthLabel : deathLabel} · {Math.abs(year)}
          {year < 0 ? bcSuffix : ''}
        </text>
      </g>
      <title>{label}, {year}</title>
    </Marker>
  )
}

export function WorldMap({ person, revealNames = false }: WorldMapProps) {
  const { copy, language } = useLanguage()
  const [zoom, setZoom] = useState(1)
  const markersOverlap = person.birth.coordinates[0] === person.death.coordinates[0]
    && person.birth.coordinates[1] === person.death.coordinates[1]

  return (
    <div className="world-map" aria-label={`${copy.mapLabel}${revealNames ? `: ${person.birth.name} / ${person.death.name}` : ''}`}>
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 150 }}
        width={800}
        height={400}
      >
        <ZoomableGroup
          minZoom={1}
          maxZoom={6}
          center={[0, 12]}
          onMove={({ zoom: nextZoom }) => setZoom(nextZoom ?? 1)}
        >
          <Geographies geography={countries}>
            {({ geographies }) => geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="map-country"
                tabIndex={-1}
              />
            ))}
          </Geographies>
          <MapMarker
            coordinates={person.birth.coordinates}
            year={person.birth.year}
            label={revealNames ? person.birth.name : 'Geburtsort'}
            kind="birth"
            offsetX={markersOverlap ? -12 : 0}
            zoom={zoom}
            birthLabel={copy.birth}
            deathLabel={copy.death}
            bcSuffix={language === 'de' ? ' v. Chr.' : ' BC'}
          />
          <MapMarker
            coordinates={person.death.coordinates}
            year={person.death.year}
            label={revealNames ? person.death.name : 'Todesort'}
            kind="death"
            offsetX={markersOverlap ? 12 : 0}
            zoom={zoom}
            birthLabel={copy.birth}
            deathLabel={copy.death}
            bcSuffix={language === 'de' ? ' v. Chr.' : ' BC'}
          />
        </ZoomableGroup>
      </ComposableMap>
      <div className="map-legend" aria-hidden="true">
        <span><i className="legend-dot legend-dot--birth" /> {copy.birth}</span>
        <span><i className="legend-dot legend-dot--death" /> {copy.death}</span>
        <small>{copy.dragZoom}</small>
      </div>
    </div>
  )
}
