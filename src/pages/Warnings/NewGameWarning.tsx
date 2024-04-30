import { WarningModal } from "../../components";

export default function NewGameWarning(): JSX.Element {
  return (
    <WarningModal
      title="Are you sure?"
    >
      <p>This will discard any unsaved progress.</p>
    </WarningModal>
  );
}
