import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useRef, useState } from 'react'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { Select } from '@/components/Select'

export const useSelectAccount = (): [() => JSX.Element, () => Promise<any>] => {
	const accountQuery = useGetAccounts()

	const accountMutation = useCreateAccount()
	const onCreateAccount = (name: string) => {
		accountMutation.mutate({ name })
	}
	const accountOptions = (accountQuery.data ?? []).map(account => ({
		label: account.name,
		value: account.id,
	}))

	const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null)

	// 这里使用 useRef 来保存选择的值, 而不是使用 useState, 因为 useState 变化会导致hooks重新渲染
	const selectValue = useRef<string>()

	const confirm = (): Promise<any> =>
		new Promise((resolve, reject) => {
			setPromise({ resolve })
		})

	const handleClose = () => {
		setPromise(null)
	}

	const handleConfirm = () => {
		promise?.resolve(selectValue.current)
		handleClose()
	}

	const handleCancel = () => {
		promise?.resolve(undefined)
		handleClose()
	}

	const ConfirmationDialog = () => {
		return (
			<Dialog open={promise !== null}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Select Account</DialogTitle>
						<DialogDescription>Please select an account to continue.</DialogDescription>
					</DialogHeader>
					<Select
						options={accountOptions}
						onCreate={onCreateAccount}
						onChange={value => {
							selectValue.current = value
						}}
						disabled={accountQuery.isLoading || accountMutation.isPending}
						placeholder='Select an account'
					/>
					<DialogFooter className='pt-2'>
						<Button variant={'outline'} onClick={handleCancel}>
							Cancel
						</Button>
						<Button onClick={handleConfirm}>Confirm</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	return [ConfirmationDialog, confirm]
}
