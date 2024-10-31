import React from 'react';

const Footer = () => {
  const footerSections = {
    About: {
      description: "Sheeputronics is an eCommerce platform dedicated to providing high-quality electronic components at competitive prices. Sheeputronics combines reliability with affordability",
      copyright: "© TurpleSpace 2024"
    },
    "Quick Links": {
      links: [
        { title: "Homepage", href: "/" },
        { title: "Products", href: "/products" },
        { title: "About Us", href: "/about" },
        { title: "Contact Us", href: "/contact" }
      ]
    },
    Support: {
      links: [
        { title: "Shipping & Returns", href: "/shipping-returns" },
        { title: "Order Tracking", href: "/order-tracking" },
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms & Conditions", href: "/terms" }
      ]
    },
    Resources: {
      links: [
        { title: "Blog", href: "/blog" },
        { title: "Product Tutorials", href: "/tutorials" },
        { title: "Community Forum", href: "/forum" },
        { title: "User Testimonials", href: "/testimonials" }
      ]
    },
    Socials: {
      links: [
        { title: "LinkedIn", href: "#" },
        { title: "Instagram", href: "#" },
        { title: "Twitter", href: "#" },
        { title: "Discord", href: "#" }
      ]
    }
  };

  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <span className="text-white font-medium">Sheeputronics</span>
            </div>
            <p className="text-sm leading-relaxed">
              {footerSections.About.description}
            </p>
            <p className="text-sm pt-4">
              {footerSections.About.copyright}
            </p>
          </div>

          {/* Quick Links, Support, Resources, and Socials */}
          {Object.entries(footerSections).slice(1).map(([title, section]) => (
            <div key={title}>
              <h3 className="text-white font-medium mb-4">{title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;