import { create } from 'zustand'

type State = {
	ids?: string[]
	isOpen: boolean
	onOpen: (ids: string[]) => void
	onClose: () => void
}

export const useOpenEditCategory = create<State>(set => ({
	ids: undefined,
	isOpen: false,
	onOpen: ids => set({ isOpen: true, ids }),
	onClose: () => set({ isOpen: false, ids: undefined }),
}))
