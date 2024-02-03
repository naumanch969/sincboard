import Image from 'next/image'
import React from 'react'

const Loading = () => {
    return (
        <div className='h-full w-full flex flex-col gap-y-4 justify-center items-center' >
            <Image
                src='/logo.png'
                alt='Logo'
                width={240}
                height={240}
                className='animate-pulse duration-700'
            />
        </div>
    )
}

export default Loading