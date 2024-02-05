"use client"

import React from 'react'
import { UserAvatar } from './user-avatart'
import { connectionIdToColor } from '@/lib/utils';
import { useOthers, useSelf } from '@/liveblocks.config';

const MAX_SHOWN_USERS = 0;

export const Participants = () => {

    const currentUser = useSelf();
    const users = useOthers()
    const hasMoreUsers = users.length > MAX_SHOWN_USERS

    return (
        <div className='absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md' >
            <div className="flex gap-x-2">
                {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => (
                    <UserAvatar
                        key={connectionId}
                        src={info?.picture}
                        name={info?.name}
                        fallback={info?.name?.[0] || "A"}
                        borderColor={connectionIdToColor(connectionId)}
                    />
                ))}
                {currentUser && (
                    <UserAvatar
                        src={currentUser.info?.picture}
                        name={`${currentUser?.info?.name} (You) `}
                        fallback={currentUser.info?.name?.[0]}
                        borderColor={connectionIdToColor(currentUser.connectionId)}
                    />
                )}
                {
                    hasMoreUsers && (
                        <UserAvatar
                            name={`${users.length - MAX_SHOWN_USERS} more`}
                            fallback={`+${users.length - MAX_SHOWN_USERS}`}
                        />
                    )
                }
            </div>
        </div>
    )
}

export const ParticipantsSkeleton = function () {
    return (
        <div className='absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px] ' />
    )
}