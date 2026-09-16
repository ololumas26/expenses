'use client'

import GoogleButton from "@/components/ui/GoogleButton";
import { googleSignIn } from "./actions";
import { FormEvent } from "react";
import { Wallet } from "lucide-react";


export default  function Home() {

  const handlesSignin = async function(e : FormEvent){
    e.preventDefault()
    await googleSignIn()
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans px-6 py-12">
        <main className="flex w-full max-w-sm flex-col items-center justify-center text-center">
          <span className="mb-4 rounded-full bg-primary/10 p-3 text-primary"><Wallet size={26} aria-hidden="true" /></span>
          <h1 className="font-semibold text-2xl">Manage</h1>
          <p className="mt-1 text-sm text-gray-500">Gestão de despesas e finanças</p>

          <form onSubmit={handlesSignin} className="mt-6 flex w-full flex-col items-center">
            <GoogleButton type="submit"/>
          </form>

        </main>
    </div>
  );
}
