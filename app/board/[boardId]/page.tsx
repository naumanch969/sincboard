import React from 'react'
import { Canvas } from './_components/canvas'
import { Room } from '@/components/room'
import { Loading } from './_components/loading'

const BoardIdPage = ({ params: { boardId } }: { params: { boardId: string } }) => {
    return (
        <Room roomId={boardId} fallback={<Loading />} >
            <Canvas boardId={boardId} />
        </Room>
    )
}

export default BoardIdPage