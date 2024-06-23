import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmail from "../pages/CheckEmail";
import CheckPassword from "../pages/CheckPassword";
import Home from "../pages/Home";
import Message from "../components/Message";
import AuthLayout from "../layout";
import ForgotPassword from "../pages/ForgotPassword";



const router = createBrowserRouter([
    {
        path: "/",
        element: <App></App>,
        children: [
            {
                path: "register",
                element: <AuthLayout><RegisterPage></RegisterPage></AuthLayout>
            },
            {
                path: "email",
                element: <AuthLayout><CheckEmail></CheckEmail></AuthLayout>
            },
            {
                path: "password",
                element: <AuthLayout><CheckPassword></CheckPassword></AuthLayout>
            },
            {
                path: "forgot-password",
                element: <AuthLayout><ForgotPassword></ForgotPassword></AuthLayout>
            },
            {
                path: "",
                element: <Home></Home>,
                children: [
                    {
                        path: ":userId",
                        element: <Message></Message>
                    }
                ]
            }
        ]
    }
]);

export default router;