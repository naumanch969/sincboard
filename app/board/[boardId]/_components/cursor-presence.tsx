"use client"

import { useOthersConnectionIds } from '@/liveblocks.config'
import React, { memo } from 'react'
import { Cursor } from './cursor'

const Cursors = () => {
    const connectedUserIds = useOthersConnectionIds()

    return (
        <>
            {
                connectedUserIds.map((connectionId, index) => (
                    <Cursor key={index} connectionId={connectionId} />
                ))
            }
        </>
    )
}


export const CursorsPresence = memo(() => {

    return (
        <>
            {/* Draft Pencil */}
            <Cursors />
        </>
    )
}
)

CursorsPresence.displayName = 'CursoprsPresence'