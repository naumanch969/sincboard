"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import { LiveObject } from '@liveblocks/client'

import { Info } from './info'
import { Participants } from './participants'
import { Toolbar } from './toolbar'
import { Camera, CanvasMode, CanvasState, Color, Layer, LayerType, Point, Side, XYWH } from '@/types/canvas'
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useSelf, useStorage } from '@/liveblocks.config'
import { CursorsPresence } from './cursor-presence'
import { colorToCss, connectionIdToColor, findIntersectingLayersWithRectangle, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds } from '@/lib/utils'
import { LayerPreview } from './layer-preview'
import { SelectionBox } from './selection-box'
import { SelectionTools } from './selection-tools'
import { Path } from './path'
import { useDisableScrollBounce } from '@/hooks/use-disable-scroll-bounce'
import { useDeleteLayers } from '@/hooks/use-delete-layers'


const MAX_LAYERS = 100;
const SELECTION_NET_THRESHOLD = 5;  // // 5 is threshold (ourdefined)

export const Canvas = ({ boardId }: { boardId: string }) => {

    const layerIds = useStorage(root => root.layerIds)
    const pencilDraft = useSelf(me => me.presence.pencilDraft)

    const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None })
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
    const [lastUsedColor, setLastUsedColor] = useState<Color>({ r: 0, g: 0, b: 0 })


    useDisableScrollBounce()
    const deleteLayers = useDeleteLayers()
    // Hooks of liveblocks storage
    const history = useHistory()
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()


    // Control inserting the layer
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
    // Control translating/moving the layer
    const translateSelectedLayers = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode != CanvasMode.Translating) return

        const offset = { x: point.x - canvasState.current.x, y: point.y - canvasState.current.y }

        const liveLayers = storage.get('layers')
        for (const id of self.presence.selection) {
            const layer = liveLayers.get(id)
            if (layer)
                layer.update({ x: layer.get("x") + offset.x, y: layer.get('y') + offset.y })
        }
        setCanvasState({ mode: CanvasMode.Translating, current: point })
    }, [canvasState])
    // Control resizing the layer
    const resizeSelectedLayer = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode != CanvasMode.Resizing) return

        const bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point)

        const liveLayers = storage.get('layers')
        const layer = liveLayers.get(self.presence.selection[0])
        if (layer)
            layer.update(bounds)

    }, [canvasState])
    // Control unselecting the layer
    const unselectLayers = useMutation(({ self, setMyPresence }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true })
        }
    }, [])
    // 
    const updateSelectionNet = useMutation(({ storage, setMyPresence }, current: Point, origin: Point) => {  // We want to broadcast it to each connectedUser so thats why useMutation
        const layers = storage.get('layers').toImmutable()

        setCanvasState({
            mode: CanvasMode.SelectionNet,
            origin,
            current
        })

        const ids = findIntersectingLayersWithRectangle(layerIds, layers, origin, current)

        setMyPresence({ selection: ids })
    }, [layerIds])
    // To set mode to SelectionNet if user drag and exceed the threshold
    const startMultiSelection = useCallback((current: Point, origin: Point) => {
        if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > SELECTION_NET_THRESHOLD) {
            setCanvasState({ mode: CanvasMode.SelectionNet, origin, current })
        }
    }, [])
    // 
    const continueDrawing = useMutation(({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
        const { pencilDraft } = self.presence
        if (canvasState.mode != CanvasMode.Pencil || e.buttons != 1 || pencilDraft == null) {
            return;
        }

        setMyPresence({
            cursor: point,
            pencilDraft:
                pencilDraft.length == 1 && pencilDraft[0][0] == point.x && pencilDraft[0][1] == point.y
                    ?
                    pencilDraft
                    :
                    [...pencilDraft, [point.x, point.y, e.pressure]]
        })

    }, [canvasState.mode])
    // 
    const startDrawing = useMutation(({ setMyPresence }, point: Point, pressure: number) => {
        setMyPresence({
            pencilDraft: [[point.x, point.y, pressure]],
            penColor: lastUsedColor
        })
    }, [lastUsedColor])
    // 
    const insertPath = useMutation(({ storage, self, setMyPresence }) => {
        const liveLayers = storage.get('layers')
        const { pencilDraft } = self.presence
        if (pencilDraft == null || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS) {
            return
        }

        const id = nanoid()
        liveLayers.set(id, new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor)))

        const liveLayerIds = storage.get('layerIds')
        liveLayerIds.push(id)

        setMyPresence({ pencilDraft: null })
        setCanvasState({ mode: CanvasMode.Pencil })

    }, [lastUsedColor])


    // When user scroll on canvas
    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera(c => ({
            x: c.x - e.deltaX,  // if user scroll to right (deltaX +ve), cameraX will move to left, similarly for if user scroll to left
            y: c.y - e.deltaY   // if user scroll to up (deltaY +ve), cameraY will move to bototm, similarly for if user scroll to bottom
        }))
    }, [])
    // When user move across canvas - by holding the button or not
    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault()
        const current = pointerEventToCanvasPoint(e, camera)

        if (canvasState.mode == CanvasMode.Pressing) {  // if mouse button is pressed and moving...
            startMultiSelection(current, canvasState.origin)
        }
        else if (canvasState.mode == CanvasMode.SelectionNet) {
            updateSelectionNet(current, canvasState.origin)
        }
        else if (canvasState.mode == CanvasMode.Translating) {
            translateSelectedLayers(current)
        } else if (canvasState.mode == CanvasMode.Resizing) {
            resizeSelectedLayer(current)
        }
        else if (canvasState.mode == CanvasMode.Pencil) {
            continueDrawing(current, e)
        }

        setMyPresence({ cursor: current })
    }, [canvasState, resizeSelectedLayer, translateSelectedLayers, updateSelectionNet, startMultiSelection, camera, continueDrawing])
    // When user leave the canvas
    const onPointerLeave = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault()
        setMyPresence({ cursor: null })
    }, [])
    // When user click on canvas
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        const point = pointerEventToCanvasPoint(e, camera)
        if (canvasState.mode == CanvasMode.Inserting) return

        if (canvasState.mode == CanvasMode.Pencil) {
            startDrawing(point, e.pressure)
            return
        }

        setCanvasState({ origin: point, mode: CanvasMode.Pressing })
    }, [camera, canvasState.mode, setCanvasState, startDrawing])
    // When user release the click on canvas
    const onPointerUp = useMutation(({ }, e) => {
        const point = pointerEventToCanvasPoint(e, camera)

        if (canvasState.mode == CanvasMode.None || canvasState.mode == CanvasMode.Pressing) {
            // Unselect Layer
            unselectLayers()
            setCanvasState({ mode: CanvasMode.None })
        }
        else if (canvasState.mode == CanvasMode.Pencil) {
            insertPath()
        }
        else if (canvasState.mode == CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point)
        }
        else {
            setCanvasState({ mode: CanvasMode.None })
        }

        history.resume() // to resume recording history
    }, [camera, setCanvasState, canvasState, history, insertLayer, insertPath, unselectLayers])
    // When user click on layer
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
    // When user click on resize button of selected layer
    const onResizeHandlePointerDown = useCallback((corner: Side, initialBounds: XYWH) => {
        history.pause()
        setCanvasState({ mode: CanvasMode.Resizing, corner, initialBounds })
    }, [history])


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



    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            switch (e.key) {
                // case "Backspace":    // if backspace pressed while typing, it will remove the layer - fix it 
                //     deleteLayers()
                //     break;
                case "z": {
                    if (e.ctrlKey || e.metaKey) {
                        if (e.shiftKey)
                            history.redo()
                        else
                            history.undo()
                        break;
                    }
                }
            }
        }

        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [deleteLayers, history])

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
            <SelectionTools
                camera={camera}
                setLastUsedColor={setLastUsedColor}
            />
            <svg
                onWheel={onWheel}   // to change the camera position
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}
                className='h-[100vh] w-[100vw]'
            >
                <g style={{ transform: `translateX(${camera.x}px) translateY(${camera.y}px)` }} >
                    {/* All layers/elements on the  canvas */}
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
                    {/* Outlined box + resize buttons around selected box */}
                    <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
                    {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null &&
                        <rect
                            className='fill-blue-500/5 stroke-blue-500 stroke-1 '
                            x={Math.min(canvasState.origin.x, canvasState.current.x)}
                            y={Math.min(canvasState.origin.y, canvasState.current.y)}
                            width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                            height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                        />
                    }
                    {/* Cursor displaying on the connected user screens */}
                    <CursorsPresence />
                    {
                        pencilDraft != null && pencilDraft.length > 0 &&
                        <Path
                            points={pencilDraft}
                            fill={colorToCss(lastUsedColor)}
                            x={0}
                            y={0}
                        />
                    }
                </g>
            </svg>
        </main>
    )
}
