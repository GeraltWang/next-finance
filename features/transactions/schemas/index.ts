import { z } from 'zod'

export const TransactionSchema = z.object({
	amount: z.number().int(),
	payee: z.string(),
	notes: z.string().nullable().optional(),
	date: z.coerce.date(),
	accountId: z.string(),
	categoryId: z.string().nullable().optional(),
})

export const TransactionUpdateSchema = z.object({
	amount: z.number().int().optional(),
	payee: z.string().optional(),
	notes: z.string().nullable().optional(),
	date: z.coerce.date().optional(),
	accountId: z.string().optional(),
	categoryId: z.string().nullable().optional(),
})

export const TransactionFastSchema = z.object({
	amount: z.number().int(),
	payee: z.string(),
	notes: z.string().nullable().optional(),
	accountName: z.string(),
	categoryName: z.string(),
})
