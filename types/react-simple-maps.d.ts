declare module 'react-simple-maps' {
  import type { ComponentType, ReactNode, SVGProps } from 'react'

  export const ComposableMap: ComponentType<Record<string, unknown>>
  export const Geographies: ComponentType<{
    geography: string
    children: (data: { geographies: Array<Record<string, unknown>> }) => ReactNode
  }>
  export const Geography: ComponentType<Record<string, unknown> & SVGProps<SVGPathElement>>
  export const Marker: ComponentType<Record<string, unknown>>
  export const ZoomableGroup: ComponentType<Record<string, unknown>>
}
