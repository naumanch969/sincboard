"use client"

import { useOthersConnectionIds, useOthersMapped } from '@/liveblocks.config'
import React, { memo } from 'react'
import { Cursor } from './cursor'
import { shallow } from '@liveblocks/client'
import { Path } from './path'
import { colorToCss } from '@/lib/utils'

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
const PencilDrafts = () => {
    const others = useOthersMapped(other => ({
        pencilDraft: other.presence.pencilDraft,
        penColor: other.presence.penColor
    }), shallow)

    return (
        <>
            {
                others.map(([key, other]) => {
                    if (other.pencilDraft) {
                        return (
                            <Path
                                key={key}
                                x={0}
                                y={0}
                                points={other.pencilDraft}
                                fill={other.penColor ? colorToCss(other.penColor) : "#000"}
                            />
                        )
                    }
                    return null
                })
            }
        </>
    )
}


export const CursorsPresence = memo(() => {

    return (
        <>
            <PencilDrafts />
            <Cursors />
        </>
    )
}
)

CursorsPresence.displayName = 'CursoprsPresence'