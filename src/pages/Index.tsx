import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import FeatureCards from "@/components/FeatureCards"
import RecruiterContactsShowcase from "@/components/RecruiterContactsShowcase"
import PrepLogsShowcase from "@/components/PrepLogsShowcase"
import ResourceSharingShowcase from "@/components/ResourceSharingShowcase"
import ProfileShowcase from "@/components/ProfileShowcase"
import Footer from "@/components/Footer"
import InstallButton from "@/components/InstallButton"

const Index = () => {
    return (
        <div className='min-h-screen'>
            <Navigation />
            <InstallButton />
            <Hero />
            <FeatureCards />
            <RecruiterContactsShowcase />
            <PrepLogsShowcase />
            <ResourceSharingShowcase />
            <ProfileShowcase />
            <Footer />
        </div>
    )
}

export default Index