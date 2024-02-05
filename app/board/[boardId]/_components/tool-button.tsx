"use client"

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Hint } from '@/app/(dashboard)/_components/hint'
import { Button } from '@/components/ui/button'


interface Props {
    label: string,
    icon: LucideIcon,
    onClick: () => void,
    isActive?: boolean,
    isDisabled?: boolean
}

export const ToolButton = ({ icon: Icon, label, onClick, isActive, isDisabled }: Props) => {
    return (
        <Hint label={label} side='right' sideOffset={14} >
            <Button
                disabled={isDisabled}
                onClick={onClick}
                size='icon'
                variant={isActive ? 'boardActive' : 'board'}
            >
                <Icon />
            </Button>
        </Hint>
    )
}
