import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, ctx: {params: Promise<{id: string}>}) {
  const { id } = await ctx.params;
  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
  });

  // success response
  return NextResponse.json(
    {
      status: "success",
      message: `Berhasil mengambil tugas ${task?.id}`,
      data: task,
    },
    { status: 200}
  );
}
