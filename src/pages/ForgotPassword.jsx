 import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Mail, Lock, KeyRound, ArrowLeft } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import api from "../api/axios";

// ====================
// Validation Schemas
// ====================

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
});

const ResetPasswordSchema = Yup.object().shape({
    otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
    newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New Password is required"),
});

// --- Main Component ---

export default function ForgotPassword() {
    const [view, setView] = useState('forgot'); // 'forgot' or 'reset'
    const [userEmail, setUserEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendOtp = async (values, { setSubmitting, setErrors }) => {
        try {
            await api.post('/auth/forgot-password', { email: values.email });
            
            // On success:
            setUserEmail(values.email);
            setView('reset');

        } catch (error) {
            setErrors({ email: error.response?.data?.message || 'Failed to send OTP.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetPassword = async (values, { setSubmitting, setErrors }) => {
        const submissionData = { email: userEmail, otp: values.otp, newPassword: values.newPassword };
        
        try {
            await api.post('/auth/reset-password', submissionData);
            
            // On success:
            setSuccessMessage("Password has been reset successfully! Redirecting to login...");
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (error) {
            setErrors({ otp: error.response?.data?.message || 'Failed to reset password.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex items-center justify-center font-sans overflow-hidden">
            <div className="w-full max-w-4xl h-[90vh] max-h-[600px] flex flex-row bg-white shadow-2xl rounded-2xl overflow-hidden m-4">

                {/* Branding Panel */}
                <div className="w-2/5 bg-[#043873] text-white p-10 hidden md:flex flex-col justify-center items-start">
                    <div className="bg-white text-[#043873] font-bold text-xl rounded-md px-4 py-2 mb-6">DC</div>
                    <h1 className="text-3xl font-bold mb-3">DevConnect</h1>
                    <p className="text-gray-200 text-base leading-relaxed">
                        Securely manage your account and get back to connecting with developers.
                    </p>
                </div>

                {/* Form Panel */}
                <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col justify-center">
                    <div className="max-w-sm mx-auto w-full">
                        {successMessage ? (
                            <div className="text-center">
                                 <h2 className="text-2xl font-bold text-gray-900 mb-4">Success!</h2>
                                 <p className="text-gray-600">{successMessage}</p>
                            </div>
                        ) : (
                            <>
                                {view === 'forgot' ? (
                                    // Forgot Password View
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
                                        <p className="text-gray-600 mb-8">Enter your email to receive a reset OTP.</p>
                                        <Formik
                                            initialValues={{ email: '' }}
                                            validationSchema={ForgotPasswordSchema}
                                            onSubmit={handleSendOtp}
                                        >
                                            {({ isSubmitting }) => (
                                                <Form className="space-y-6">
                                                    <InputField label="Email Address" name="email" type="email" icon={Mail} />
                                                    <Button loading={isSubmitting}>
                                                        {isSubmitting ? "Sending..." : "Send OTP"}
                                                    </Button>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                ) : (
                                    // OTP Reset View
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
                                        <p className="text-gray-600 mb-8">An OTP was sent to <span className="font-semibold">{userEmail}</span>.</p>
                                        <Formik
                                            initialValues={{ otp: '', newPassword: '' }}
                                            validationSchema={ResetPasswordSchema}
                                            onSubmit={handleResetPassword}
                                        >
                                            {({ isSubmitting }) => (
                                                <Form className="space-y-6">
                                                    <InputField label="6-Digit OTP" name="otp" type="text" icon={KeyRound} />
                                                    <InputField label="New Password" name="newPassword" type="password" icon={Lock} />
                                                    <Button loading={isSubmitting}>
                                                        {isSubmitting ? "Resetting..." : "Reset Password"}
                                                    </Button>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                )}

                                <p className="text-center text-sm text-gray-600 mt-8">
                                    <a href="/login" className="font-semibold text-[#043873] hover:underline inline-flex items-center">
                                        <ArrowLeft className="w-4 h-4 mr-1"/>
                                        Back to Login
                                    </a>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}