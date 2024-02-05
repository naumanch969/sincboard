"use client"

import React, { useCallback, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import { LiveObject } from '@liveblocks/client'

import { Info } from './info'
import { Participants } from './participants'
import { Toolbar } from './toolbar'
import { Camera, CanvasMode, CanvasState, Color, Layer, LayerType, Point, Side, XYWH } from '@/types/canvas'
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useStorage } from '@/liveblocks.config'
import { CursorsPresence } from './cursor-presence'
import { connectionIdToColor, pointerEventToCanvasPoint, resizeBounds } from '@/lib/utils'
import { LayerPreview } from './layer-preview'
import { SelectionBox } from './selection-box'


const MAX_LAYERS = 100;

export const Canvas = ({ boardId }: { boardId: string }) => {

    const layerIds = useStorage(root => root.layerIds)

    const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None })
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
    const [lastUsedColor, setLastUsedColor] = useState<Color>({ r: 0, g: 0, b: 0 })

    const history = useHistory()
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()

    const insertLayer = useMutation((   // ??
        { storage, setMyPresence },
        layerType: | LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
        position: Point
    ) => {
        const liveLayers = storage.get('layers')
        if (liveLayers.size >= MAX_LAYERS) return

        const liveLayerIds = storage.get('layerIds')
        const layerId = nanoid();
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            width: 100,
            height: 100,
            fill: lastUsedColor
        })

        liveLayerIds.push(layerId)
        liveLayers.set(layerId, layer)

        setMyPresence({ selection: [layerId] }, { addToHistory: true })
        setCanvasState({ mode: CanvasMode.None })

    }, [lastUsedColor])
    const resizeSelectedLayer = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode != CanvasMode.Resizing) return

        const bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point)

        const liveLayers = storage.get('layers')
        const layer = liveLayers.get(self.presence.selection[0])
        if (layer)
            layer.update(bounds)

    }, [canvasState])

    const onResizeHandlePointerDown = useCallback((corner: Side, initialBounds: XYWH) => {   // when user click the resize little box/es
        console.log({ corner, initialBounds })
        history.pause()
        setCanvasState({ mode: CanvasMode.Resizing, corner, initialBounds })
    }, [history])
    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera(c => ({
            x: c.x - e.deltaX,  // if user scroll to right (deltaX +ve), cameraX will move to left, similarly for if user scroll to left
            y: c.y - e.deltaY   // if user scroll to up (deltaY +ve), cameraY will move to bototm, similarly for if user scroll to bottom
        }))
    }, [])
    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault()
        const current = pointerEventToCanvasPoint(e, camera)

        if (canvasState.mode == CanvasMode.Resizing) {
            resizeSelectedLayer(current)
        }

        setMyPresence({ cursor: current })
    }, [canvasState, resizeSelectedLayer, camera])
    const onPointerLeave = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault()
        setMyPresence({ cursor: null })
    }, [])
    const onPointerUp = useMutation(({ }, e) => {
        const point = pointerEventToCanvasPoint(e, camera)

        if (canvasState.mode == CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point)
        }
        else {
            setCanvasState({ mode: CanvasMode.None })
        }

        history.resume() // to resume recording history
    }, [camera, canvasState, history])

    const onLayerPointerDown = useMutation((
        { self, setMyPresence },
        e: React.PointerEvent,
        layerId: string,
    ) => {
        if (canvasState.mode == CanvasMode.Pencil || canvasState.mode == CanvasMode.Inserting) return

        history.pause()
        e.stopPropagation()

        const point = pointerEventToCanvasPoint(e, camera)
        if (!self.presence.selection.includes(layerId))
            setMyPresence({ selection: [layerId] }, { addToHistory: true }) // TODO: what if user wanna select multiple layers (maybe for delete)

        setCanvasState({ mode: CanvasMode.Translating, current: point })

    }, [setCanvasState, camera, history, canvasState.mode])

    const selections = useOthersMapped(other => other.presence.selection)
    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {}
        for (const user of selections) {
            const [connectionId, selection] = user  // 
            console.log('selectionId', selection, connectionId)
            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
            }
        }
        return layerIdsToColorSelection
    }, [selections])

    return (
        <main className='w-full h-full relative bg-neutral-100 touch-none' >
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canUndo={canUndo}
                canRedo={canRedo}
                undo={history.undo}
                redo={history.redo}
            />
            <svg
                onWheel={onWheel}   // to change the camera position
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                className='h-[100vh] w-[100vw]'
            >
                <g style={{ transform: `translateX(${camera.x}px) translateY(${camera.y}px)` }} >
                    {
                        layerIds.map((layerId, index) => (
                            <LayerPreview
                                key={index}
                                id={layerId}
                                onLayerPointerDown={onLayerPointerDown}
                                selectionColor={layerIdsToColorSelection[layerId]}
                            />
                        ))
                    }
                    <SelectionBox
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                    <CursorsPresence />
                </g>
            </svg>
        </main>
    )
}
