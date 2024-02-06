"use client"

import { connectionIdToColor } from '@/lib/utils'
import { useOther } from '@/liveblocks.config'
import { MousePointer2 } from 'lucide-react'
import React, { memo } from 'react'


export const Cursor = memo(({ connectionId }: { connectionId: number }) => {
    // connectionId = connected user connection Id
    const info = useOther(connectionId, user => user?.info)
    const cursor = useOther(connectionId, user => user.presence.cursor)

    const name = info?.name!

    if (!cursor) return null

    const { x, y } = cursor

    return (
        <foreignObject
            style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
            width={name.length * 10 + 24}   // 24 is for paddingX
            height={50}
            className='relative drop-shadow-md'
        >
            <MousePointer2 className='h-5 w-5' style={{ fill: connectionIdToColor(connectionId), color: connectionIdToColor(connectionId) }} />
            <div
                className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold "
                style={{ backgroundColor: connectionIdToColor(connectionId) }}
            >{name}</div>
        </foreignObject>
    )
})

Cursor.displayName = 'Cursor'