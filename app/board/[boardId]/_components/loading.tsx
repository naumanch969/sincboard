import { Loader } from 'lucide-react'
import React from 'react'
import { InfoSkeleton } from './info'
import { ParticipantsSkeleton } from './participants'
import { ToolbarSkeleton } from './toolbar'

export const Loading = () => {
    return (
        <main className='w-full h-full relative bg-neutral-100 touch-none flex items-center justify-center '  >
            <Loader className='w-6 h-6 text-muted-foreground animate-spin' />
            <InfoSkeleton />
            <ParticipantsSkeleton />
            <ToolbarSkeleton />
        </main>
    )
}
