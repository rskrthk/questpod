import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  submitEnquiryForm,
  resetEnquiryForm,
} from "@/redux/slices/enquirySlice";

const usePricingPopup = (selectedPlan, onClose) => {
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.enquiry);

  const plans = [
    "Basic Plan - $19/month",
    "Pro Plan - $39/month",
    "Career Plan - $89/month",
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    universityName: "",
    position: "",
    email: "",
    contactNumber: "",
    message: "",
    plan: selectedPlan || "",
  };

  const validationSchema = Yup.object().shape({
    universityName: Yup.string().required("Required"),
    position: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    contactNumber: Yup.string().required("Required"),
    message: Yup.string().required("Required"),
    plan: Yup.string().required("Please select a plan"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      await dispatch(submitEnquiryForm(values)).unwrap();
      toast.success("Enquiry submitted successfully!");
      resetForm();
      onClose();
    } catch (err) {
      toast.error(err || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (success) dispatch(resetEnquiryForm());
  }, [success, dispatch]);

  return {
    initialValues,
    validationSchema,
    handleSubmit,
    isSubmitting,
    plans,
  };
};

export default usePricingPopup;
