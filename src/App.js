import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { AreaMapPage } from "./pages/areas-map";
import { AreaIdentificationPage } from "./pages/areas-identification";
import { GridIdentificationPage } from "./pages/grid-identification";
import { GridMapPage } from "./pages/grid-map";

const routes = {
    areaIdentification: "/area-identification",
    areaMap: "/area-map",
    gridIdentification: "/grid-identification",
    gridMap: "/grid-map",
};

export const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to={routes.areaMap}>Areas Map</Link>
                        </li>
                        <li>
                            <Link to={routes.areaIdentification}>Area Identification</Link>
                        </li>
                        <li>
                            <Link to={routes.gridIdentification}>Grid Identification</Link>
                        </li>
                        <li>
                            <Link to={routes.gridMap}>Grid Map</Link>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path={routes.areaMap}>
                        <AreaMapPage />
                    </Route>
                    <Route path={routes.areaIdentification} >
                        <AreaIdentificationPage />
                    </Route>
                    <Route path={routes.gridIdentification} >
                        <GridIdentificationPage />
                    </Route>
                    <Route path={routes.gridMap} >
                        <GridMapPage />
                    </Route>
                    <Redirect to={routes.areaMap} />
                </Switch>
            </div>
        </Router>
    );
};
