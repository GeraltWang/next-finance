'use client'
import { useMemo } from 'react'
import { SingleValue, StylesConfig } from 'react-select'
import CreatableSelect from 'react-select/creatable'

type Props = {
	onChange: (value?: string) => void
	onCreate?: (value: string) => void
	value?: string | null
	options?: { label: string; value: string }[]
	disabled?: boolean
	placeholder?: string
}

export const CommonSelect = ({
	onChange,
	onCreate,
	value,
	options = [],
	disabled,
	placeholder,
}: Props) => {
	const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
		onChange(option?.value)
	}

	const formattedValue = useMemo(() => {
		return options.find(option => option.value === value)
	}, [options, value])

	const customStyles: StylesConfig<{ label: string; value: string }, false> = {
		control: base => ({
			...base,
			borderColor: '#e2e8f0',
			':hover': {
				borderColor: '#e2e8f0',
			},
		}),
	}

	return (
		<CreatableSelect
			className='h-10 text-sm'
			styles={customStyles}
			value={formattedValue}
			onChange={onSelect}
			options={options}
			onCreateOption={onCreate}
			isDisabled={disabled}
			placeholder={placeholder}
		/>
	)
}
