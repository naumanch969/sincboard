import { colorToCss } from '@/lib/utils'
import { EllipseLayer, } from '@/types/canvas'
import React from 'react'

interface Props {
    id: string,
    layer: EllipseLayer,
    selectionColor?: string,
    onPointerDown: (e: React.PointerEvent, id: string) => void
}

export const Ellipse = ({ id, layer, onPointerDown, selectionColor }: Props) => {

    const { x, y, width, height, fill } = layer

    return (
        <ellipse
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
            cx={width / 2}
            cy={height / 2}
            rx={width / 2}
            ry={height / 2}
            strokeWidth={1}
            fill={fill ? colorToCss(fill) : "#000"}
            stroke={selectionColor || 'transparent'}
            className='drop-shadow-md'
        />
    )
}
