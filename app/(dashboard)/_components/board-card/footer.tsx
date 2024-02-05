import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import React from 'react'

interface Props {
    title: string,
    authorLabel: string,
    createdAtLabel: string,
    onClick: () => void,
    isFavorite: boolean,
    disabled: boolean,
}

export const Footer = ({ title, authorLabel, createdAtLabel, disabled, isFavorite, onClick }: Props) => {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()

        onClick()
    }


    return (
        <div className='relative bg-white p-3 ' >
            <p style={{ maxWidth: 'calc(100% - 20px)' }} className="text-[13px] truncate">
                {/* 20px is for favorite button */}
                {title}
            </p>
            <p className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground truncate text-[11px] ">
                {authorLabel}, {createdAtLabel}
            </p>
            <button disabled={disabled} onClick={handleClick}
                className={cn('opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600 ',
                    disabled && 'cursor-not-allowed opacity-75'
                )}
            >
                <Star className={cn('w-4 h-4', isFavorite && 'fill-blue-600 text-blue-600')} />
            </button>
        </div>
    )
}
