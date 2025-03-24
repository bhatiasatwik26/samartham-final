import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div 
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              About Samarthanam
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Empowering Lives Through Inclusive Opportunities
            </p>
          </div>
          
          {/* Mission & Vision */}
          <section 
            className="mb-20 grid md:grid-cols-2 gap-10"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4 text-red-600">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300">
                To empower persons with disabilities and those from marginalized sections of society through education, skill development, sports, cultural activities, and rehabilitation programs, enabling them to lead a life of dignity and independence.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4 text-red-600">Our Vision</h2>
              <p className="text-gray-700 dark:text-gray-300">
                To create an inclusive society where persons with disabilities and those from underprivileged backgrounds have equal access to opportunities, resources, and the chance to lead fulfilling lives without discrimination.
              </p>
            </div>
          </section>
          
          {/* Our Story */}
          <section 
            className="mb-20"
          >
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-500">Our Story</h2>
              <div className="md:flex items-center gap-10">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Founded in 1997, Samarthanam began with a vision to support a handful of visually impaired children. Today, we've grown into a multi-faceted organization with global presence, serving thousands of persons with disabilities and those from marginalized communities.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our journey has been marked by continuous innovation, dedicated service, and a commitment to creating sustainable impact. From education and livelihood programs to sports initiatives and cultural activities, we strive to provide holistic support to our beneficiaries.
                  </p>
                </div>
                <div className="md:w-1/2 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Volunteers working together" 
                    className="w-full h-[300px] object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Impact Numbers */}
          <section 
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-red-600 dark:text-red-500">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { number: '25+', label: 'Years of Service' },
                { number: '50,000+', label: 'Lives Touched' },
                { number: '15+', label: 'Centers Across India' },
                { number: '20+', label: 'Programs & Initiatives' }
              ].map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-500 mb-2">{item.number}</div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Team */}
          <section
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-red-600 dark:text-red-500">Our Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Dr. Mahantesh G Kivadasannavar',
                  role: 'Founder & Managing Trustee',
                  image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&q=80'
                },
                {
                  name: 'Padma Shri Pranav Desai',
                  role: 'Vice President',
                  image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&q=80'
                },
                {
                  name: 'Dr. Suzanne Rodgers',
                  role: 'International Relations Director',
                  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&q=80'
                }
              ].map((member, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-red-600 dark:text-red-400">{member.role}</p>
                  </div>
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

export default About; 