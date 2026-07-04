export interface SavedJobCardProps {
  savedJob: any;
  onUnsave:(jobId: string)=>void;
  onClick: () => void;
}