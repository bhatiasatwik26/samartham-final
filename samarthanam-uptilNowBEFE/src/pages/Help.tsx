import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // FAQ data
  const faqs = [
    {
      category: "General",
      questions: [
        {
          id: "what-is-samarthanam",
          question: "What is Samarthanam Trust?",
          answer: "Samarthanam Trust is a non-profit organization dedicated to empowering persons with disabilities and those from underprivileged backgrounds through various programs focusing on education, livelihood, sports, cultural activities, and more."
        },
        {
          id: "mission-vision",
          question: "What is Samarthanam's mission and vision?",
          answer: "Our mission is to empower persons with disabilities and those from marginalized sections of society through comprehensive support programs. Our vision is to create an inclusive society where everyone has equal access to opportunities and resources."
        },
        {
          id: "how-to-contact",
          question: "How can I contact Samarthanam?",
          answer: "You can reach us through email at info@samarthanam.org or kumar@samarthanam.org, call our helpline at 080-68333999 or office at +91 80 25721444 / 9922, or visit our headquarters in Bengaluru. You can also use the contact form on our Contact page."
        }
      ]
    },
    {
      category: "Donations",
      questions: [
        {
          id: "how-to-donate",
          question: "How can I donate to Samarthanam?",
          answer: "You can donate through our website using credit/debit cards, UPI, net banking, or other payment methods. You can also send a check to our office address or make a direct bank transfer. All donations are eligible for tax exemption under Section 80G."
        },
        {
          id: "donation-usage",
          question: "How will my donation be used?",
          answer: "Your donations directly support our programs for persons with disabilities and underprivileged individuals, including education scholarships, skill development training, assistive devices, sports initiatives, and community development projects."
        },
        {
          id: "tax-benefits",
          question: "Are donations to Samarthanam tax-deductible?",
          answer: "Yes, all donations made to Samarthanam Trust are eligible for tax exemption under Section 80G of the Income Tax Act in India. Foreign donations are accepted under FCRA guidelines."
        }
      ]
    },
    {
      category: "Volunteering",
      questions: [
        {
          id: "volunteer-opportunities",
          question: "What volunteer opportunities are available?",
          answer: "We offer various volunteering opportunities including teaching, mentoring, event support, content creation, administrative assistance, IT support, and more. You can volunteer regularly or for specific events based on your availability."
        },
        {
          id: "how-to-volunteer",
          question: "How can I become a volunteer?",
          answer: "To become a volunteer, you can register through our website by filling out the volunteer registration form. Our team will review your application and contact you to discuss your interests and how you can contribute."
        },
        {
          id: "volunteer-requirements",
          question: "Are there any requirements to volunteer?",
          answer: "While specific requirements vary by role, we generally look for volunteers who are committed, empathetic, and respectful towards persons with disabilities. Some specialized roles may require specific skills or experience."
        }
      ]
    },
    {
      category: "Events & Programs",
      questions: [
        {
          id: "upcoming-events",
          question: "How can I know about upcoming events?",
          answer: "You can stay updated about our upcoming events through our website's Events page, social media channels, or by subscribing to our newsletter. We regularly organize fundraisers, awareness campaigns, sports tournaments, and cultural programs."
        },
        {
          id: "participate-in-events",
          question: "Can I participate in Samarthanam's events?",
          answer: "Yes, most of our events are open to the public. Some events may have specific registration requirements or entry fees, which will be mentioned in the event details."
        },
        {
          id: "beneficiary-programs",
          question: "What programs do you offer for beneficiaries?",
          answer: "We offer a wide range of programs including education support, vocational training, employment assistance, rehabilitation services, assistive technology support, sports training, and cultural activities for persons with disabilities and underprivileged individuals."
        }
      ]
    }
  ];
  
  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() === '' 
    ? faqs 
    : faqs.map(category => {
        const filteredQuestions = category.questions.filter(
          q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
               q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return {
          ...category,
          questions: filteredQuestions
        };
      }).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div 
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              Help Center
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find answers to common questions and learn how to make the most of our services
            </p>
          </div>
          
          {/* Search Bar */}
          <div 
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="pl-10 py-6 rounded-full shadow-md hover:shadow-lg transition-shadow"
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  variant="ghost"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  ×
                </Button>
              )}
            </div>
          </div>
          
          {/* FAQs */}
          <div
            className="mb-16"
          >
            {filteredFaqs.length > 0 ? (
              <>
                {filteredFaqs.map((category, index) => (
                  <div key={category.category} className="mb-10">
                    <h2 className="text-2xl font-bold mb-6 text-red-600 dark:text-red-500">{category.category}</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                      <Accordion type="single" collapsible className="divide-y divide-gray-200 dark:divide-gray-700">
                        {category.questions.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id} className="border-none">
                            <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <div className="flex-grow text-gray-900 dark:text-white font-medium">{faq.question}</div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 pt-0 text-gray-600 dark:text-gray-300">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">No results found</h3>
                <p className="text-gray-600 dark:text-gray-300">Please try a different search term or browse our categories below.</p>
              </div>
            )}
          </div>
          
          {/* Contact Info Card */}
          <div
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl shadow-xl p-8 text-white">
              <div className="md:flex items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
                  <p className="text-white/90 max-w-md">
                    If you couldn't find the answer to your question, our team is ready to help you.
                  </p>
                </div>
                <div className="space-y-3 md:space-y-0 md:space-x-3 md:flex items-center">
                  <Button className="bg-white text-red-600 hover:bg-gray-100 w-full md:w-auto" asChild>
                    <a href="/contact">Contact Us</a>
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 w-full md:w-auto" asChild>
                    <a href="tel:+918068333999">Call Support</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resources */}
          <section
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-red-600 dark:text-red-500">Helpful Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Donation Guide",
                  description: "Learn about different ways to contribute and how your donations make an impact.",
                  link: "#donation-guide"
                },
                {
                  title: "Volunteer Handbook",
                  description: "A comprehensive guide for volunteers with roles, responsibilities, and best practices.",
                  link: "#volunteer-handbook"
                },
                {
                  title: "Accessibility Guidelines",
                  description: "Information about our accessibility features and accommodations for various disabilities.",
                  link: "#accessibility"
                }
              ].map((resource, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{resource.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{resource.description}</p>
                  <a 
                    href={resource.link} 
                    className="text-red-600 dark:text-red-400 font-medium hover:underline inline-flex items-center"
                  >
                    View Guide <ChevronDown className="ml-1 h-4 w-4 rotate-[270deg]" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help; 