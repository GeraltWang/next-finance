import { useOpenAccount } from '@/features/accounts/hooks/use-open-account'

type Props = {
	account: string
	accountId: string
}

export const AccountColumn = ({ account, accountId }: Props) => {
	const { onOpen: onOpenAccount } = useOpenAccount()

	const onClick = () => {
		onOpenAccount(accountId)
	}

	return (
		<div className='flex cursor-pointer items-center hover:underline' onClick={onClick}>
			{account}
		</div>
	)
}
