import { ChipInput } from "../shared/ChipInput";

type SkillsEditorProps = {
  skills: string[];
  onChange: (skills: string[]) => void;
};

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  return (
    <div>
      <ChipInput label="Skills" value={skills} onChange={onChange} placeholder="Type skill and press Enter" />
    </div>
  );
}