"use client"

import { Hint } from '@/app/(dashboard)/_components/hint'
import { Actions } from '@/components/actions'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useRenameModal } from '@/store/use-rename-modal'
import { useQuery } from 'convex/react'
import { Menu } from 'lucide-react'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const font = Poppins({
    weight: ['600'],
    subsets: ['latin']
})

const TabSeparator = () => {
    return (
        <div className="text-neutral-300 px-1.5" />
    )
}

export const Info = ({ boardId }: { boardId: string }) => {

    const { onOpen } = useRenameModal()

    const data = useQuery(api.board.get, { id: boardId as Id<'boards'> })
    if (!data) return <InfoSkeleton />

    return (
        <div className='absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md' >
            <Hint label='Go to boards' side='bottom' sideOffset={10} >
                <Button className='px-2' variant='board' asChild >
                    <Link href='/' >
                        {/* <Image src='/logo.png' alt='Board Logo' width={40} height={40} /> */}
                        <span className={cn('font-semibold text-xl text-black ml-2', font.className)}>SyncBoard</span>
                    </Link>
                </Button>
            </Hint>
            <TabSeparator />
            <Hint label='Edit title' side='bottom' sideOffset={10}>
                <Button onClick={() => onOpen(data?._id, data?.title)} variant='board' className='text-base font-normal px-2' >{data.title}</Button>
            </Hint>
            <TabSeparator />
            <Actions id={data._id} title={data.title} side='bottom' sideOffset={10} >
                <Hint label='Main menu' >
                    <Button size='icon' variant='board' ><Menu /></Button>
                </Hint>
            </Actions>
        </div>
    )
}

export const InfoSkeleton = function InfoSkeleton() {
    return (
        <div className='absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px] ' />
    )
}