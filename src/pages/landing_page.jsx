import Header from "../components/header"
import Footer from '../components/footer';
import CardList from '../components/card';
import { Check, HeartHandshake, BookOpen, GraduationCap } from 'lucide-react';


const Landingpage = () => {
  return (
    <div>
      <Header />

      <section className="relative py-12 bg-white sm:py-16 lg:py-20">
      <div className="absolute inset-0">
            <img className="object-cover object-right w-full h-full lg:object-center" src="./hero-unigh.jpeg" alt="" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
            <div className="text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Higher education <br></br> at your doorstep</h2>
              <p className="mt-3 max-w  mx-auto text-lg text-white sm:mt-4">Explore your future with us now. No more waiting</p>
            </div>
            <button type="button" className="text-white bg-purple-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-12 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Get Started</button>     
        </div>
      </section>

      <section>
        <div className='justify-center'>
        <h2 className="text-3xl font-bold text-center mt-10 px-4 sm:text-4xl">Find the <a className="underline decoration-[#FFC107]">university</a> of your <a className="underline decoration-[#FF3D00]">dreams</a></h2>
        <CardList />
        </div>
       
      </section>

      {/* New "Streamline Your Application Process" Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Streamline Your Application Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all">
                <div className="mb-4 bg-[#5A076F] inline-flex p-3 rounded-full text-white">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Research Universities</h3>
                <p className="text-gray-600">Explore our comprehensive database of universities, courses, and admission requirements to find your perfect match.</p>
                <div className="mt-6 flex items-center text-[#5A076F]">
                  {/* <span className="font-medium">Get started</span> */}
                  {/* <ArrowRight size={16} className="ml-2" /> */}
                </div>
              </div>
              {/* Step 2 */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all">
                <div className="mb-4 bg-[#5A076F] inline-flex p-3 rounded-full text-white">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Track Requirements</h3>
                <p className="text-gray-600">Stay on top of application deadlines, required documents, and entrance exams with our easy tracking system.</p>
                <div className="mt-6 flex items-center text-[#5A076F]">
                  {/* <span className="font-medium">Learn more</span> */}
                  {/* <ArrowRight size={16} className="ml-2" /> */}
                </div>
              </div>
              {/* Step 3 */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all">
                <div className="mb-4 bg-[#5A076F] inline-flex p-3 rounded-full text-white">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Submit Applications</h3>
                <p className="text-gray-600">Prepare and submit polished applications with guidance every step of the way, increasing your chances of admission.</p>
                <div className="mt-6 flex items-center text-[#5A076F]">
                  {/* <span className="font-medium">Get started</span> */}
                  {/* <ArrowRight size={16} className="ml-2" /> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New "Professional Guidance" Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="lg:w-1/2">
                <img 
                  src="../Professional_Training.jpg" 
                  alt="Professional advisors helping students" 
                  className="rounded-lg shadow-lg object-cover w-full h-[400px]"
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Professional Guidance</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Get personalized advice from experienced education consultants who understand the complexities of university applications and admissions.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 text-[#5A076F]">
                      <HeartHandshake size={20} />
                    </div>
                    <span className="text-gray-700">One-on-one consultation sessions with admissions experts</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 text-[#5A076F]">
                      <HeartHandshake size={20} />
                    </div>
                    <span className="text-gray-700">Professional review of personal statements and essays</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 text-[#5A076F]">
                      <HeartHandshake size={20} />
                    </div>
                    <span className="text-gray-700">Interview preparation and mock interviews</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 text-[#5A076F]">
                      <HeartHandshake size={20} />
                    </div>
                    <span className="text-gray-700">Tailored application strategies to increase your chances</span>
                  </li>
                </ul>
                <button type="button" className="mt-8 text-white bg-[#5A076F] hover:bg-purple-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>
        </section>


      <section className='bg-[#051F60C4] sm:mt-6 lg:mt-8 mt-12 max-w-full px-4 sm:px-6 lg:px-8'>
        <div className='justify-center my-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 flex gap-3 lg:flex-justify lg:flex flex-col lg:flex-row'>
            <div className='sm:text-center lg:text-left'>
            <h2 className="text-3xl tracking-tight font-bold mt-10 sm:text-4xl text-white">Get Funded Now</h2>
            <p className='mt-3 text-base text-white sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0'>
            Your path to tertiary education is clearer <br /> than ever.  Explore scholarships the <br />numerous scholarships available now.
            </p>

            <button type="button" className="text-[#051F60C4] bg-white hover:bg-gray-200 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-8">See More</button>


            </div>
            <div className='lg:inset-y-0 lg:right-0 lg:w-1/2 my-4 sm:ml-0 md:ml-0 lg:ml-28'>
                <img className='h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-72 rounded-md' src="./student.jpeg" alt="" />
            </div>

        </div>
      </section>


      <section className='sm:mt-6 lg:mt-8 mt-12 max-w-full px-4 sm:px-6 lg:px-8'>
        {/* <div className='my-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 flex gap-3 lg:flex-justify lg:flex flex-col lg:flex-row'> */}
            
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-inter text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="font-inter text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their perfect university through EduFind.
          </p>
          <a
            
            className="inline-block bg-[#357AFF] text-white px-8 py-3 rounded-lg font-inter font-bold hover:bg-[#2E69DE] transition-colors"
          >
            {"Sign Up Now"}
          </a>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Landingpage
