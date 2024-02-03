"use client"

import React, { ChangeEvent, useEffect, useState } from 'react'
import qs from 'query-string'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebounce } from 'usehooks-ts'

const Search = () => {

    const router = useRouter()

    const [value, setValue] = useState('')
    const debounceValue = useDebounce(value, 500)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: '/', query: { search: debounceValue }
        }, { skipEmptyString: true, skipNull: true })
        router.push(url)
    }, [debounceValue, router])

    return (
        <div className='w-full relative ' >
            <SearchIcon className='absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ' />
            <Input
                onChange={onChange}
                placeholder='Search boards'
                className='w-full max-w-[516px] pl-9 '
            />
        </div>
    )
}

export default Search