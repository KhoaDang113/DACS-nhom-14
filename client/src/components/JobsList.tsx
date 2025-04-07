import React from "react";
import { Gig } from "../data/jobs";

interface JobsListProps {
  jobs: Gig[];
}

const JobsList: React.FC<JobsListProps> = ({ jobs }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold">{job.title}</h2>
          <p className="text-gray-600">{job.freelancer?.name}</p>
          <p className="text-gray-500">{job.category_id}</p>
          <p className="text-green-600 font-bold">${job.price.toString()}</p>
        </div>
      ))}
    </div>
  );
};

export default JobsList;
