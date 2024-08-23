import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImportTable } from './ImportTable'
import { convertAmountToMiliunits } from '@/lib/utils'
import dayjs from 'dayjs'

type Props = {
	data: string[][]
	onCancel: () => void
	onSubmit: (data: any) => void
}

// csv 导入的日期格式
// const acceptDateFormat = 'MMMM d, yyyy h:mm a'
// const acceptDateFormat = 'YYYY/MM/DD HH:mm'
// 数据库存储的日期格式
// const outputDateFormat = 'yyyy-MM-dd'
const outputDateFormat = 'YYYY-MM-DD HH:mm'
// 必填字段 金额 时间 收款人 备注
const requiredFields = ['amount', 'payee', 'date', 'notes']
interface SelectedColumnsState {
	[key: string]: string | null
}

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
	const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({})
	// csv 文件的第一行是表头
	const headers = data[0]
	// 第一行之后全部都是数据
	const body = data.slice(1)

	const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
		setSelectedColumns(pre => {
			// 保存当前选择的列
			const newSelectedColumns = { ...pre }
			// 新选中的选项的值
			let newValue = value
			// 循环所有已选择的列 如果新选中的选项已经被选择了 就取消之前的选择
			for (const key in newSelectedColumns) {
				if (newSelectedColumns[key] === newValue) {
					newSelectedColumns[key] = null
				}
			}
			// 如果选择的是 skip 就设置为 null
			if (newValue === 'skip') {
				newValue = null
			}
			// 保存新的选择
			newSelectedColumns[`column_${columnIndex}`] = newValue
			return newSelectedColumns
		})
	}

	const progress = Object.values(selectedColumns).filter(Boolean).length

	const handleContinue = () => {
		const getColumnIndex = (columnKey: string) => {
			return columnKey.split('_')[1]
		}

		const mappedData = {
			headers: headers.map((_header, index) => {
				const columnIndex = getColumnIndex(`column_${index}`)
				return selectedColumns[`column_${columnIndex}`] || null
			}),
			body: body
				.map(row => {
					const transformedRow = row.map((cell, cellIndex) => {
						const columnIndex = getColumnIndex(`column_${cellIndex}`)
						return selectedColumns[`column_${columnIndex}`] ? cell : null
					})
					return transformedRow.every(item => item === null) ? [] : transformedRow
				})
				.filter(row => row.length > 0),
		}
		console.log('🚀 ~ handleContinue ~ mappedData:', mappedData)

		const arrayOfData = mappedData.body.map(row => {
			return row.reduce((acc: any, cell, index) => {
				const header = mappedData.headers[index]
				if (header !== null) {
					acc[header] = cell
				}
				return acc
			}, {})
		})
		console.log('🚀 ~ arrayOfData ~ arrayOfData:', arrayOfData)

		const formattedData = arrayOfData.map(item => {
			return {
				...item,
				amount: convertAmountToMiliunits(parseFloat(item.amount)),
				// date: format(parse(item.date, acceptDateFormat, new Date()), outputDateFormat),
				date: dayjs(item.date).format(outputDateFormat),
			}
		})
		console.log('🚀 ~ formattedData ~ formattedData:', formattedData)

		onSubmit(formattedData)
	}

	return (
		<section className='mx-auto -mt-24 w-full max-w-screen-2xl pb-10'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='line-clamp-1 text-xl'>Import Transaction</CardTitle>
					<div className='flex flex-col items-center gap-2 lg:flex-row'>
						<Button className='w-full lg:w-auto' size={'sm'} onClick={onCancel}>
							Cancel
						</Button>
						<Button
							className='w-full lg:w-auto'
							size={'sm'}
							disabled={progress < requiredFields.length}
							onClick={handleContinue}
						>
							Continue ({progress}/{requiredFields.length})
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<ImportTable
						headers={headers}
						body={body}
						selectedColumns={selectedColumns}
						onTableHeadSelectChange={onTableHeadSelectChange}
					/>
				</CardContent>
			</Card>
		</section>
	)
}
