import { colorToCss } from '@/lib/utils'
import { RectangleLayer } from '@/types/canvas'
import React from 'react'

interface Props {
    id: string,
    layer: RectangleLayer,
    selectionColor?: string,
    onPointerDown: (e: React.PointerEvent, id: string) => void
}

export const Rectangle = ({ id, layer, onPointerDown, selectionColor }: Props) => {


    const { x, y, width, height, fill } = layer

    return (
        <rect
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
            x={0}
            y={0}
            width={width}
            height={height}
            strokeWidth={1}
            fill={fill ? colorToCss(fill) : "#000"}
            stroke={selectionColor || 'transparent'}
            className='drop-shadow-md'
        />
    )
}
