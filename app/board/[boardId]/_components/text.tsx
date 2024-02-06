"use client"

import { cn, colorToCss } from '@/lib/utils'
import { useMutation } from '@/liveblocks.config'
import { TextLayer } from '@/types/canvas'
import { Kalam } from 'next/font/google'
import React from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

const font = Kalam({
    subsets: ["latin"],
    weight: ["400"]

})

const calculateFontSize = (width: number, height: number) => {
    const MAXFONTSIZE = 96;
    const scaleFactor = 0.3
    const fontSizeBasedOnWidth = width * scaleFactor;
    const fontSizeBasedOnHeight = height * scaleFactor;
    return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, MAXFONTSIZE)
}

interface Props {
    id: string,
    layer: TextLayer,
    onPointerDown: (e: React.PointerEvent, id: string) => void,
    selectionColor?: string
}

export const Text = ({ id, layer, onPointerDown, selectionColor }: Props) => {

    const { x, y, width, height, fill, value } = layer

    // To udpate text across each connected user
    const udpateValue = useMutation(({ storage }, newValue: string) => {
        const liveLayers = storage.get('layers')
        liveLayers.get(id)?.set('value', newValue)
    }, [])

    const handleContentChange = (e: ContentEditableEvent) => {
        udpateValue(e.target.value)
    }

    return (
        // Why foreignObject - because we are rendering it inside svg 
        <foreignObject
            x={x}
            y={y}
            width={width}
            height={height}
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                outline: selectionColor ? `1px solid ${selectionColor}` : 'none'
            }}
        >
            <ContentEditable
                html={value || "Text"}
                className={cn(
                    'w-full h-full flex items-center justify-center text-center drop-shadow-md outline-md ',
                    font.className
                )}
                style={{
                    color: fill ? colorToCss(fill) : '#000',
                    fontSize: calculateFontSize(width, height)
                }}
                onChange={handleContentChange}
            />
        </foreignObject>
    )
}
