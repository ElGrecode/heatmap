
const React =  require('react'),
    ReactDOM = require("react-dom"),
    mountNode = document.getElementById("app");


const VivvalApp = React.createClass({
  render() {

    return (
      <div>
        <h3>TODO</h3>
      </div>
    );
  }
});


ReactDOM.render(<VivvalApp />, mountNode);
