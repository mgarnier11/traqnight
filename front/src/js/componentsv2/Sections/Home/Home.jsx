import React, { Component, Ref } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPlaces } from '../../../redux/actions/place-actions';

const mapStateToProps = state => {
  return {
    types: state.typesRequest.types,
    placesLoading: state.placesRequest.loading
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getPlaces: params => dispatch(getPlaces(params))
  };
}

class Home extends Component {
  static propTypes = {
    types: PropTypes.arrayOf(PropTypes.object).isRequired,
    scrollTo: PropTypes.func.isRequired
  };

  static defaultProps = {
    types: [],
    scrollTo: p => console.log(p)
  };

  constructor(props) {
    super(props);

    this.state = {
      type: '',
      location: 'Nantes'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.props.placesLoading) {
      const { type, location } = this.state;
      this.props.getPlaces({
        typeId: type === '' ? this.props.types[0]._id : type,
        location,
        radius: 1000
      });
      this.props.scrollTo('results');
    }
  }

  render() {
    const { type, location } = this.state;

    return (
      <div className="home container-fluid" ref={this.props.reference}>
        <div className="container">
          <div className="title text-center">
            <h1>Explorez votre ville</h1>
            <h2>Ne cherchez plus où sortir! Trouvez!</h2>
          </div>

          <form className="form" onSubmit={this.handleSubmit}>
            <div className="form-group mx-md-5 px-md-5">
              <label htmlFor="type">
                <h3>Quoi ?</h3>
              </label>
              <select
                className="form-control"
                id="type"
                value={type}
                onChange={this.handleChange}
              >
                {this.props.types.map(t => {
                  return (
                    <option value={t._id} key={t._id}>
                      {t.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group mx-md-5 px-md-5">
              <label htmlFor="location">
                <h3>Ou ?</h3>
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                placeholder="Votre ville"
                value={location}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group text-center">
              <button
                type="submit"
                className="btn btn-lg btn-light"
                disabled={this.props.placesLoading}
              >
                Trouvez !
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
