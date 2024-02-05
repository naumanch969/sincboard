"use client"

import React, { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useRenameModal } from '@/store/use-rename-modal'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

export const RenameModal = () => {

    const { isOpen, initialValues, onClose, } = useRenameModal()
    const { mutate, pending } = useApiMutation(api.board.update)
    const [title, setTitle] = useState(initialValues.title)

    useEffect(() => {
        setTitle(initialValues.title)
    }, [initialValues.title])

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        mutate({ id: initialValues.id, title })
            .then((id) => toast.success('Board Updated'))
            .catch((error) => toast.error('Failed to update board.'))
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit board title</DialogTitle>
                </DialogHeader>
                <DialogDescription>Enter a new title for this board</DialogDescription>
                <form onSubmit={onSubmit} >
                    <Input
                        disabled={pending}
                        required
                        maxLength={60}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Board title'
                    />
                    <DialogFooter className='mt-4' >
                        <DialogClose asChild >
                            <Button type='button' variant='outline' >Cancel</Button>
                        </DialogClose>
                        <Button disabled={pending} type='submit'>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
