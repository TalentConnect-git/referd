export interface Interview {
  _id: string;

  jobId: {
    _id: string;
    jobTitle: string;
    jobType: string;
  };

  applicantAuthId: string;
  applicantType: string;

  date: string;
  time: string;

  meetLink: string;
  message: string;
  status: string;

  companySnapshot: {
    companyName: string;
  };

  createdAt: string;
}