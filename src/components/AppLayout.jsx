import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import ScrollToTopButton from "./ScrollToTopButton";
import AppAlert from "./AppAlert";

function AppLayout() {
    return (
        <>
        <AppHeader/>
        <AppAlert/>
        <Outlet/>
        <ScrollToTopButton/>
        <AppFooter/>
        </>
    )
}

export default AppLayout;