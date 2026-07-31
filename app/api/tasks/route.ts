import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userId = session?.user.id;

  // authorization error response
  if (!userId) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);

  // validation error response
  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "error",
        message: z.prettifyError(parsed.error),
      },
      { status: 400 },
    );
  }

  try {
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
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Something went wrong.",
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userId = session?.user.id;

  // authorization error response
  if (!userId) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
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
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Something went wrong.",
        data: null,
      },
      { status: 500 },
    );
  }
}
