import React from "react";
import { User, Mail, Lock, Code } from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../components/InputField";
import SelectDropdown from "../components/SelectDropdown";
import Button from "../components/Button";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom"; // ✅ Added

// Options & default values
const roleOptions = [
  { value: "developer", label: "Developer" },
  { value: "mentor", label: "Mentor" },
  { value: "admin", label: "Admin" },
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const defaultSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "01:00-02:00",
  "02:00-03:00",
];

// Validation schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
  role: Yup.string().required("Role is required"),
  skills: Yup.string().optional(),
  experience: Yup.string().when("role", {
    is: "mentor",
    then: (schema) => schema.required("Experience is required for mentors"),
    otherwise: (schema) => schema.optional(),
  }),
  availability: Yup.array().when("role", {
    is: "mentor",
    then: (schema) =>
      schema.of(Yup.string()).min(1, "Select at least one available slot"),
    otherwise: (schema) => schema.optional(),
  }),
});

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate(); // ✅ Added

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const user = await signup(values); // signup still updates context

      // ✅ Explicit navigation based on role
      switch (user.role) {
        case "mentor":
          navigate("/mentor-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/user-dashboard");
          break;
      }
    } catch (error) {
      console.error(error);
      setErrors({
        email: error.response?.data?.message || error.message || "Signup failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center font-sans overflow-hidden">
      <div className="w-full max-w-5xl h-[90vh] max-h-[700px] flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden m-4">
        {/* Branding Panel */}
        <div className="w-full md:w-2/5 bg-[#043873] text-white p-10 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <div className="bg-white text-[#043873] font-bold text-xl rounded-md px-4 py-2 mb-6">DC</div>
          <h1 className="text-3xl font-bold mb-3">DevConnect</h1>
          <p className="text-gray-200 text-base leading-relaxed">
            Join DevConnect and start collaborating with developers and mentors.
          </p>
        </div>

        {/* Form Panel */}
        <div className="w-full md:w-3/5 p-8 sm:p-10 flex flex-col overflow-hidden">
          <div className="max-w-md mx-auto w-full flex flex-col h-full">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600 mb-6">Sign up to get started.</p>
            </div>

            <div className="flex-grow overflow-y-auto pr-4 -mr-4">
              <Formik
                initialValues={{
                  name: "",
                  username: "",
                  email: "",
                  password: "",
                  role: "",
                  skills: "",
                  experience: "",
                  availability: [],
                }}
                validationSchema={SignupSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form className="space-y-4">
                    <InputField label="Full Name" name="name" icon={User} />
                    <InputField label="Username" name="username" icon={User} />
                    <InputField label="Email" name="email" type="email" icon={Mail} />
                    <InputField label="Password" name="password" type="password" icon={Lock} />
                    <SelectDropdown label="Role" name="role" options={roleOptions} />
                    <InputField
                      label="Skills (Optional)"
                      name="skills"
                      placeholder="React, Node.js"
                      icon={Code}
                    />

                    {values.role === "mentor" && (
                      <>
                        <InputField
                          label="Experience"
                          name="experience"
                          placeholder="e.g., 5 years in backend"
                          icon={Code}
                        />
                        <div className="space-y-3 pt-2">
                          <label className="block text-sm font-medium text-gray-800">Availability</label>
                          {weekdays.map((day) => (
                            <div key={day}>
                              <p className="text-sm font-medium mb-1.5">{day}</p>
                              <div className="flex flex-wrap gap-1">
                                {defaultSlots.map((slot) => {
                                  const slotValue = `${day} ${slot}`;
                                  const selected = values.availability.includes(slotValue);
                                  return (
                                    <label
                                      key={slotValue}
                                      className={`text-[11px] font-medium px-2 py-1 border rounded-md cursor-pointer transition-colors ${
                                        selected
                                          ? "bg-[#043873] text-white border-[#043873]"
                                          : "bg-white hover:bg-gray-100"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() => {
                                          if (selected) {
                                            setFieldValue(
                                              "availability",
                                              values.availability.filter((v) => v !== slotValue)
                                            );
                                          } else {
                                            setFieldValue("availability", [
                                              ...values.availability,
                                              slotValue,
                                            ]);
                                          }
                                        }}
                                        className="hidden"
                                      />
                                      {slot}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <Button type="submit" loading={isSubmitting}>
                      {isSubmitting ? "Signing up..." : "Sign Up"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6 flex-shrink-0">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-[#043873] hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
