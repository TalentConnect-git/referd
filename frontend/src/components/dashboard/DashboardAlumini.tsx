import axiosInstance from "@/lib/axiosInstance";
import AlumniCard from "./AluminiCard";

export default async function DashboardAlumini() 
{
  let companies: any[] = [];
  let aluminiResults:any[]=[];
  try {

    const response = await axiosInstance.get("/dropdown/companiesName");
    companies = response.data || [];
     aluminiResults = await Promise.all(companies.map(async (company: any) => 
      {
        try 
        {
          const res = await axiosInstance.get(`/api/candidate/alumni/${company.value}`);
          return {
          company: company.label,
          alumni: res.data.alumni || [],}; 
        } 
        catch 
        {
          return{
            company: company.label,
            alumni: [],
          };
        }}));
    } 
    catch (err) {
    console.error("Error fetching aluminis:", err);
  }
  return (
    <div className="rounded-3xl border border-[#1e293b] bg-[#0f172a] mt-6 mx-5">

      <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">

        <div>
          <h2 className="text-lg font-semibold text-white">
            Alumni Hiring Network
          </h2>

          <p className="text-gray-400 mt-1 text-sm">
            Verified alumni currently hiring
          </p>
        </div>

        <button className="text-gray-400 hover:text-white text-md">
          View All →
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-3">

      {
        aluminiResults.length === 0 ? (<p className="text-gray-400 p-4">No alumni found</p>): (aluminiResults.map((companyData) =>companyData.alumni.map((alumni: any) => (
          <AlumniCard key={alumni._id} name={alumni.name} role={alumni.jobRoles?.[0] || "Professional"} company={alumni.currentCompany} college={alumni.college} openRoles={alumni.referralMetrics?.totalReferralsPosted || 0}/>))))
      }








        {/* <AlumniCard
          name="Ananya Sharma"
          role="Senior SWE"
          company="Google"
          college="VIPS '21"
          openRoles={4}
        />

        <AlumniCard
          name="Rohit Verma"
          role="Product Manager"
          company="Stripe"
          college="IIT Delhi '19"
          openRoles={2}
        />

        <AlumniCard
          name="Kabir Singh"
          role="Design Engineer"
          company="Linear"
          college="NID '20"
          openRoles={1}
        /> */}

      </div>

    </div>
  );
}