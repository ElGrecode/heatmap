
const React =  require('react'),
    ReactDOM = require("react-dom"),
    mountNode = document.getElementById("app");

// Components
const Map = require('./components/Map.jsx');

const VivvalApp = React.createClass({
  render() {

    return (
      <div>
        <Map />
      </div>
    );
  }
});


ReactDOM.render(<VivvalApp />, mountNode);
