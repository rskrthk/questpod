import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createJob } from "@/redux/slices/jobSlice";
import { useState } from "react";

export function useAdminJobCreate() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    noticePeriod: Yup.string(),
    skills: Yup.string(),
    experience: Yup.string(),
    expireIn: Yup.date().nullable(),
    hiringProcess: Yup.string(),
    customQuestions: Yup.array().of(
      Yup.object().shape({
        question: Yup.string().required("Question is required"),
        mandatory: Yup.boolean(),
      })
    ),
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
      noticePeriod: "",
      skills: "",
      experience: "",
      expireIn: "",
      hiringProcess: "",
      customQuestions: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (key === 'expireIn') {
                 if (values[key]) formData.append(key, values[key]);
            } else if (key === 'customQuestions') {
                 formData.append(key, JSON.stringify(values[key]));
            } else if (values[key] !== null && values[key] !== undefined) {
                formData.append(key, values[key]);
            }
        });

        await dispatch(createJob(formData)).unwrap();
        toast.success("Job created successfully!");
        router.push("/admin-job");
      } catch (error) {
        toast.error(error || "Failed to create job");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return {
    formik,
    isSubmitting,
  };
}
