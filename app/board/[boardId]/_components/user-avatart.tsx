import { Hint } from '@/app/(dashboard)/_components/hint'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

interface Props {
    src?: string,
    name?: string,
    fallback?: string,
    borderColor?: string,
}

export const UserAvatar = ({ borderColor, fallback, name, src }: Props) => {
    return (
        <Hint label={name || 'Anonymous'} side='bottom' sideOffset={18} >
            <Avatar className='h-8 w-8 border-2' style={{ borderColor }} >
                <AvatarImage src={src} />
                <AvatarFallback className='text-xs font-semibold' >
                    {fallback}
                </AvatarFallback>
            </Avatar>
        </Hint>
    )
}
