"use client"

import React, { ReactNode, useState } from 'react'
import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Edit, Link2, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { api } from '@/convex/_generated/api'
import { useRenameModal } from '@/store/use-rename-modal'
import { useAlertModal } from '@/store/use-alert-modal'

interface Props {
    children: ReactNode,
    side?: DropdownMenuContentProps['side'],
    sideOffset?: number,
    id: string,
    title: string,
}

export const Actions = ({ children, id, title, side, sideOffset }: Props) => {

    const { mutate, pending } = useApiMutation(api.board.remove)
    const { onOpen: onRenameOpen } = useRenameModal()
    const { onOpen: onAlertOpen } = useAlertModal()
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const onCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/board/${id}`)
            .then(() => toast.success('Link copied.'))
            .catch(() => toast.error('Failed to copy link.'))
    }
    const handleUpdate = () => {
        onRenameOpen(id, title)
    }
    const handleDelete = () => {
        onAlertOpen(id)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side={side}
                    sideOffset={sideOffset}
                    className='w-60'
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem onClick={onCopyLink} className='p-3 cursor-pointer ' >
                        <Link2 className='w-4 h-4 mr-2' />
                        Copy board link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleUpdate} className='p-3 cursor-pointer ' >
                        <Pencil className='w-4 h-4 mr-2 ' />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className='p-3 cursor-pointer ' >
                        <Trash2 className='w-4 h-4 mr-2 ' />
                        Delete board
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}