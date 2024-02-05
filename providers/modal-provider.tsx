"use client"

import { AlertModal } from '@/components/modals/alert-modal'
import { RenameModal } from '@/components/modals/rename-modal'
import React, { useEffect, useState } from 'react'

const ModalProvider = () => {

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <>
            <AlertModal />
            <RenameModal />
        </>
    )
}

export default ModalProvider