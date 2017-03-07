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
				<td>{this.props.employee.firstName}</td>
				<td>{this.props.employee.lastName}</td>
				<td>{this.props.employee.description}</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}

export default Employee;
