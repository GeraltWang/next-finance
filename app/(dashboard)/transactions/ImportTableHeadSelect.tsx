import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type Props = {
	columnIndex: number
	selectedColumns: Record<string, string | null>
	onChange: (columnIndex: number, value: string | null) => void
}

const options = ['amount', 'payee', 'date', 'notes']

export const ImportTableHeadSelect = ({ columnIndex, selectedColumns, onChange }: Props) => {
	const currentSelection = selectedColumns[`column_${columnIndex}`]

	return (
		<Select value={currentSelection || ''} onValueChange={value => onChange(columnIndex, value)}>
			<SelectTrigger
				className={cn(
					'border-none bg-transparent capitalize outline-none focus:ring-transparent focus:ring-offset-0',
					currentSelection && 'text-blue-500'
				)}
			>
				<SelectValue placeholder='skip' />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='skip'>skip</SelectItem>
				{options.map((option, index) => {
					const disabled =
						Object.values(selectedColumns).includes(option) &&
						selectedColumns[`column_${columnIndex}`] !== option

					return (
						<SelectItem className='capitalize' key={index} value={option} disabled={disabled}>
							{option}
						</SelectItem>
					)
				})}
			</SelectContent>
		</Select>
	)
}
