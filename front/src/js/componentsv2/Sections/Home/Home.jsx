import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return { types: state.types };
};

class Home extends Component {
  static propTypes = {
    types: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {
    types: []
  };

  constructor(props) {
    super(props);

    this.state = {
      type: '',
      location: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    //const { type, location } = this.state;
    //this.props.addArticle({ title, id });
    //this.setState({ title: '' });
  }

  render() {
    const { type, location } = this.state;

    return (
      <div className="home container-fluid" ref={this.props.refere}>
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
                    <option value={t.id} key={t.id}>
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
              <button type="submit" className="btn btn-lg btn-light">
                Trouvez !
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Home);