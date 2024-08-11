import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
	data: string[][]
	onCancel: () => void
	onSubmit: (data: any) => void
}

// csv 导入的日期格式
const acceptDateFormat = 'MMMM d, yyyy h:mm a'
// 数据库存储的日期格式
const outputDateFormat = 'yyyy-MM-dd'
// 必填字段 金额 时间 收款人
const requiredFields = ['amount', 'date', 'payee']

interface SelectedColumnsState {
	[key: string]: string | null
}

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
	return (
		<section className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='text-xl line-clamp-1'>Transactions</CardTitle>
					<div className='flex items-center gap-x-2'>
						<Button size={'sm'} onClick={onCancel}>
							Cancel
						</Button>
					</div>
				</CardHeader>
				<CardContent></CardContent>
			</Card>
		</section>
	)
}
