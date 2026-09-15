import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // No App Router, o .json() é um método assíncrono que deve ser aguardado
  const { code } = await request.json();
  const supabase = await createClient()

  try {

    const {data, error} = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        return NextResponse.json({code : "UNAUTHORIZED", message: 'Erro ao fazer login tente novamente'}, { status: 401 })
    }
    return NextResponse.json({code: 'AUTHORIZED', message: 'Autenticado com sucesso'})
    console.log("Dados da resposta: ", data)

  } catch(error){
    console.log("Um erro inesperado aconteceu a fazer login: ", error)
  }

  return NextResponse.json({ message: 'OKKKKK' });
}