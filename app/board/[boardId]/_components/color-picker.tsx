import { colorToCss } from '@/lib/utils'
import { Color } from '@/types/canvas'
import React from 'react'

export const ColorPicker = ({ onChange }: { onChange: (color: Color) => void, }) => {
    return (
        <div className='flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200' >
            <ColorButton color={{ r: 23, g: 34, b: 92 }} onClick={onChange} />
            <ColorButton color={{ r: 45, g: 67, b: 12 }} onClick={onChange} />
            <ColorButton color={{ r: 78, g: 90, b: 23 }} onClick={onChange} />
            <ColorButton color={{ r: 150, g: 30, b: 45 }} onClick={onChange} />
            <ColorButton color={{ r: 100, g: 80, b: 70 }} onClick={onChange} />
            <ColorButton color={{ r: 200, g: 150, b: 10 }} onClick={onChange} />
            <ColorButton color={{ r: 15, g: 120, b: 200 }} onClick={onChange} />
            <ColorButton color={{ r: 255, g: 0, b: 128 }} onClick={onChange} />
        </div>
    )
}


const ColorButton = ({ color, onClick }: { color: Color, onClick: (color: Color) => void }) => {
    return (
        <button
            className='w-8 h-8 items-center flex justify-center hover:opacity-75 transition '
            onClick={() => onClick(color)}
        >
            <div
                className="h-8 w-8 rounded-md border border-neutral-300"
                style={{ background: colorToCss(color) }}
            />
        </button>
    )
}