import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateJob, viewJob } from "@/redux/slices/jobSlice";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function useAdminJobUpdate() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  const validationSchema = Yup.object({
    title: Yup.string().required("Job Title is required"),
    company: Yup.string().required("Company Name is required"),
    location: Yup.string().required("Location is required"),
    type: Yup.string().required("Job Type is required"),
    description: Yup.string().required("Job Description is required"),
    requirements: Yup.string(),
    salary: Yup.string(),
    applicationLink: Yup.string().url("Must be a valid URL"),
    companyIcon: Yup.mixed().nullable(),
    status: Yup.string(),
    noticePeriod: Yup.string(),
    skills: Yup.string(),
    experience: Yup.string(),
    expireIn: Yup.date().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: "",
      salary: "",
      applicationLink: "",
      companyIcon: null,
      status: "Active",
      noticePeriod: "",
      skills: "",
      experience: "",
      expireIn: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setError("");
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("id", jobId);
        
        Object.keys(values).forEach(key => {
            if (key === 'expireIn') {
                 if (values[key]) formData.append(key, values[key]);
            } else if (values[key] !== null && values[key] !== undefined) {
                 formData.append(key, values[key]);
            }
        });

        await dispatch(updateJob(formData)).unwrap();
        toast.success("Job updated successfully!");
        router.push("/admin-job");
      } catch (err) {
        const msg = typeof err === "string" ? err : "Failed to update job";
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        return;
      }
      setLoadingData(true);
      try {
        const data = await dispatch(viewJob(jobId)).unwrap();
        if (data) {
          formik.setValues({
            title: data.title || "",
            company: data.company || "",
            location: data.location || "",
            type: data.type || "Full-time",
            description: data.description || "",
            requirements: data.requirements || "",
            salary: data.salary || "",
            applicationLink: data.applicationLink || "",
            companyIcon: data.companyIcon || null,
            status: data.status || "Active",
            noticePeriod: data.noticePeriod || "",
            skills: data.skills || "",
            experience: data.experience || "",
            expireIn: data.expireIn ? data.expireIn.split('T')[0] : "",
          });
        }
      } catch (err) {
        toast.error("Failed to fetch job details");
        router.push("/admin-job");
      } finally {
        setLoadingData(false);
      }
    };

    fetchJobDetails();
  }, [jobId, dispatch, router]);

  return {
    formik,
    isLoading,
    loadingData,
    error,
  };
}
