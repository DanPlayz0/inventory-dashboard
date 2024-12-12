import 'server-only';

import { connection } from 'next/server';
import { prisma } from '@/data/db';

export async function getItems() {
  await connection();

  return prisma.item.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {},
  });
}

export async function getCategories() {
  await connection();

  const groupedTasks = await prisma.item.groupBy({
    by: ['category'],
  });

  console.log(groupedTasks);
  return groupedTasks;
}