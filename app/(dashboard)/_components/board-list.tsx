"use client"

import Image from 'next/image'
import React from 'react'
import { useQuery } from 'convex/react'
import { EmptySearch } from './empty-search'
import { EmptyFavorites } from './empty-favorites'
import { EmptyBoards } from './empty-boards'
import { api } from '@/convex/_generated/api'
import { BoardCard } from './board-card'
import { NewBoardButton } from './new-board-button'

export const BoardList = ({ orgId, query }: { orgId: string, query: { search?: string, favorites?: string } }) => {

    const data = useQuery(api.boards.get, { orgId, ...query })

    if (data == undefined) return (
        <div className='' >
            <h2 className="text-3xl">
                {query.favorites ? 'Favorite boards' : 'Team boards'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10 ">
                <NewBoardButton orgId={orgId} disabled />
                <BoardCard.Skeleton />
                <BoardCard.Skeleton />
                <BoardCard.Skeleton />
                <BoardCard.Skeleton />
                <BoardCard.Skeleton />
                <BoardCard.Skeleton />
                <BoardCard.Skeleton />
            </div>
        </div>
    )

    if (!data?.length && query.search) return <EmptySearch />
    if (!data?.length && query.favorites) return <EmptyFavorites />
    if (!data?.length) return <EmptyBoards />

    return (
        <div className='' >
            <h2 className="text-3xl">{query.favorites ? 'Favorite boards' : 'Team boards'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10 ">
                <NewBoardButton orgId={orgId} />
                {
                    data?.map((board, index) => (
                        <BoardCard
                            key={index}
                            id={board._id}
                            title={board.title}
                            imageUrl={board.imageUrl}
                            authorId={board.authorId}
                            authorName={board.authorName}
                            createdAt={board._creationTime}
                            orgId={board.orgId}
                            isFavorite={board.isFavorite}
                        />
                    ))
                }
            </div>
        </div>
    )
}
