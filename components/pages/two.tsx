import CompleteInput from "@/components/complete-input";
import { inputStoreT } from "@/types";

export default function PageTwo(props: { store: inputStoreT }) {
  return (
    <>
      <CompleteInput
        id="product-name"
        label="Product name"
        placeholder="Type your product name"
      />
    </>
  );
}
