import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Trecho } from '../../lib/itineraryGroups'
import { geocodeAll, type LatLng } from '../../lib/geocode'
import { formatDateBR } from '../../lib/date'

function numberIcon(n: number) {
  return L.divIcon({
    className: '',
    html: `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:#111;color:#fff;font:600 12px/1 -apple-system,sans-serif;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)">${n}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 11)
      return
    }
    map.fitBounds(
      points.map((p) => [p.lat, p.lng] as [number, number]),
      { padding: [28, 28] },
    )
  }, [points, map])
  return null
}

type Ponto = { trecho: Trecho; pos: LatLng }

/** Preenche 100% do container do pai — quem define o tamanho é quem usa. */
export function RouteMap({ trechos, destino }: { trechos: Trecho[]; destino: string }) {
  const [pontos, setPontos] = useState<Ponto[] | null>(null)

  const queries = useMemo(() => trechos.map((t) => `${t.base}, ${destino}`), [trechos, destino])
  const depKey = trechos.map((t) => `${t.key}:${t.base}`).join('|')

  useEffect(() => {
    let cancelado = false
    if (queries.length === 0) {
      setPontos([])
      return
    }
    geocodeAll(queries).then((mapa) => {
      if (cancelado) return
      const resolved = trechos
        .map((t, i) => {
          const pos = mapa.get(queries[i])
          return pos ? { trecho: t, pos } : null
        })
        .filter((p): p is Ponto => p !== null)
      setPontos(resolved)
    })
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey, destino])

  if (trechos.length === 0) return null

  if (pontos === null) {
    return (
      <div className="h-full w-full bg-surface-strong dark:bg-white/5 animate-pulse flex items-center justify-center">
        <p className="text-body-sm text-muted dark:text-on-dark-soft">Carregando mapa…</p>
      </div>
    )
  }

  if (pontos.length === 0) {
    return (
      <div className="h-full w-full bg-surface-strong dark:bg-white/5 flex items-center justify-center">
        <p className="text-body-sm text-muted dark:text-on-dark-soft">Mapa indisponível pra essas paradas.</p>
      </div>
    )
  }

  const linha = pontos.map((p) => [p.pos.lat, p.pos.lng] as [number, number])

  return (
    <div className="h-full w-full [&_.leaflet-container]:h-full">
      <MapContainer center={linha[0]} zoom={6} scrollWheelZoom={false} zoomControl={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={pontos.map((p) => p.pos)} />
        {linha.length > 1 && (
          <Polyline positions={linha} pathOptions={{ color: '#111827', weight: 3, opacity: 0.6, dashArray: '1 8' }} />
        )}
        {pontos.map((p, i) => (
          <Marker key={p.trecho.key} position={[p.pos.lat, p.pos.lng]} icon={numberIcon(i + 1)}>
            <Popup>
              <strong>{p.trecho.base}</strong>
              <br />
              {formatDateBR(p.trecho.dataInicio)}
              {p.trecho.dataFim !== p.trecho.dataInicio ? ` – ${formatDateBR(p.trecho.dataFim)}` : ''}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
