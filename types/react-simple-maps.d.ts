declare module 'react-simple-maps' {
  import type { ComponentType, CSSProperties, ReactNode, SVGProps } from 'react'

  type GeoStyle = {
    default?: CSSProperties
    hover?: CSSProperties
    pressed?: CSSProperties
  }

  type GeographyDatum = {
    rsmKey: string
    id?: string | number
    [key: string]: unknown
  }

  export const ComposableMap: ComponentType<Record<string, unknown>>
  export const Geographies: ComponentType<{
    geography: string
    children: (data: { geographies: GeographyDatum[] }) => ReactNode
  }>
  export const Geography: ComponentType<
    {
      geography: GeographyDatum
      style?: GeoStyle
      onClick?: () => void
    } & Omit<SVGProps<SVGPathElement>, 'style'>
  >
  export const Marker: ComponentType<Record<string, unknown>>
  export const ZoomableGroup: ComponentType<Record<string, unknown>>
}
