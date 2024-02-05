"use client"

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useOrganization } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export const EmptyBoards = () => {

    const { mutate, pending } = useApiMutation(api.board.create)
    const { organization } = useOrganization()
    const router = useRouter()


    const onClick = () => {
        if (!organization) return

        mutate({
            orgId: organization.id,
            title: 'Untitled'
        })
            .then((id) => {
                toast.success('Board created')
                router.push(`/board/${id}`)
            })
            .catch(() => toast.error('Failed to create board.'))
    }

    return (
        <div className='h-full flex flex-col items-center justify-center' >
            <Image
                src='/note.svg'
                alt='Empty'
                height={110}
                width={110}
            />
            <h2 className="text-2xl font-semibold mt-6 ">Create your first board.</h2>
            <p className="text-muted-foreground text-sm mt-2">
                Start by creating a board for your organization
            </p>
            <div className='mt-6 '>
                <Button disabled={pending} onClick={onClick} size='lg' >Create board</Button>
            </div>
        </div>
    )
}
