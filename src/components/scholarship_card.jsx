import PropTypes from 'prop-types';


const scholarships = [
    {
        title: "MasterCard Foundation",
        description: "Provides scholarships to students from disadvantaged backgrounds in Africa.",
        image: "./mastercard-foundation.png",
        scholars: 130,
        deadline: "01 Sept",
        scholarsPercentage: 85,
        deadlinePercentage: 70,
        link: "#"
    },
    {
        title: "Dream hive Scholarship",
        description: "Supports outstanding minority students with significant financial need.",
        image: "./dream-hive.jpeg",
        scholars: 200,
        deadline: "15 Oct",
        scholarsPercentage: 90,
        deadlinePercentage: 40,
        link: "#"
    },
    {
        title: "Tullow Oil Teritiary Scholarship",
        description: "Provides grants for individually designed study/research projects.",
        image: "./tullow-oil.jpeg",
        scholars: 150,
        deadline: "01 Dec",
        scholarsPercentage: 75,
        deadlinePercentage: 50,
        link: "#"
    },
    {
        title: "Ghana National Petroleum Corporation",
        description: "Supports students pursuing degrees in the energy sector.",
        image: "./gnpc.jpeg",
        scholars: 100,
        deadline: "15 Nov",
        scholarsPercentage: 65,
        deadlinePercentage: 60,
        link: "#"
    }
];

const ScholarshipCard = ({ title, description, image, scholars, deadline, scholarsPercentage, deadlinePercentage, link }) => {
    return (
        <div className='p-4 min-w-lg'>
            <div className="max-w-sm h-[30rem] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:scale-105 delay-150 duration-300 ease-in-out">
                <div className='p-5'>
                    <a href={link}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">{title}</h5>
                    </a>
                    <p className="text-sm mb-3 font-normal text-gray-700 dark:text-gray-400 overflow-hidden text-ellipsis">{description}</p>
                </div>
                <a href={link}>
                    <img className='px-4 w-full h-48 object-cover' src={image} alt={title} />
                </a>
                <div className='p-4'>
                    <div className='flex justify-between text-gray-500 text-sm mb-1'>
                        <p>Scholars</p>
                        <p>{scholars}</p>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                        <div className='h-2.5 bg-green rounded-full' style={{ width: `${scholarsPercentage}%` }}></div>
                    </div>
                    <div className='flex justify-between text-gray-500 text-sm mb-1 mt-5'>
                        <p>Deadline</p>
                        <p>{deadline}</p>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4'>
                        <div className='h-2.5 bg-yellow rounded-full' style={{ width: `${deadlinePercentage}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ScholarshipCardList = () => (
    <div className='px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-5'>
        {scholarships.map((scholarship, index) => (
            <ScholarshipCard
                key={index}
                title={scholarship.title}
                description={scholarship.description}
                image={scholarship.image}
                scholars={scholarship.scholars}
                deadline={scholarship.deadline}
                scholarsPercentage={scholarship.scholarsPercentage}
                deadlinePercentage={scholarship.deadlinePercentage}
                link={scholarship.link}
            />
        ))}
    </div>
);
ScholarshipCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    scholars: PropTypes.number.isRequired,
    deadline: PropTypes.string.isRequired,
    scholarsPercentage: PropTypes.number.isRequired,
    deadlinePercentage: PropTypes.number.isRequired,
    link: PropTypes.string.isRequired,
};

export default ScholarshipCardList;