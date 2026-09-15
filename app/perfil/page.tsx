import ScreenLayout from "@/components/screens/ScreenLayout";
import ProfilePageContent from "@/components/profile/ProfilePageContent";

export default function ProfilePage() {
    return (
        <ScreenLayout title="Perfil" description="Os teus dados e preferências num só lugar.">
            <ProfilePageContent />
        </ScreenLayout>
    );
}
