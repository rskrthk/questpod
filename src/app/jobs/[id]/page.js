import JobDetailsPage from "@/pagess/JobDetailsPage/JobDetailsPage";

export default async function Page({ params }) {
  const { id } = await params;
  return <JobDetailsPage id={id} />;
}
