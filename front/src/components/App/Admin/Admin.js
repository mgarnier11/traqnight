import React, { Component } from "react";
import { Link } from 'react-router-dom';

import apiHandler from '../../../api/apiHandler';

class Admin extends Component {
    constructor(props) {
        super(props);
        /*

        this.nbUserPerPage = 5;
        this.nbArtworkTypesPerPage = 5;
        this.nbSongsPerPage = 15;

        this.state = {
            lstUsers: [],
            lstArtworkTypes: [],
            lstSongs: []
        };

        this.userPageChanged = this.userPageChanged.bind(this);
        this.artworkTypesPageChanged = this.artworkTypesPageChanged.bind(this);
        this.songsPageChanged = this.songsPageChanged.bind(this);

        this.setUsers = this.setUsers.bind(this);
        this.setArtworkTypes = this.setArtworkTypes.bind(this);
        this.setSongs = this.setSongs.bind(this);
        */
    }

    componentDidMount() {
        //this.setUsers(1);
        //this.setArtworkTypes(1);
        //this.setSongs(1);
    }
    /*
        async setUsers(page) {
            let users = await feathersClient.userService.find({
                query: {
                    $limit: this.nbUserPerPage,
                    $skip: (page - 1) * this.nbUserPerPage,
                    $sort: {
                        name: -1
                    }
                }
            })
            this.setState({ lstUsers: users.data });
        }
    
        async setArtworkTypes(page) {
            let artworkTypes = await feathersClient.artworkTypeService.find({
                query: {
                    $sort: {
                        name: -1
                    }
                }
            });
            this.setState({ lstArtworkTypes: artworkTypes });
        }
    
        async setSongs(page) {
            let songs = await feathersClient.songService.find({
                query: {
                    $limit: this.nbSongsPerPage,
                    $skip: (page - 1) * this.nbSongsPerPage,
                    $sort: {
                        name: -1
                    }
                }
            })
            this.setState({ lstSongs: songs.data });
        }
    
        userPageChanged(page) {
            this.setUsers(page);
        }
    
        artworkTypesPageChanged(page) {
            this.setArtworkTypes(page);
        }
    
        songsPageChanged(page) {
            this.setSongs(page);
        }*/

    render() {
        /*
        return (
            <div>
                <ListUsers className="col-12"
                    nbPerPage={this.nbUserPerPage}
                    lst={this.state.lstUsers}
                    pageChanged={this.userPageChanged} />
                <ListArtworkTypes className="col-12"
                    nbPerPage={this.nbArtworkTypesPerPage}
                    lst={this.state.lstArtworkTypes}
                    pageChanged={this.artworkTypesPageChanged} />
                <div className="col-12 text-center"><Link to="/admin/artworkType/new" className="btn btn-primary">Create New Artwork Type</Link></div>
                <ListSongs className="col-12"
                    nbPerPage={this.nbSongsPerPage}
                    lst={this.state.lstSongs}
                    pageChanged={this.songsPageChanged} />
                <div className="col-12 text-center"><Link to="/song/new" className="btn btn-primary">Create New Song</Link></div>
            </div>
        );
        */
        return (<div>
            WIP
       </div>)
    }
}

export default Admin;