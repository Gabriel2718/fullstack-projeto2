import { Grid } from "./Grid";
import { PageProvider } from "../../contexts/MainContext";
import { Header } from "../header-components/Header";
import { PageNavigator } from "./PageNavigator";
import '../style.css';

export function MainPage() {
    return <div className="body">
        <PageProvider>
            <Header />
            <Grid />
            <PageNavigator />
        </PageProvider>
    </div>
}