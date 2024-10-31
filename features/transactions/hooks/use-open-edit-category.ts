import { create } from 'zustand'
import { Table } from '@tanstack/react-table'
import type { ResponseType } from '@/features/transactions/components/table-columns'

type State = {
	ids?: string[]
	table?: Table<ResponseType>
	isOpen: boolean
	onOpen: (ids: string[], table: Table<ResponseType>) => void
	onClose: () => void
}

export const useOpenEditCategory = create<State>()(set => ({
	ids: undefined,
	table: undefined,
	isOpen: false,
	onOpen: (ids, table) => set({ isOpen: true, ids, table }),
	onClose: () => set({ isOpen: false, ids: undefined, table: undefined }),
}))
