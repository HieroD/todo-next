import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
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
    { status: 200 },
  );
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const body = await request.json();

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: body,
  });

  // success response
  return NextResponse.json(
    {
      status: "success",
      message: `Berhasil mengubah tugas ${task?.id}`,
      data: task,
    },
    { status: 200 },
  );
}

export async function DELETE(
  _: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const deletedTask = await prisma.task.delete({
    where: { id: Number(id) },
  });

  // success response
  return NextResponse.json(
    {
      status: "success",
      message: `Berhasil menghapus tugas ${deletedTask.id}`,
      data: deletedTask,
    },
    { status: 200 },
  );
}
