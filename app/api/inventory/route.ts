import { prisma } from "@/data/db";
import { Item } from "@prisma/client";
import { z } from "zod";

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

  return Response.json(items || []);
}

const createItemValidator = z.strictObject({
  name: z.string().min(1),
  category: z.string().optional(),
  last_known: z.string().optional(),
  notes: z.string().optional(),
  project: z.string().optional(),
  quantity: z.number().default(1),
  used_for: z.string().optional()
})

export async function POST(req: Request) {
  const data = await req.json();

  const body = createItemValidator.safeParse(data);
  if (!body.success) return Response.json({ data: body.error.errors }, { status: 400 });

  await prisma.item.create({
    data: body.data
  })

  return Response.json({ success: true });
}

const modifyItemValidator = createItemValidator.extend({
  id: z.string()
})

export async function PATCH(req: Request) {
  const data = await req.json();

  const body = modifyItemValidator.safeParse(data);
  if (!body.success) return Response.json({ data: body.error.errors }, { status: 400 });

  await prisma.item.create({
    data: body.data
  })

  return Response.json({ success: true });
}

const deleteItemValidator = z.object({
  id: z.string()
})

export async function DELETE(req: Request) {
  const data = await req.json();

  const body = deleteItemValidator.safeParse(data);
  if (!body.success) return Response.json({ data: body.error.errors }, { status: 400 });

  await prisma.item.update({
    where: { id: body.data.id },
    data: {
      flags: { push: "ARCHIVED" }
    }
  })

  return Response.json({ success: true });
}