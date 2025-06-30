import React from "react"
import { socialLinks, productLinks } from "@/constants"

const Footer = () => {
  return (
    <footer className="pt-8 px-4 border-t border-white/10 bg-gray-900/90 backdrop-blur-md">
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 w-full">
          {/* Left: Brand and Socials */}
          <div className="flex flex-col items-start gap-3 md:w-1/3 w-full">
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-primary">PrepYatra</span>
              <span className="text-xs text-white">By The Boring Education</span>
            </div>
            <div className="flex gap-4 mt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 md:w-1/3 w-full">
            {/* Products Section */}
            <span className="text-gray-300 font-semibold text-sm mb-1"> Our Products</span>
            <div className="flex flex-col gap-2 justify-center md:items-end w-full">
              {productLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* Built with love - Center Bottom */}
        <div className="flex justify-center m-2">
          <p className="text-gray-400 text-center">
            Built with <span className="text-red-500">❤️</span> by {" "}
            <a
              href="https://theboringeducation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              The Boring Education
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer