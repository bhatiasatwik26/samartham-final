import { useInView } from '@/lib/animate';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { ref, isVisible } = useInView();

  const footerLinks = [
    {
      title: 'About Us',
      links: [
        { name: 'Our Mission', href: '#' },
        { name: 'Team', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Impact', href: '#' },
      ],
    },
    {
      title: 'Events',
      links: [
        { name: 'Upcoming Events', href: '#' },
        { name: 'Past Events', href: '#' },
        { name: 'Webinars', href: '#' },
        { name: 'Workshops', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Media Kit', href: '#' },
        { name: 'Contact Us', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and Short Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-start" aria-label="Samarthanam NGO Home">
              <div className="bg-red-900/20 p-2 rounded-lg overflow-hidden inline-block">
                <img 
                  src="/images/logo_for_site.jpg" 
                  alt="Samarthanam NGO" 
                  className="h-12 w-auto rounded-md"
                />
              </div>
            </Link>
            <p className="text-gray-400 mt-4">
              Empowering people with disabilities through accessible education, employment, and technology.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-red-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="#about" className="text-gray-400 hover:text-red-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="#events" className="text-gray-400 hover:text-red-500 transition-colors">Events</Link>
              </li>
              <li>
                <Link to="#help" className="text-gray-400 hover:text-red-500 transition-colors">How To Help</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-red-500 transition-colors">Donate</Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-red-500 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-red-500 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-red-500 transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-red-500 transition-colors">Accessibility Statement</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin size={20} className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-400">123 NGO Street, Bangalore, Karnataka 560001, India</p>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="text-red-500 mr-3 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-red-500 transition-colors">+91 98765 43210</a>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="text-red-500 mr-3 flex-shrink-0" />
                <a href="mailto:info@samarthanam.org" className="text-gray-400 hover:text-red-500 transition-colors">info@samarthanam.org</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Samarthanam NGO. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Designed with ❤️ for accessibility
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
