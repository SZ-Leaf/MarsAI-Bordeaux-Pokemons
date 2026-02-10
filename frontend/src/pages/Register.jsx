import React from "react";
import RegisterForm from "../components/forms/RegisterForm";
import { useLocation, Navigate } from "react-router";

const Register = () => {
   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);
   const token = searchParams.get('token') || "";
   const email = searchParams.get('email') || "";

   if (!token || !email) {
      return <Navigate to="/" />;
   }

   return (
      <div>
         <RegisterForm token={token} email={email} />
      </div>
   );
};

export default Register;