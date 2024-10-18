import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'

export const PatToken = ({ value }: { value: string }) => {
	const token = value

	const [isTokenVisible, setIsTokenVisible] = useState(false)

	const [isCopy, setIsCopy] = useState(false)

	const handleCopy = () => {
		setIsCopy(true)
		navigator.clipboard.writeText(token)
		setTimeout(() => {
			setIsCopy(false)
		}, 1000)
	}

	return (
		<div className='flex items-center space-x-1'>
			<span className='break-all'>{isTokenVisible ? token : '••••••••'}</span>
			<Button variant={'secondary'} size={'sm'} onClick={() => setIsTokenVisible(!isTokenVisible)}>
				{isTokenVisible ? <EyeOff className='size-3' /> : <Eye className='size-3' />}
			</Button>
			<Button variant={'secondary'} size={'sm'} onClick={handleCopy}>
				{isCopy ? <Check className='size-3' /> : <Copy className='size-3' />}
			</Button>
		</div>
	)
}
