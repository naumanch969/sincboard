"use client"

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { OrganizationSwitcher } from '@clerk/nextjs'
import { Layout, Star } from 'lucide-react'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const font = Poppins({
    subsets: ["latin"],
    weight: ['600']
})

const OrgSidebar = () => {

    const searchParams = useSearchParams()
    const favorites = searchParams.get('favorites')

    return (
        <div className='hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5 ' >
            <Link href='/'>
                <div className="flex items-center gap-x-2">
                    <Image
                        src='/logo.png'
                        alt='Logo'
                        width={180}
                        height={150}
                    />
                    {/* <span className={cn('font-semibold text-2xl', font.className)}>Boardy</span> */}
                </div>
            </Link>
            <OrganizationSwitcher
                hidePersonal
                appearance={{
                    elements: {
                        rootBox: {
                            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'
                        },
                        organizationSwitcherTrigger: {
                            padding: '6px', width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb', justifyContent: 'space-between', backgroundColor: 'white'
                        }
                    }
                }}
            />
            <div className="space-y-1 w-full">
                <Button variant={favorites ? 'ghost' : 'secondary'} size='lg' asChild className='font-normal justify-start px-2 w-full ' >
                    <Link href='/'><Layout className='h-4 w-4 mr-2' />
                        Team boards
                    </Link>
                </Button>
                <Button variant={favorites ? 'secondary' : 'ghost'} size='lg' asChild className='font-normal justify-start px-2 w-full ' >
                    <Link href={{ pathname: '/', query: { favorites: true } }}><Star className='h-4 w-4 mr-2' />
                        Favourite boards
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default OrgSidebar