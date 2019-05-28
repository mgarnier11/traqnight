import React, { Component } from "react";
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import apiHandler from '../../../api/apiHandler';
import styles from './Type.module.css';


class ListTypes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lst: this.props.lst,
            page: 1
        };

        this.onClickDelete = this.onClickDelete.bind(this);

        this.majLst = this.majLst.bind(this);

        apiHandler.typeService.on('patched', this.majLst);
        apiHandler.typeService.on('created', this.majLst);
        apiHandler.typeService.on('updated', this.majLst);
        apiHandler.typeService.on('removed', this.majLst);
    }

    componentWillUnmount() {
        apiHandler.typeService.removeListener('patched', this.majLst);
        apiHandler.typeService.removeListener('created', this.majLst);
        apiHandler.typeService.removeListener('updated', this.majLst);
        apiHandler.typeService.removeListener('removed', this.majLst);
    }

    majLst() {
        this.props.pageChanged(this.state.page);
    }

    componentWillReceiveProps(props) {
        if (props.lst) this.setState({ lst: props.lst });
    }

    onClickDelete(type) {
        apiHandler.typeService.remove(type._id);
    }

    render() {
        return (
            <div className={this.props.className}>
                <h1 className="col-12 text-center">Type List</h1>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Icon</th>
                            <th>Google Type</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.lst.map(type => {
                            return this.renderType(type);
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }

    renderType(type) {
        return (
            <tr key={type._id}>
                <td>{type._id}</td>
                <td>{type.name}</td>
                <td className="text-center"><i className={"fas fa-" + type.icon + " " + styles.icon} /></td>
                <td>{type.type}</td>
                <td>
                    <Link className="btn btn-warning col" to={'/admin/type/edit/' + type._id}>Update</Link>
                </td>
                <td>
                    <Button onClick={() => { this.onClickDelete(type) }} variant="danger" className="col">Delete</Button>
                </td>
            </tr>
        )
    }
}

export default ListTypes;