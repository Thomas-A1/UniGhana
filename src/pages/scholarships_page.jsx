import Header from '../components/header'
import ScholarshipCardList from '../components/scholarship_card'
import Footer from '../components/footer'

const ScholarshipsPage = () => {
    return (
        <div>
            <Header />
            <section className="relative py-40 bg-slate-50">
                <div className="absolute inset-0">
                    <img className="object-cover object-top w-full h-full" src="./scholarships-hero.jpeg" alt="" />

                </div>
                <div className='relative text-center'>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Financial Aid</h2>
                </div>

            </section>

            {/* side pannel */}
            <div className='flex justify-center'>
                <div className='left-0 sticky top-0 p-6 h-full w-1/5 rounded-br-lg shadow-md hidden sm:hidden lg:block'>
                    <p className='text-[#5A076F] font-medium'>Clear all</p>

                    {/* search bar */}
                    <div className='mt-4'>
                        <input type="search" placeholder='Search' className='w-full p-1 rounded-lg' />

                        <p className='mt-6 font-semibold text-sm'>Scholarship type</p>

                        <div className="flex items-center mb-4 mt-2">
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                            />
                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-light text-gray-900 dark:text-gray-300">
                                Full Scholarship
                            </label>
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-light text-gray-900 dark:text-gray-300">
                                Part Scholarship
                            </label>
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-light text-gray-900 dark:text-gray-300">
                                Merit based
                            </label>
                        </div>


                        <p className='mt-6 font-semibold text-sm'>Schools</p>

                        <div className="flex items-center mb-4 mt-2">
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-light text-gray-900 dark:text-gray-300">
                                University of Ghana
                            </label>
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-light text-gray-900 dark:text-gray-300">
                                Ashesi University
                            </label>
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-light text-gray-900 dark:text-gray-300">
                                Academic City University
                            </label>
                        </div>

                    </div>

                </div>

                {/* scholarships */}
                <ScholarshipCardList />


            </div>



            <Footer />

        </div>
    )
}

export default ScholarshipsPage
