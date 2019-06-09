import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import GeoJSON from "geojson";
import axios from "axios";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FqY2xhcmtlIiwiYSI6ImNqZnBzdGNqaDF6MHIzMmx6Mms0MjdzdGUifQ.bMDlpCAAgtZEDKofIv3Zww";

let map = null;

class List extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  // Fetch the list on first mount
  componentWillMount() {}

  componentDidMount() {
    map = new mapboxgl.Map({
      container: this.mapContainer,
      center: [-61.289032, 10.458258],
      style: "mapbox://styles/mapbox/streets-v9",
      zoom: 8
      // minZoom: 9,
      // maxZoom: 18
    });

    // const { list } = this.state;
    // console.log(list);
    map.on("load", () => {
      this.getList();
    });

    map.on("click", "places", function(e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var description =
        e.features[0].properties.address1 +
        " " +
        e.features[0].properties.dropOffLocationName;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });
  }

  // Retrieves the list of items from the Express app
  getList = () => {
    axios.get("/api/points").then(res => {
      const list = res.data;

      console.log(GeoJSON.parse(list, { Point: ["latitude", "longitude"] }));
      const markers = GeoJSON.parse(list, { Point: ["latitude", "longitude"] });

      // list.map(item => {
      //   var marker = new mapboxgl.Marker()
      //     .setLngLat([item.longitude, item.latitude])
      //     .addTo(map);
      // });
      map.addLayer({
        id: "places",
        type: "symbol",
        source: {
          type: "geojson",
          data: markers
        },
        layout: {
          "icon-image": "barcelona-metro",
          "icon-allow-overlap": true
        }
      });

      this.setState({ list });
    });
  };

  render() {
    const { list } = this.state;
    const map_style = {
      height: "100vh",
      width: "100wh"
      // visibility: show_map ? "visibile" : "hidden"
    };
    console.log(list);

    return (
      <div className="App">
        <div style={map_style} ref={el => (this.mapContainer = el)} />
        <h1>List of Items</h1>
        {/* Check to see if any items are found*/}
        {list.length ? (
          <div>
            {/* Render the list of items */}
            {list.map(item => {
              // console.log(item);
              return <div>{item.dropOffLocationName}</div>;
            })}
          </div>
        ) : (
          <div>
            <h2>No List Items Found</h2>
          </div>
        )}
      </div>
    );
  }
}

export default List;
