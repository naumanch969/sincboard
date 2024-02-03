import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React, { ReactNode } from 'react'

export interface HingProps {
    label: string,
    children: ReactNode,
    side?: 'top' | 'bottom' | 'left' | 'right',
    align?: 'start' | 'center' | 'end',
    sideOffset?: number,
    alignOffset?: number
}

export const Hint = ({ children, side, align, sideOffset, alignOffset, label, }: HingProps) => {


    return (
        <TooltipProvider>
            <Tooltip delayDuration={100} >
                <TooltipTrigger asChild >
                    {children}
                </TooltipTrigger>
                <TooltipContent
                    className='text-white bg-black border-black'
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    alignOffset={alignOffset}
                >
                    <p className="font-semibold capitalize ">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}