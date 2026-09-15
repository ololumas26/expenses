import { supabase } from "@/lib/supabase/client"


export const googleSignIn = async function(){

    try {
   
        const {error, data} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:3000/success'
            }
        })

        if (error) {
            console.log("Hove um erro ao se autenticar com o google:")
            return
        }

        console.log("Login realizado com sucesso: ", data)

    } catch(err){
        // captura algum outro erro que o supabase não trás no objeto erro
    }
}