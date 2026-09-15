import Link from "next/link"

type BudgeType = {
    username : string
}


export default function UserBudge({username} :BudgeType ){

    function transformName(value : string){

        if(value && value.includes(' ')){
            const splited = value.split(' ')
            return splited[0][0]+splited[splited.length - 1][0]
        }
        return value ? value[0] : 'N/A'
    }

    return (
        <Link href="/perfil" className="bg-primary p-3 rounded-full font-bold text-background hover:opacity-90" aria-label="Ver perfil">
            <h5>{transformName(username)}</h5>
        </Link>
    )
}
