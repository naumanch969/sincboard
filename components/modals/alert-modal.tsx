"use client"

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useAlertModal } from '@/store/use-alert-modal'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { Button } from '../ui/button'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export const AlertModal = () => {

    const { isOpen, initialValues, onClose, } = useAlertModal()
    const { mutate, pending } = useApiMutation(api.board.remove)
    const router = useRouter()


    const onSubmit = () => {
        mutate({ id: initialValues.id })
            .then((id) => toast.success('Board deleted'))
            .catch((error) => toast.error('Failed to delete board.'))
        onClose();
        router.push('/')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete board</DialogTitle>
                </DialogHeader>
                <DialogDescription>This action will delete board and all of its content.</DialogDescription>
                <DialogFooter className='pt-6 space-x-2 flex items-center justify-end w-full ' >
                    <Button
                        disabled={pending}
                        variant='outline'
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={pending}
                        variant='destructive'
                        onClick={onSubmit}
                    >
                        Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}