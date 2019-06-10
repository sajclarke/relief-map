import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import GeoJSON from 'geojson';
import axios from 'axios';

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2FqY2xhcmtlIiwiYSI6ImNqZnBzdGNqaDF6MHIzMmx6Mms0MjdzdGUifQ.bMDlpCAAgtZEDKofIv3Zww';

let map = null;
let popup = new mapboxgl.Popup();

class List extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    map = new mapboxgl.Map({
      container: this.mapContainer,
      center: [-61.289032, 10.458258],
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 8
      // minZoom: 9,
      // maxZoom: 18
    });

    map.on('load', () => {
      this.getList();
    });

    map.on('click', 'places', function(e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var description =
        e.features[0].properties.dropOffLocationName +
        ' ' +
        e.features[0].properties.address1;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup
        .setLngLat(coordinates)
        .setHTML('Desc: ' + description)
        .addTo(map);
    });
  }

  // Retrieves the list of items from the Express app
  getList = () => {
    axios.get('/api/points').then(res => {
      const list = res.data;

      console.log(GeoJSON.parse(list, { Point: ['latitude', 'longitude'] }));
      const markers = GeoJSON.parse(list, { Point: ['latitude', 'longitude'] });

      map.addLayer({
        id: 'places',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: markers
        },
        layout: {
          'icon-image': 'hospital-15',
          'icon-allow-overlap': true
        }
      });

      this.setState({ list });
    });
  };

  showMarker = item => {
    var coordinates = [parseFloat(item.longitude), parseFloat(item.latitude)];

    var description = item.dropOffLocationName + ' ' + item.address1;

    if (item.longitude && item.latitude && item.dropOffLocationName) {
      popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    } else {
      console.error('invalid coordinates ', coordinates);
    }
  };

  render() {
    const { list } = this.state;
    const map_style = {
      height: '100vh',
      width: '100wh'
    };
    console.log(list);

    return (
      <div className='App'>
        <div className='row'>
          <div className='left-column'>
            <h1>Relief Points</h1>
            {/* Check to see if any items are found*/}
            {list.length ? (
              <div>
                {/* Render the list of items */}
                {list.map(item => {
                  // console.log(item);
                  return (
                    <div
                      className='listItem'
                      onClick={() => this.showMarker(item)}
                    >
                      <p>{item.dropOffLocationName}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <h6>Now loading...</h6>
              </div>
            )}
          </div>
          <div className='right-column'>
            <div style={map_style} ref={el => (this.mapContainer = el)} />
          </div>
        </div>
      </div>
    );
  }
}

export default List;
