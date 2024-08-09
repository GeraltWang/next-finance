import { z } from 'zod'

export const TransactionSchema = z.object({
	amount: z.number().int(),
	payee: z.string(),
	notes: z.string().nullable().optional(),
	date: z.coerce.date(),
	accountId: z.string(),
	categoryId: z.string().nullable().optional(),
})
