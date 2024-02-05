import React, { ReactNode } from 'react'
import { Sidebar } from './_components/sidebar'
import OrgSidebar from './_components/org-sidebar'
import Navbar from './_components/navbar'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className='h-full' >
            <Sidebar />
            <div className="pl-[60px] w-full h-full ">
                <div className="flex gap-x-3 h-full">
                    <OrgSidebar/>
                    <div className="h-full flex-1">
                        {/* Add Navbar */}
                        <Navbar/>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DashboardLayout