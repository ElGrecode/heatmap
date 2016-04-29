
const React =  require('react');

class Map extends React.Component {
    constructor (props = {}) {
        super(props);
        const hasWindow = !!(typeof window === 'object');
        this.state = {
            width: (hasWindow) ? `${window.innerWidth}px` : '1280px',
            height: (hasWindow) ? `${window.innerHeight}px` : '1000px'
        };
        this.addResizeListener = this.addResizeListener.bind(this);
    }

    addResizeListener(){
        window.addEventListener('resize', ()=>{
            this.setState({
                width: `${window.innerWidth}px`,
                height: `${window.innerHeight}px`
            });
        });
    }


    componentDidMount(){
        this.addResizeListener();
    }

    render() {
        console.log('wi');
        const {height, width} = this.state;
        return (
            <div id='map' style={{height: height, width: width}}></div>
        );
    }
}

module.exports = Map;
