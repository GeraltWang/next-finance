// import { Pool } from '@neondatabase/serverless'
// import { PrismaNeon } from '@prisma/adapter-neon'
// import { PrismaClient } from '@prisma/client'

// declare global {
// 	// eslint-disable-next-line no-var
// 	var cachedPrisma: PrismaClient
// }

// let prisma: PrismaClient
// if (process.env.NODE_ENV === 'production') {
// 	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// 	const adapter = new PrismaNeon(pool)
// 	prisma = new PrismaClient({ adapter })
// } else {
// 	if (!global.cachedPrisma) {
// 		const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// 		const adapter = new PrismaNeon(pool)
// 		global.cachedPrisma = new PrismaClient({ adapter })
// 	}
// 	prisma = global.cachedPrisma
// }

// export default prisma

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
	return new PrismaClient()
}

declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
