// API para chat persistente
import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_PATH = path.join(process.cwd(), "data", "chat.json")

async function readData() {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8")
    return JSON.parse(data)
  } catch {
    return { conversations: [], messages: [] }
  }
}

async function writeData(data: any) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET(req: NextRequest) {
  const data = await readData()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  // body: { type, payload }
  const data = await readData()
  if (body.type === "addMessage") {
    data.messages.push(body.payload)
  } else if (body.type === "addConversation") {
    data.conversations.push(body.payload)
  } else if (body.type === "deleteConversation") {
    data.conversations = data.conversations.filter((c:any) => c.id !== body.payload)
    data.messages = data.messages.filter((m:any) => m.conversationId !== body.payload)
  } else if (body.type === "deleteMessage") {
    data.messages = data.messages.filter((m:any) => m.id !== body.payload)
  } else if (body.type === "setAllRead") {
    data.messages = data.messages.map((m:any) => m.conversationId === body.payload ? { ...m, read: true } : m)
  }
  await writeData(data)
  return NextResponse.json({ ok: true })
}
