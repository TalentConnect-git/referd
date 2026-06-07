import { MultiSelectChips } from "../shared/MultiSelectChips";
import { ChipInput } from "../shared/ChipInput";
import type { Option } from "@/types/profile";

type JobPreferencesEditorProps = {
  jobRoles: string[];
  industry: string[];
  lookingFor: string[];
  employmentType: string[];
  locations: string[];
  onUpdate: (field: string, items: string[]) => void;
  roleOptions: Option[];
  industryOptions: Option[];
};

const lookingForOptions: Option[] = [
  "Internship",
  "Full Time",
  "Referral",
  "Freelance",
  "Remote Job",
].map((value: string) => ({
  value,
  label: value,
}));

const employmentTypeOptions: Option[] = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
  "Remote",
  "Hybrid",
  "Onsite",
].map((value: string) => ({
  value,
  label: value,
}));

export function JobPreferencesEditor({
  jobRoles,
  industry,
  lookingFor,
  employmentType,
  locations,
  onUpdate,
  roleOptions,
  industryOptions,
}: JobPreferencesEditorProps) {
  return (
    <div className="space-y-5">
      <MultiSelectChips
        label="Job Roles"
        value={jobRoles}
        options={roleOptions}
        onChange={(items: string[]) => onUpdate("jobRoles", items)}
        placeholder="Add job role"
      />

      <MultiSelectChips
        label="Industry"
        value={industry}
        options={industryOptions}
        onChange={(items: string[]) => onUpdate("industry", items)}
        placeholder="Add industry"
      />

      <MultiSelectChips
        label="Looking For"
        value={lookingFor}
        options={lookingForOptions}
        onChange={(items: string[]) => onUpdate("lookingFor", items)}
        placeholder="Add preference"
      />

      <MultiSelectChips
        label="Employment Type"
        value={employmentType}
        options={employmentTypeOptions}
        onChange={(items: string[]) => onUpdate("employmentType", items)}
        placeholder="Add employment type"
      />

      <ChipInput
        label="Locations"
        value={locations}
        onChange={(items: string[]) => onUpdate("locations", items)}
        placeholder="Type location and press Enter"
      />
    </div>
  );
}