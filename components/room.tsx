"use client"

import { RoomProvider } from "@/liveblocks.config"
import { Layer } from "@/types/canvas"
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client"
import { ClientSideSuspense } from "@liveblocks/react"

import React, { ReactNode } from 'react'

export const Room = ({ children, roomId, fallback }: { children: ReactNode, roomId: string, fallback: NonNullable<ReactNode> | null }) => {
    return (
        <RoomProvider
            id={roomId}
            initialPresence={{ cursor: null, selection: [], pencilDraft: null, penColor: null }}
            initialStorage={{ layers: new LiveMap<string, LiveObject<Layer>>, layerIds: new LiveList() }}
        >
            <ClientSideSuspense fallback={fallback} >
                {() => children}
            </ClientSideSuspense>
        </RoomProvider>
    )
}
