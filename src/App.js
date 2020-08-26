import React from "react";
import { BrowserRouter as Router, Switch, Route, NavLink as Link, Redirect } from "react-router-dom";
import { AreaMapPage } from "./pages/areas-map";
import { AreaIdentificationPage } from "./pages/areas-identification";
import { GridIdentificationPage } from "./pages/grid-identification";
import { GridMapPage } from "./pages/grid-map";
import "./app.scss";

const routes = {
    areaIdentification: "/area-identification",
    areaMap: "/area-map",
    gridIdentification: "/grid-identification",
    gridMap: "/grid-map",
};

const baseClass = "app";

export const App = () => {
    return (
        <Router>
            <div className={baseClass}>
                <nav className={`${baseClass}__nav`}>
                    <ul className={`${baseClass}__nav-list`}>
                        <li>
                            <Link
                                to={routes.areaMap}
                                className={`${baseClass}__nav-item`}
                                activeClassName={`${baseClass}__nav-item_active`}
                            >
                                Areas Map
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={routes.areaIdentification}
                                className={`${baseClass}__nav-item`}
                                activeClassName={`${baseClass}__nav-item_active`}
                            >
                                Area Identification
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={routes.gridIdentification}
                                className={`${baseClass}__nav-item`}
                                activeClassName={`${baseClass}__nav-item_active`}
                            >
                                Grid Identification
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={routes.gridMap}
                                className={`${baseClass}__nav-item`}
                                activeClassName={`${baseClass}__nav-item_active`}
                            >
                                Grid Map
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className={`${baseClass}__page`}>
                    <Switch>
                        <Route path={routes.areaMap}>
                            <AreaMapPage />
                        </Route>
                        <Route path={routes.areaIdentification}>
                            <AreaIdentificationPage />
                        </Route>
                        <Route path={routes.gridIdentification}>
                            <GridIdentificationPage />
                        </Route>
                        <Route path={routes.gridMap}>
                            <GridMapPage />
                        </Route>
                        <Redirect to={routes.areaMap} />
                    </Switch>
                </div>
            </div>
        </Router>
    );
};
