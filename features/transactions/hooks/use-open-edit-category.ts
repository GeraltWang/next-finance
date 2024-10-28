import { create } from 'zustand'
import { Table } from '@tanstack/react-table'

type State<TData> = {
	ids?: string[]
	table?: Table<TData>
	isOpen: boolean
	onOpen: (ids: string[], table: Table<TData>) => void
	onClose: () => void
}

export const useOpenEditCategory = create<State<any>>(set => ({
	ids: undefined,
	table: undefined,
	isOpen: false,
	onOpen: (ids, table) => set({ isOpen: true, ids, table }),
	onClose: () => set({ isOpen: false, ids: undefined, table: undefined }),
}))
