import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userId = session?.user.id;

  // error response
  if (!userId) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const parsed = createTaskSchema.safeParse(body);

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

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      userId: userId,
    },
  });

  // success response
  return NextResponse.json(
    {
      status: "success",
      message: "Berhasil menambahkan tugas baru.",
      data: task,
    },
    { status: 201 },
  );
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userId = session?.user.id;

  // error response
  if (!userId) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 },
    );
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: userId,
    },
  });

  // success response
  return NextResponse.json(
    {
      status: "success",
      message: "Berhasil mengambil semua tugas",
      data: tasks,
    },
    { status: 200 },
  );
}
