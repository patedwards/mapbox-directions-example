import Map from "./Map";
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import Task from "./Task";
import { useState, useEffect } from "react";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));



const Controls = (props) => {
  const classes = useStyles();
  return (
    <Drawer anchor={"left"} open={true} variant="persistent" className={classes.drawer} classes={{
      paper: classes.drawerPaper,
    }}>
      {props.tasks.map((task) => <Task title={task.name} onSelect={task.onSelect}/>)}
    </Drawer>
  )
}

const App = () => {
  const [mapTools, setMapTools] = useState([null])
  const [routes, setRoutes] = useState([])
  //const [routeEndpoint, setRouteEndpoint] = useState([-74.5, 40])
  //const [routeStartpoint, setRouteStartpoint] = useState([-74.5, 40.1])

  const [activeTask, setActiveTask] = useState(null)

  const actions = {
 
  }
  
  const tasks = [
    {
      name: "Choose starting point",
      onSelect: () => {
        setActiveTask("get-start");
      },
    },
    {
      name: "Choose destination",
      onSelect: () => {
        setActiveTask("get-end");

      },
    },
    {
      name: "Calculate routes",
    },
    {
      name: "Choose route"
    },
    {
      name: "Route preview"
    }
  ]

  return (
    <div>
      <Map activeTask={activeTask}/>
      <Controls tasks={tasks}/>
    </div>
  )
};

export default App;