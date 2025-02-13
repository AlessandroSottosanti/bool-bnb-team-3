import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

function AppLayout() {
    return (
        <>
        <AppHeader/>
        <Outlet/>
        <AppFooter/>
        </>
    )
}

export default AppLayout;