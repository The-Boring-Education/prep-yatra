const Footer = () => {
    return (
        <footer className='py-8 px-4 border-t border-white/10'>
            <div className='container mx-auto text-center'>
                <p className='text-gray-400'>
                    Built with <span className='text-red-500'>❤️</span> by{" "}
                    <a
                        href='https://theboringeducation.com'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary font-semibold hover:underline'>
                        The Boring Education
                    </a>
                </p>
            </div>
        </footer>
    )
}

export default Footer
