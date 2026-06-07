import { TextInput } from "../shared/TextInput";
import { SelectInput } from "../shared/SelectInput";
import type { Option } from "@/types/profile";

const openToShiftOptions: Option[] = ["Yes", "No", "Flexible"].map(
  (value: string) => ({
    value,
    label: value,
  }),
);

type CareerDetailsEditorProps = {
  currentCompany: string;
  companyEmail: string;
  totalYearsOfExperience: string;
  noticePeriod: string;
  openToShift: string;
  onUpdate: (field: string, value: string) => void;
};

export function CareerDetailsEditor({
  currentCompany,
  companyEmail,
  totalYearsOfExperience,
  noticePeriod,
  openToShift,
  onUpdate,
}: CareerDetailsEditorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TextInput
        label="Current Company"
        value={currentCompany}
        onChange={(value: string) => onUpdate("currentCompany", value)}
      />

      <TextInput
        label="Company Email"
        value={companyEmail}
        onChange={(value: string) => onUpdate("companyEmail", value)}
      />

      <TextInput
        label="Total Years of Experience"
        value={totalYearsOfExperience}
        onChange={(value: string) => onUpdate("totalYearsOfExperience", value)}
      />

      <TextInput
        label="Notice Period"
        value={noticePeriod}
        onChange={(value: string) => onUpdate("noticePeriod", value)}
      />

      <SelectInput
        label="Open To Shift"
        value={openToShift}
        options={openToShiftOptions}
        allowCustom
        onChange={(value: string) => onUpdate("openToShift", value)}
      />
    </div>
  );
}
