import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import LoginForm from "../components/forms/LoginForm";

const Login = () => {

   return (
      <div>
         <LoginForm />
      </div>
   )
}

export default Login;