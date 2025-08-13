import Navigation from "@/components/layout/Navigation"
import Hero from "@/components/features/Hero"
import FeatureCards from "@/components/cards/FeatureCards"
import RecruiterContactsShowcase from "@/components/showcase/RecruiterContactsShowcase"
import PrepLogsShowcase from "@/components/showcase/PrepLogsShowcase"
import ResourceSharingShowcase from "@/components/showcase/ResourceSharingShowcase"
import ProfileShowcase from "@/components/showcase/ProfileShowcase"
import Footer from "@/components/layout/Footer"
import InstallButton from "@/components/features/InstallButton"

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
