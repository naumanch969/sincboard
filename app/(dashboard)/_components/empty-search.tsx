import Image from 'next/image'
import React from 'react'

export const EmptySearch = () => {

    return (
        <div className='h-full flex flex-col items-center justify-center' >
            <Image
                src='/empty-search.svg'
                alt='Empty'
                height={140}
                width={140}
            />
            <h2 className="text-2xl font-semibold mt-6 ">No resutls found.</h2>
            <p className='text-muted-foreground text-sm mt-2' >Try Searching for something else.</p>
        </div>
    )
}
