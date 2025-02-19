import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import ScrollToTopButton from "./ScrollToTopButton";

function AppLayout() {
    return (
        <>
        <AppHeader/>
        <Outlet/>
        <ScrollToTopButton/>
        <AppFooter/>
        </>
    )
}

export default AppLayout;