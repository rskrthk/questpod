import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/lib/dialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";

const ApplyJobModal = ({ isOpen, onClose, questions, onConfirm }) => {
  // Create validation schema dynamically based on questions
  const validationSchema = Yup.object().shape(
    questions.reduce((acc, q, index) => {
      if (q.mandatory) {
        acc[`question_${index}`] = Yup.string().required("This answer is required");
      }
      return acc;
    }, {})
  );

  const formik = useFormik({
    initialValues: questions.reduce((acc, _, index) => {
      acc[`question_${index}`] = "";
      return acc;
    }, {}),
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      // Map values back to questions structure if needed, or just send values
      const answers = questions.map((q, index) => ({
        question: q.question,
        answer: values[`question_${index}`],
      }));
      onConfirm(answers);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Additional Questions</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
          {questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {q.question} {q.mandatory && <span className="text-red-500">*</span>}
              </label>
              <textarea
                name={`question_${index}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[`question_${index}`]}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] ${
                  formik.touched[`question_${index}`] && formik.errors[`question_${index}`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Type your answer here..."
              />
              {formik.touched[`question_${index}`] && formik.errors[`question_${index}`] && (
                <div className="text-red-500 text-sm">{formik.errors[`question_${index}`]}</div>
              )}
            </div>
          ))}

          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Answers
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobModal;
