import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description } = body;

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

  const task = await prisma.task.create({
    data: {
      title: title,
      description: description,
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
