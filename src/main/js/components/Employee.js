import React, { Component } from 'react';

class Employee extends Component {

  constructor(props) {
	super(props);
  	this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
  	this.props.onDelete(this.props.employee);
  }

  render() {
		return (
			<tr>
				<td>{this.props.employee.entity.firstName}</td>
				<td>{this.props.employee.entity.lastName}</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
				<td>
					<button onClick={this.handleUpdate}>Update</button>
				</td>
			</tr>
		)
	}
}

export default Employee;
