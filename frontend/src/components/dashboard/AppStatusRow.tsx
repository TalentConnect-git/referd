import { AppStatusRowProps } from "@/types/dashboard";

export default function AppStatusRow({company,role,stage}:AppStatusRowProps)
{
    return(
        <div className="flex items-center justify-between border-b border-[#1e293b] p-4">
        <div className="flex items-center gap-3">
        <div>
            <h3 className="font-medium text-white">{company}</h3>
            <p className="text-sm text-gray-400">{role}</p>
        </div>
        </div>  

        <p className="text-sm font-medium text-green-500">{stage}</p>
     
       
        
        </div>
    )
}
