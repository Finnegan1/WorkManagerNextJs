// import { PrismaClient } from '@prisma/client';

// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }

// const prismaClientSingleton = () => {
//   return new PrismaClient({
//     log: ['query', 'info', 'warn', 'error'],
//   }).$extends({
//     query: {
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       async $allOperations({ operation, model, args, query }) {
//         const maxRetries = 5;
//         const retryDelay = 1000; // 1 second

//         for (let attempt = 1; attempt <= maxRetries; attempt++) {
//           try {
//             return await query(args);
//           } catch (error) {
//             if (attempt === maxRetries) throw error;
//             console.log(`Attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
//             await new Promise(resolve => setTimeout(resolve, retryDelay));
//           }
//         }
//       },
//     },
//   });
// };

// const prisma = global.prisma ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;