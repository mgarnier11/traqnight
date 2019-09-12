import React from 'react';

const Footer = () => {
  return (
    <footer className="footer pt-4">
      <div className="container-fluid text-center text-md-left">
        <div className="row">
          <div className="col-md-6 mt-md-0 mt-3">
            <h5 className="text-uppercase">Traqnight Web Application</h5>
            <p>Powered by ReactJS, NodeJS and FeathersJS</p>
            <p>Datas provided by Here Places API and Google Map Places API</p>
          </div>

          <hr className="clearfix w-100 d-md-none pb-3" />

          <div className="col-md-3 mb-md-0 mb-3">
            <h5 className="text-uppercase">Links</h5>

            <ul className="list-unstyled">
              <li>
                <a
                  href="https://nodejs.org/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NodeJS <i className="fab fa-node-js"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://en.reactjs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ReactJS <i className="fab fa-react"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://feathersjs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FeathersJS
                </a>
              </li>
              <li>
                <a
                  href="https://developer.here.com/documentation/places/topics_api/resource-search.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Here Places API
                </a>
              </li>

              <li>
                <a
                  href="https://developers.google.com/places/web-service/search"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Maps Places API
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-md-0 mb-3">
            <h5 className="text-uppercase">About Me</h5>

            <ul className="list-unstyled">
              <li>
                <a
                  href="mailto:mgarnier11@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/mathieu-garnier-56b802132/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Linkedin
                </a>{' '}
              </li>
              <li>
                <a
                  href="http://mathieu-garnier.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My WebSite
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-copyright text-center py-3">
        © 2019 Copyright :{' '}
        <a href="http://mathieu-garnier.fr">Mathieu GARNIER</a>
      </div>
    </footer>
  );
};

export default Footer;
