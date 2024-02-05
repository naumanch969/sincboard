"use client"

import { UserButton, useOrganization } from "@clerk/nextjs";
import { EmptyOrg } from "./_components/empty-org";
import { BoardList } from "./_components/board-list";

export default function Dashboard({ searchParams }: { searchParams: { search?: string, favorites?: string } }) {

  const { organization } = useOrganization()

  return (
    <div style={{ height: 'calc(100% - 80px)' }} className="flex-1 p-6 ">
      {
        !organization
          ? <EmptyOrg />
          : <BoardList
            query={searchParams}
            orgId={organization.id}
          />}

    </div>
  )
}