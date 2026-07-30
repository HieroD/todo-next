import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userId = session?.user?.id;

  // error response
  if (!userId) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await ctx.params;
  const task = await prisma.task.findUnique({
    where: {
      id: Number(id),
      userId: userId,
    },
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
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userId = session?.user?.id;

  // error response
  if (!userId) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await ctx.params;
  const body = await request.json();
  const parsed = updateTaskSchema.safeParse(body);

  // error response
  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "error",
        message: z.prettifyError(parsed.error),
      },
      { status: 400 },
    );
  }

  const task = await prisma.task.update({
    where: {
      id: Number(id),
      userId: userId,
    },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
    },
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
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userId = session?.user?.id;

  // error response
  if (!userId) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await ctx.params;

  const deletedTask = await prisma.task.delete({
    where: {
      id: Number(id),
      userId: userId,
    },
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
