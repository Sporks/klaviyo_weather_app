import React from 'react';
import {Button, Panel, FormControl, FormGroup, ControlLabel} from 'react-bootstrap';


// Flexibility with formGroups
class FieldGroup extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <FormGroup controlId={this.props.id}>
        <ControlLabel>{this.props.label}</ControlLabel>
        <FormControl {...this.props} />
      </FormGroup>
    );
  }
}


class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      cities: [],
      city: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Grab the list of cities from the server and built up an array of options for the select menu
    $.ajax({
      url: '/cities',
      method: 'GET'
    }).done(data =>{
      let cities = [];
      data = JSON.parse(data);
      for (let i = 0; i < data.length; i++) {
        cities.push(<option key={data[i].id} value={data[i].city}> {data[i].city} </option>);
      }
      this.setState({cities: cities})
    });
  }

  handleChange(event) {
    //Handle the changes so we can set our state properly
    if(event.target.id === 'citySelect') {
      this.setState({city: event.target.value});
    }
    else if (event.target.id === 'emailField') {
      this.setState({email: event.target.value});
    }
  }

  handleSubmit(event) {
    // If they didn't input a city send them an alert
    if (this.state.city === '') {
      alert('Please select a city.');
    } else if (this.state.email === '') {
      alert('Please input an email address');
    }
    else {
      $.ajax({
          url: '/submit',
          method: 'POST',
          data: {email: this.state.email, city: this.state.city}
      })
    }
    event.preventDefault();
  }

  render() {
    const title = (
      <h3>Weather Powered Email</h3>
    )
    return (
        <Panel header={title}>
          <form onSubmit={this.handleSubmit}>
            <FieldGroup
              id="emailField"
              type="email"
              onChange={this.handleChange}
              label="Email Address"
              placeholder="Please enter your email address"
            />
            <FieldGroup
              id="citySelect"
              componentClass="select"
              onChange={this.handleChange}
              label="City"
              placeholder="Location">
                <option value=""> Please select your city </option>
                {this.state.cities}
            </FieldGroup>
            <div className="buttonContainer">
              <Button className="col-md-4 text-center" bsStyle="primary" type="submit"> Subscribe </Button>
            </div>
          </form>
        </Panel>
    );
  }
}

export default Signup;
