import CompleteInput from "@/components/complete-input";
import { inputStoreT } from "@/types";

export default function PageOne(props: { store: inputStoreT }) {
  return (
    <>
      <CompleteInput
        id="first-name"
        label="First name"
        placeholder="Type your first name"
        onChange={(e) =>
          props.store.setInputValue("first-name", e.target.value)
        }
        value={props.store["first-name"] as string}
      />
      <CompleteInput
        id="last-name"
        label="Last name"
        placeholder="Type your last name"
        onChange={(e) => props.store.setInputValue("last-name", e.target.value)}
        value={props.store["last-name"] as string}
      />
    </>
  );
}
