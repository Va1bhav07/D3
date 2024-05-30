import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Equalizer,
  BarChart,
  Timeline,
  PieChart as PieChartIcon,
  Radar as RadarIcon,
  DonutLarge,
} from "@mui/icons-material";

import "./App.css";
import HierarchicalBarChart from "./components/HierarchicalBarChart";
import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart";
import GroupedBarChart from "./components/GroupedBarChart";
import Spinner from "./Spinner/index";
import { Radar } from "./components/RadarChart";
import { DonutChart } from "./components/DonutChart";

function App() {
  const [loading, setLoading] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/");

  const handleNavLinkClick = (to) => {
    setLoading(true);
    setActiveRoute(to);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const sidebarItems = [
    { to: "/", text: "Hierarchical Bar Chart", icon: <Equalizer /> },
    { to: "/group-chart", text: "Grouped Bar Chart", icon: <BarChart /> },
    { to: "/line-chart", text: "Line Chart", icon: <Timeline /> },
    { to: "/pie", text: "Pie Chart", icon: <PieChartIcon /> },
    {
      to: "/radar-chart",
      text: "Radar Chart",
      icon: <RadarIcon />,
    },
    {
      to: "/donut-chart",
      text: "Donut Chart",
      icon: <DonutLarge />,
    },
  ];

  return (
    <Router>
      <div className="app-container">
        <Drawer variant="permanent" className="drawer">
          <div className="drawer-gradient"></div>
          <List>
            {sidebarItems.map((item, index) => (
              <ListItem
                key={index}
                button
                component={NavLink}
                to={item.to}
                activeclassname="active-link"
                className={activeRoute === item.to ? "active-link" : ""}
                onClick={() => handleNavLinkClick(item.to)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <div className="main-content">
          <h2 className="align-items-left">
            Visualizing Statistics of FIFA Players
          </h2>
          {loading ? (
            <div className="loader-container">
              <Spinner loading={loading} color={"darkblue"} />
              <div style={{ color: "darkblue" }}>Please Wait.</div>
            </div>
          ) : (
            <Routes>
              {sidebarItems.map((item, index) => (
                <Route
                  key={index}
                  path={item.to}
                  element={
                    <div style={{ marginTop: "100px" }}>
                      <div className="chart">
                        {item.to === "/" && (
                          <HierarchicalBarChart player="All" />
                        )}
                        {item.to === "/hierarchical" && (
                          <HierarchicalBarChart player="All" />
                        )}
                        {item.to === "/pie" && <PieChart />}
                        {item.to === "/line-chart" && <LineChart />}
                        {item.to === "/group-chart" && <GroupedBarChart />}
                        {item.to === "/donut-chart" && <DonutChart />}

                        {item.to === "/radar-chart" && (
                          <Radar
                            axisConfig={[
                              { name: "goals", max: 100 },
                              { name: "speed", max: 100 },
                              { name: "strength", max: 100 },
                              { name: "accuracy", max: 100 },
                              { name: "assists", max: 100 },
                              { name: "penalties", max: 100 },
                            ]}
                          />
                        )}
                      </div>
                    </div>
                  }
                />
              ))}
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
