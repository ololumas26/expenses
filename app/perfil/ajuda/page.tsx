import ScreenLayout from "@/components/screens/ScreenLayout";
import HelpContent from "@/components/profile/HelpContent";

export default function HelpPage() {
    return (
        <ScreenLayout title="Ajuda e suporte" description="Encontra respostas ou fala connosco." backHref="/perfil">
            <HelpContent />
        </ScreenLayout>
    );
}
