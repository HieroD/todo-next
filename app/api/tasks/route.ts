import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {title, description} = body;

  const task = await prisma.task.create({
    data: {
      title: title,
      description: description
    }
  })

  // success response
  return NextResponse.json(
    {
      status: "success",
      message: "Berhasil menambahkan tugas baru.",
      data: task,
    },
    { status: 200 }
  );
}

export async function GET() {
  const tasks = await prisma.task.findMany();

  // success response
  return NextResponse.json(
    {
      status: "success",
      message: "Berhasil mengambil semua tugas",
      data: tasks,
    },
    { status: 200 }
  );
}

