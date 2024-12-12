import { prisma } from "@/data/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  const items = await prisma.item.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      NOT: {
        flags: {
          has: "ARCHIVED"
        }
      }
    },
  });

  const categories = new Set();
  const last_known = new Set();
  const used_for = new Set();

  for (let item of items) {
    if(item.category) categories.add(item.category);
    if(item.used_for) used_for.add(item.used_for);
    if(item.last_known) last_known.add(item.last_known);
  }

  return Response.json({
    category: categories.size > 0 ? [...categories] : [],
    last_known: last_known.size > 0 ? [...last_known] : [],
    used_for: used_for.size > 0 ? [...used_for] : []
  });
}