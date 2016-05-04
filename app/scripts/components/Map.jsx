
const React =  require('react');
const superclusterWorker = new Worker('superclusterWorker.js');
var ready = false;

function createClusterIcon(feature, latlng) {
    console.log('feature', feature);
    if (!feature.properties.cluster) return L.marker(latlng);

    var count = feature.properties.point_count;
    var size =
        count < 100 ? 'small' :
        count < 1000 ? 'medium' : 'large';
    var icon = L.divIcon({
        html: '<div><span>' + feature.properties.point_count_abbreviated + '</span></div>',
        className: 'marker-cluster marker-cluster-' + size,
        iconSize: L.point(40, 40)
    });
    return L.marker(latlng, {icon: icon});
}

class Map extends React.Component {
    constructor (props = {}) {
        super(props);
        const hasWindow = !!(typeof window === 'object');
        this.state = {
            map: {},
            width: (hasWindow) ? `${window.innerWidth}px` : '1280px',
            height: (hasWindow) ? `${window.innerHeight}px` : '1000px'
        };
        this.addResizeListener = this.addResizeListener.bind(this);
        this.addWorkerListener = this.addWorkerListener.bind(this);
        this.updateMap = this.updateMap.bind(this);
    }

    removeLayer( layerId ){
        const {map} = this.state;
        map.removeLayer(layerId);
    }

    addMarkerLayer( data ){
        console.log('data', data);
        const {map} = this.state;
        map.addSource('markers', {
            'type': 'geojson',
            'data': data
        })
        map.addLayer({
            'id': 'markers',
            'type': 'symbol',
            'source': 'markers',
            'layout': {
                'icon-image': '{marker-symbol}-15',
                'text-field': '{title}',
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.6],
                'text-anchor': 'top'
            }
    });

    }

    addResizeListener(){
        window.addEventListener('resize', ()=>{
            this.setState({
                width: `${window.innerWidth}px`,
                height: `${window.innerHeight}px`
            });
        });
    }

    updateMap() {
        console.log('updating the map');
        const {map} = this.state;
        if (!ready) return;
        const bounds = map.getBounds();
        superclusterWorker.postMessage({
            bbox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
            zoom: Math.floor(map.getZoom())
        });
    }

    addWorkerListener(){
        superclusterWorker.onmessage = (e) => {
            console.log('message from superclusterWorker', e);
            if (e.data.ready) {
                ready = true;
                this.updateMap();
            } else {
                this.removeLayer('markers');
                const geoJSON = {
                    "type": "FeatureCollection",
                    "features": e.data
                };
                this.addMarkerLayer(geoJSON);
            }
        };
    }

    componentWillMount(){
        this.addWorkerListener();
    }

    componentDidMount(){
        mapboxgl.accessToken = 'pk.eyJ1IjoiZWxncmVjb2RlIiwiYSI6ImNpbmp0YnlobjB4b2R0cWtqYnY3b2x3YXQifQ.s-o2L-VKxDJ2HttK2ooSPQ';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/elgrecode/cinl8e29t000hb1lzmn23j2pc'
        });

        // Set up event listeners
        map.on('moveend', this.updateMap);
        map.on('load', ()=>{
            this.addResizeListener();
        });

        this.setState({ map: map });

        //
        // setTimeout(()=>{ // check for on ready event
        //     var markers = L.geoJson(null, {
        //         pointToLayer: createClusterIcon
        //     })
        //
        //
        //
        //
        // }, 2000)
    }

    render() {
        const {height, width} = this.state;
        return (
            <div id='map' style={{height: height, width: width}}></div>
        );
    }
}

module.exports = Map;
