"use client"

import { useOrganizationList } from '@clerk/nextjs'
import React from 'react'
import { Item } from './item'

export const OrgList = () => {

    const { userMemberships } = useOrganizationList({ userMemberships: { infinite: true } })

    if (!userMemberships.data?.length) return null

    return (
        <ul className='space-y-4 ' >
            {
                userMemberships.data?.map((membership, index) => (
                    <Item
                        key={index}
                        id={membership.organization.id}
                        name={membership.organization.name}
                        imageUrl={membership.organization.imageUrl}
                    />
                ))
            }
        </ul>
    )
}