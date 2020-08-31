# Interactive Map

1. [Features](#features)
1. [Technologies and libraries used](#technology)
1. [Project structure](#structure)
1. [Start project](#start)
1. [ENV variables](#env)

### <a name="features">Features</a>

#### Area Map Page

-   creation area
-   show pop-up with zone selection
-   save or cancel the created area
-   deleting area
-   editing area

#### Area Identification Page

-   entering longitude and latitude
-   output of found areas

#### Grid Map Page

-   creation grid
-   displaying a popup with the title input, the number of columns and the number of lines
-   save or cancel the created grid
-   deleting grid

#### Grid Identification Page

-   entering longitude and latitude
-   output of found grid cell

#### Server

-   create area
-   update area
-   delete area
-   get area list
-   get zone list
-   search area by coordinates
-   create grid
-   delete grid
-   search grid cell by coordinates

### <a name="technology">Technologies and libraries used</a>

-   React
-   Leaflet
-   Turf
-   Axios
-   Leaflet geoman
-   Express
-   MySQL

### <a name="structure">Project structure</a>

```
├── src/                            # Client
|   ├── api/                        # Services for API interactions
|   ├── components/                 # React components
|   ├── map-controls/               # Leaflet controls
|   ├── pages/                      # Pages
|   ├── utils/                      # Utils
|   ├── App.js                      # Main component
|   ├── index.js                    # Enter component
|   └── index.scss                  # Styles css
└── server/                         # Server
    ├── components/                 # App components
    |   ├── area/
    |   ├── zone/
    |   └── grid/
    ├── config/                     # App config
    ├── middlewares/                # App middlewares
    ├── routes/                     # App routes
    └── db.js                       # Database connection
```

### <a name="start">Start project</a>

1. Rename the file .env.example to .env and enter all the necessary variables in it, the list below
2. Install all dependencies `npm i`

Npm scripts: <br> `npm run dev` - Run project in development mode <br> `npm run production` - Run project in production mode <br> `npm run build` - Build project

### <a name="env">ENV variables</a>

<table class="table table-bordered table-striped">
  <thead>
  <tr>
    <th style="width: 100px;">name</th>
    <th style="width: 50px;">type</th>
    <th style="width: 50px;">required</th>
    <th style="width: 100px;">default</th>
    <th>description</th>
  </tr>
  </thead>
  <tbody>
    <tr>
      <td>SERVER_PORT</td>
      <td>Number</td>
      <td>false</td>
      <td>5000</td>
      <td></td>
    </tr>
    <tr>
      <td>REACT_APP_MAPBOX_TOKEN</td>
      <td>String</td>
      <td>true</td>
      <td></td>
      <td>Mapbox token, required for map tiles (https://docs.mapbox.com/help/how-mapbox-works/access-tokens/)</td>
    </tr>
    <tr>
      <td>DB_HOST</td>
      <td>String</td>
      <td>true</td>
      <td></td>
      <td>Database host</td>
    </tr>
      <tr>
      <td>DB_USER</td>
      <td>String</td>
      <td>true</td>
      <td></td>
      <td>Database user</td>
    </tr>
    <tr>
      <td>DB_PASSWORD</td>
      <td>String</td>
      <td>true</td>
      <td></td>
      <td>Database password</td>
    </tr>
    <tr>
      <td>DB_NAME</td>
      <td>String</td>
      <td>true</td>
      <td></td>
      <td>Database name</td>
    </tr>
    <tr>
      <td>DB_PORT</td>
      <td>Number</td>
      <td>false</td>
      <td>3306</td>
      <td>Database port</td>
    </tr>    
  </tbody>
</table>
