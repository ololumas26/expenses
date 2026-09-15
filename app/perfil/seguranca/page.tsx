import ScreenLayout from "@/components/screens/ScreenLayout";
import SecurityForm from "@/components/profile/SecurityForm";

export default function SecurityPage() {
    return (
        <ScreenLayout title="Segurança" description="Mantém a tua conta protegida." backHref="/perfil">
            <SecurityForm />
        </ScreenLayout>
    );
}
