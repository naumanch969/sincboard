"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { MouseEvent } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Overlay } from './overlay'
import { useAuth } from '@clerk/nextjs'
import { Footer } from './footer'
import { Skeleton } from '@/components/ui/skeleton'
import { Actions } from '@/components/actions'
import { MoreHorizontal } from 'lucide-react'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

interface Props {
    id: string,
    title: string,
    imageUrl: string,
    authorId: string,
    authorName: string,
    createdAt: number,
    orgId: string,
    isFavorite: boolean,
}

export const BoardCard = ({ id, title, imageUrl, authorId, authorName, createdAt, isFavorite, orgId }: Props) => {

    const { userId } = useAuth()
    const {
        mutate: onFavoriteMutate,
        // pending: pendingFavorite
    } = useApiMutation(api.board.favorite)
    const {
        mutate: onUnfavoriteMutate,
        // pending: pendingUnfavorite
    } = useApiMutation(api.board.unfavorite)

    const authorLabel = userId == authorId ? 'You' : authorName
    const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true })

    const toggleFavorite = () => {
        if (isFavorite) {
            onUnfavoriteMutate({ id })
                .catch((error) => { toast.error('Failed to unfavorite.'); console.log(error) })
        }
        else {
            onFavoriteMutate({ id })
                .catch((error) => { toast.error('Failed to favorite.'); console.log(error) })
        }
    }

    return (
        <Link href={`/board/${id}`} className=' ' >
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden "  >
                <div className="relative flex-1 bg-amber-50">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className='object-fit'
                    />
                    <Overlay />
                    <Actions
                        id={id}
                        title={title}
                        side='right'
                    >
                        <button className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none ' ><MoreHorizontal className='text-white opacity-75 hover:opacity-100 transition-opacity' /></button>
                    </Actions>
                </div>

                <Footer
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={toggleFavorite}
                    disabled={false}
                />
            </div>
        </Link>
    )
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className="aspect-[100/127] rounded-lg overflow-hidden "  >
            <Skeleton className='h-full' />
        </div>
    )
}