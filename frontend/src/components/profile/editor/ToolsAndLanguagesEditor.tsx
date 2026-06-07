import { ChipInput } from "../shared/ChipInput";

type ToolsAndLanguagesEditorProps = {
  tools: string[];
  domains: string[];
  languages: string[];
  onUpdate: (field: string, items: string[]) => void;
};

export function ToolsAndLanguagesEditor({
  tools,
  domains,
  languages,
  onUpdate,
}: ToolsAndLanguagesEditorProps) {
  return (
    <div className="space-y-5">
      <ChipInput
        label="Tools and Platforms"
        value={tools}
        onChange={(items: string[]) => onUpdate("toolsAndPlatforms", items)}
        placeholder="Type tool and press Enter"
      />

      <ChipInput
        label="Domain Knowledge"
        value={domains}
        onChange={(items: string[]) => onUpdate("domainKnowledge", items)}
        placeholder="Type domain and press Enter"
      />

      <ChipInput
        label="Languages Known"
        value={languages}
        onChange={(items: string[]) => onUpdate("languagesKnown", items)}
        placeholder="Type language and press Enter"
      />
    </div>
  );
}