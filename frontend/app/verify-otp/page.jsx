"use client";

import { Suspense } from "react";
import Button from "../../components/Button/Button.jsx";
import axios from "axios";
import { useFormik } from "formik";
import "./login.css";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyOtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email");

    const formik = useFormik({
        initialValues: {
            otp: "",
            password: "",
        },

        validate: (values) => {
            const errors = {};

            if (!values.otp) {
                errors.otp = "OTP is required";
            }

            if (!values.password) {
                errors.password = "Password is required";
            } else if (values.password.length < 6) {
                errors.password = "Minimum 6 characters";
            }

            return errors;
        },

        onSubmit: async (values) => {
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/verify-otp`,
                    {
                        email,
                        otp: values.otp,
                        password: values.password,
                    }
                );

                alert(res.data.message || "Password Updated ✅");

                router.push("/admin");

            } catch (error) {
                console.log(error);
                alert(
                    error?.response?.data?.message || "Reset Failed ❌"
                );
            }
        },
    });

    return (
        <div className="mainWrapper">

            <div className="header">
                <Button
                    text="Home"
                    onClick={() => router.push("/")}
                />
            </div>

            <div className="heading">
                <h1>Reset Password</h1>
            </div>

            <div className="FormWrapper">
                <form onSubmit={formik.handleSubmit}>

                    <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formik.values.otp}
                        onChange={formik.handleChange}
                    />

                    {formik.errors.otp && (
                        <span className="error">{formik.errors.otp}</span>
                    )}

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter New Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />

                    {formik.errors.password && (
                        <span className="error">{formik.errors.password}</span>
                    )}

                    <button type="submit">
                        Update Password
                    </button>

                </form>
            </div>
        </div>
    );
}

export default function Newpassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOtpForm />
        </Suspense>
    );
}