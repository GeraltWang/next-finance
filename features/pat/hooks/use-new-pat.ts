import { create } from 'zustand'

type NewPatState = {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
}

export const useNewPat = create<NewPatState>(set => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}))
