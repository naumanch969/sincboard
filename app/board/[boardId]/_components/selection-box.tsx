"use client"

import { useSelectionBounds } from '@/hooks/use-selection-bounds';
import { useSelf, useStorage } from '@/liveblocks.config';
import { LayerType, Side, XYWH } from '@/types/canvas'
import React, { memo } from 'react'

interface Props {
    onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({ onResizeHandlePointerDown }: Props) => {

    const soleLayerId = useSelf(me => me.presence.selection.length == 1 ? me.presence.selection[0] : null)

    const isShowingHandles = useStorage(root => soleLayerId && root.layers.get(soleLayerId)?.type != LayerType.Path)

    const bounds = useSelectionBounds()

    if (!bounds) return null

    return (
        <>
            <rect
                className='fill-transparent stroke-blue-500 stroke-1 pointer-events-none '
                style={{ transform: `translateX(${bounds.x}px) translateY(${bounds.y}px)` }}
                x={0}
                y={0}
                width={bounds.width}
                height={bounds.height}
            />
            {isShowingHandles &&
                <>
                    {/* top left */}
                    <rect
                        className='fill-white stroke-1 stroke-blue-500 '
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nwse-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `
                                translate(
                                    ${bounds.x - HANDLE_WIDTH / 2}px, 
                                    ${bounds.y - HANDLE_WIDTH / 2}px
                                )`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Top + Side.Left, bounds)
                        }}
                    />
                    {/* top */}
                    <rect
                        className='fill-white stroke-1 stroke-blue-500 '
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ns-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `
                                translate(
                                    ${bounds.x - HANDLE_WIDTH / 2 + bounds.width / 2}px, 
                                    ${bounds.y - HANDLE_WIDTH / 2}px
                                )`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Top, bounds)
                        }}
                    />
                    {/* top right */}
                    <rect
                        className='fill-white stroke-1 stroke-blue-500 '
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nesw-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `
                                translate(
                                    ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                                    ${bounds.y - HANDLE_WIDTH / 2}px
                                )`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Top + Side.Right, bounds)
                        }}
                    />
                    {/* right */}
                    <rect
                        className='fill-white stroke-1 stroke-blue-500 '
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ew-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `
                                translate(
                                    ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                                    ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px
                                )`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Right, bounds)
                        }}
                    />
                    {/* bottom right */}
                    <rect
                        className='fill-white stroke-1 stroke-blue-500 '
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nwse-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `
                                translate(
                                    ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                                    ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
                                )`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds)
                        }}
                    />
                    {/* bottom */}
                    <rect
                        className='fill-white stroke-1 stroke-blue-500 '
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ns-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `
                                translate(
                                    ${bounds.x - HANDLE_WIDTH / 2 + bounds.width / 2}px, 
                                    ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
                                )`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Bottom, bounds)
                        }}
                    />
                    {/* bottom left */}
                    <rect
                        className='fill-white stroke-1 stroke-blue-500 '
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nesw-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `
                                translate(
                                    ${bounds.x - HANDLE_WIDTH / 2}px, 
                                    ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
                                )`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds)
                        }}
                    />
                    {/* left */}
                    <rect
                        className='fill-white stroke-1 stroke-blue-500 '
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ew-resize',
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `
                                translate(
                                    ${bounds.x - HANDLE_WIDTH / 2}px, 
                                    ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px
                                )`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Left, bounds)
                        }}
                    />
                </>
            }
        </>
    )
})

SelectionBox.displayName = 'SelectionBox'



