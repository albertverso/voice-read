import { About } from "../pages/About";
import { Contact } from "../pages/Contact";
import { HomePage } from "../pages/HomePage";
import { Navigate, useRoutes} from "react-router-dom"
import { HowToUse } from "../pages/HowToUse.tsx";

export function RoutesApp() {
    return useRoutes( [
        { path: "/", element: <Navigate to="/home" replace /> },
        { path: "/home", element: <HomePage /> },
        {
            path: '*',
            element: <HomePage />,
        },
        {
            path: '/contato',
            element: <Contact />,
        },
        {
            path: '/sobre',
            element: <About />,
        },
        {
            path: '/como-usar',
            element: <HowToUse />,
        }
    ]);
}