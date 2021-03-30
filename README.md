# Mapbox Solutions Architecture Technical Assessement

Requirements for the finished application: 
1. Choose a base style - or create a custom one based on your ideal user experience.
2. Identify a starting location via user-selection or browser location detection.
3. Enable users to search for a destination.
4. Once selected, plot a driving route and a driving-traffic route > show the ETA difference.
5. Enable the user to select a route.
6. Once the route is selected, animate the starting dot along the chosen route
    - Optional: pivot the camera to follow along (like a turn-by-turn app).
7. While animating, query our POI layer (with Tilequery API) to detect some Points of Interest along the route. If one pops up that you wish to highlight, throw a notification (e.g. "There's a Starbucks nearby).
8. At the end of the journey, stop the animation > "You've arrived"
9. Update the README with a description of what the application does, and instructions on how to run it.

If there are other things you think would be cool or useful - please feel free to add. Many or most of these features (or close approximations) can be found in our documentation.

## Running the app
This project uses Parcel, ESLint, and Prettier in the development environment.

`npm install`

`npm start`
