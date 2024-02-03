import { OrgList } from "./list"
import { NewButton } from "./new-button"

export const Sidebar = () => {

    return (
        <aside className="fixed z-[1] left-0 bg-blue-950 text-white w-[60px] h-full flex p-3 flex-col gap-y-4 ">
            <OrgList />
            <NewButton />
        </aside>
    )
}