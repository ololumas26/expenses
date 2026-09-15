'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!


export const createClient = async function(){
    const cookieStore = await cookies()

    return createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll : () => cookieStore.getAll(),
            setAll: (cookieToStore) => cookieToStore.forEach(({name, value, options}) => {
                try {
                    cookieStore.set(name, value, options)
                } catch {
                    // Deixa passar os cookies
                }
            })
        }
    })

}

