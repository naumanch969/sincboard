"use client"

import { useStorage } from '@/liveblocks.config';
import { LayerType } from '@/types/canvas';
import React, { memo } from 'react'
import { Rectangle } from './rectangle';

interface Props {
    id: string,
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void
    selectionColor?: string;
}

export const LayerPreview = memo(({ id, onLayerPointerDown, selectionColor }: Props) => {

    const layer = useStorage(root => root.layers.get(id))

    if (!layer) return null

    switch (layer.type) {
        case LayerType.Rectangle:
            return (
                <Rectangle
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            )
        default:
            console.warn('Unknown layer type.')
            return null
    }
})

LayerPreview.displayName = 'LayerPreview'