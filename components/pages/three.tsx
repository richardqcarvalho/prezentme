import CompleteInput from "@/components/complete-input";
import { inputStoreT } from "@/types";

export default function PageThree(props: { store: inputStoreT }) {
  return (
    <>
      <CompleteInput
        id="company-name"
        label="Company"
        placeholder="Type company name"
      />
      <CompleteInput
        id="job-title"
        label="Job title"
        placeholder="Type job title"
      />
    </>
  );
}
