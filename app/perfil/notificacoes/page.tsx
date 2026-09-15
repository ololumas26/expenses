import ScreenLayout from "@/components/screens/ScreenLayout";
import NotificationsForm from "@/components/profile/NotificationsForm";

export default function NotificationsPage() {
    return (
        <ScreenLayout title="Notificações" description="Escolhe o que queres ser avisado." backHref="/perfil">
            <NotificationsForm />
        </ScreenLayout>
    );
}
