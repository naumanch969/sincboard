"use client"

import Loading from '@/components/auth/loading'
import { ClerkProvider, useAuth } from '@clerk/nextjs'

import { AuthLoading, Authenticated, ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!

const convex = new ConvexReactClient(convexUrl)

export const ConvexClientProvider = ({ children }: Props) => {

    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex} >
                <Authenticated>
                    {children}
                </Authenticated>
                <AuthLoading>
                    <Loading />
                </AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}
