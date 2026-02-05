import AdminJobApplications from "@/pagess/AdminPages/AdminJobApplications/AdminJobApplications";

export default async function Page({ params }) {
  const { id } = await params;
  return <AdminJobApplications id={id} />;
}
