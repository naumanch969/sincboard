import getStroke from 'perfect-freehand'
import { Point } from '@/types/canvas'
import React from 'react'
import { getSvgPathFromStroke } from '@/lib/utils'



interface Props {
    x: number,
    y: number,
    points: number[][],
    fill: string,
    onPointerDown?: (e: React.PointerEvent) => void // //
    stroke?: string,
}

export const Path = ({ fill, onPointerDown, points, x, y, stroke }: Props) => {



    return (
        <path
            className='drop-shadow-md'
            onPointerDown={onPointerDown}
            d={getSvgPathFromStroke(getStroke(points, { size: 16, thinning: 0.5, smoothing: 0.5, streamline: 0.5 }))}
            style={{ transform: `translate(${x}px, ${y}px)`, }}
            fill={fill}
            x={0}
            y={0}
            stroke={stroke}
            strokeWidth={1}
        />
    )
}
