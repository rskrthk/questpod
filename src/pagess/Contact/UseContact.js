import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  submitContactForm,
  resetContactForm,
} from "@/redux/slices/contactSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useContactForm = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state?.contact);

  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    universityName: "",
    name: "",
    email: "",
    phone: "",
    issueType: "",
    message: "",
    attachment: null,
  };

  const validationSchema = Yup.object({
    universityName: Yup.string(),
    name: Yup.string().required("Your name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    issueType: Yup.string().required("Please select your role"),
    message: Yup.string().required("Message is required"),
    attachment: Yup.mixed().nullable(),
  });

  // Updated handleSubmit to accept a local reset function for file states
  const handleSubmit = async (values, { resetForm, resetFileStates }) => {
    setSubmitting(true);
    try {
      await dispatch(submitContactForm(values)).unwrap();
      toast.success("Feedback submitted successfully!");
      resetForm();
      if (resetFileStates) {
        resetFileStates(); // Call the passed resetFileStates function
      }
    } catch (err) {
      toast.error("Submission failed: " + (err?.message || "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => dispatch(resetContactForm());
  }, [dispatch]);

  return {
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
    success,
    error,
    submitting,
  };
};

export default useContactForm;