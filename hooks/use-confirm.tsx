import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'

export const useConfirm = (
	title: string,
	message: string
): [({ children }: { children?: React.ReactNode }) => JSX.Element, () => Promise<boolean>] => {
	const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

	const confirm = (): Promise<boolean> =>
		new Promise((resolve, reject) => {
			setPromise({ resolve })
		})

	const handleClose = () => {
		setPromise(null)
	}

	const handleConfirm = () => {
		promise?.resolve(true)
		handleClose()
	}

	const handleCancel = () => {
		promise?.resolve(false)
		handleClose()
	}

	const ConfirmationDialog = ({ children }: { children?: React.ReactNode }) => {
		return (
			<Dialog open={promise !== null} onOpenChange={handleClose}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{message}</DialogDescription>
					</DialogHeader>
					{children}
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
