
import Image from "next/image"
import googleImage from '@/public/images/google-icon.svg'


type ButtonProps = {
    type : "submit" | "reset" | "button" | undefined
}


export default function GoogleButton({type}: ButtonProps){

    return (
        <button className="flex items-center gap-3 border border-gray-300 p-2 rounded-xl mt-5 hover:bg-green-50
        transition-all ease-in-out duration-500"
        type={type}>
            <Image src={googleImage} alt="google-icon" width={30}/>
            <span>Continuar com o google</span>
        </button>
    )
}