import React from "react";
import { BrowserRouter as Router, Switch, Route, NavLink as Link, Redirect } from "react-router-dom";
import { AreaMapPage } from "./pages/areas-map";
import { AreaIdentificationPage } from "./pages/areas-identification";
import { GridIdentificationPage } from "./pages/grid-identification";
import { GridMapPage } from "./pages/grid-map";
import "./app.scss";

const routes = [];

const createRoute = (url, title, component) => {
    routes.push({
        url,
        title,
        component,
    });
};

createRoute("/area-map", "Area Map", <AreaMapPage />);
createRoute("/area-identification", "Area Identification", <AreaIdentificationPage />);
createRoute("/grid-map", "Grid Map", <GridMapPage />);
createRoute("/grid-identification", "Grid Identification", <GridIdentificationPage />);

const baseClass = "app";

export const App = () => {
    return (
        <Router>
            <div className={baseClass}>
                <nav className={`${baseClass}__nav`}>
                    <ul className={`${baseClass}__nav-list`}>
                        {routes.map(({ url, title }) => {
                            return (
                                <li>
                                    <Link
                                        to={url}
                                        className={`${baseClass}__nav-item`}
                                        activeClassName={`${baseClass}__nav-item_active`}
                                    >
                                        {title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className={`${baseClass}__page`}>
                    <Switch>
                        {routes.map(({ url, component }) => {
                            return <Route path={url}>{component}</Route>;
                        })}
                        <Redirect to={routes.areaMap} />
                    </Switch>
                </div>
            </div>
        </Router>
    );
};
