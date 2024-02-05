import { create } from 'zustand'

const defaultValues = {
    id: '',
}

interface Props {
    isOpen: boolean,
    initialValues: typeof defaultValues,
    onOpen: (id: string,) => void,
    onClose: () => void
}

export const useAlertModal = create<Props>((set) => ({
    isOpen: false,
    initialValues: defaultValues,
    onOpen: (id,) => set({ isOpen: true, initialValues: { id, } }),
    onClose: () => set({ isOpen: false })
}))
