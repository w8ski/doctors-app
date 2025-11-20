import { Suspense } from "react";
import { TreatmentsPage } from "./(treatments)/treatments-page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TreatmentsPage />
    </Suspense>
  );
}
