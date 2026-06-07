import axiosInstance from "@/lib/axios";

interface JobRowProps {
    id:string,
    title:string,
    location:string,
    jobType:string
}


export default function JobRow({id,title,location,jobType}:JobRowProps)
{
   async function handleSave(jobType:string)
    {
        try {
         await axiosInstance.post("/application/saveopportunity",{jobId: id,jobType:{jobType}});
         alert("Job saved successfully");
            }

  catch(err){

    console.log(err);

  }
    }
    async function handleApply()
    {
        console.log("Applied to job with id:", id);
    }   
    return (
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
        <div className="flex items-center gap-4">
        <div>
            <h3 className="text-md font-semibold text-white">{title}</h3>
            <p className="text-gray-300">{location}</p>
        </div>

      </div>

      <div className="flex gap-3">

        <button onClick={()=>handleSave(jobType)} className="px-4 py-2 rounded-md border border-[#334155] text-white hover:bg-[#1e293b]">
        Save
        </button>
        <button onClick={handleApply} className="px-3 py-2 rounded-md bg-green-500 text-black font-semibold">
        Apply
        </button>
    </div>

    </div>

    );

}