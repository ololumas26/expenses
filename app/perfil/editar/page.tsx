import ScreenLayout from "@/components/screens/ScreenLayout";
import EditProfileForm from "@/components/profile/EditProfileForm";

export default function EditProfilePage() {
    return (
        <ScreenLayout title="Editar perfil" description="Atualiza os teus dados pessoais." backHref="/perfil">
            <EditProfileForm />
        </ScreenLayout>
    );
}
