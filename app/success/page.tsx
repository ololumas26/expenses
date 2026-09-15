'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Componente() {
  
  const [message, setMessage] = useState('A carregar...') 
  const params = useSearchParams()
  const code = params.get('code')
  const router = useRouter()

  useEffect(() => {
    if (!code) return

    async function get() {
      try {
        const response = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.code !== 'AUTHORIZED'){
            setMessage(data?.message ?? 'Não foi possível autentica-lo, tente novamente')
            return
        }
        
        router.push("/dashboard")

      } catch (error) {
        console.log("Erro ao obter resposta: ", error)
      }
    }

    get()

  }, [code, router]) 

  return <div>{message}</div>
}