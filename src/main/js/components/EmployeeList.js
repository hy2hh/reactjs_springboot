import React, { Component } from 'react';
const ReactDOM = require('react-dom');
import Employee from './Employee';

export default class EmployeeList extends Component {

	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}

	handleInput(e) {
		e.preventDefault();
		var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
		}

		this.props.updatePageSize();
	}
 	
 	render() {
 		console.log(this.props.employees)
  		var employees = this.props.employees.map(employee => 
			<Employee key={employee.entity._links.self.href} employee={employee} onDelete={this.props.onDelete}/>
		);
		
  		var navLinks = [];
  		if ("first" in this.props.links) {
  			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
  		}
  		if ("prev" in this.props.links) {
  			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
  		}
  		if ("next" in this.props.links) {
  			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
  		}
  		if ("last" in this.props.links) {
  			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
  		}

		return (
			<div>
				<input ref="pageSize" defaultValue={this.props.pageSize} onChange={this.handleInput}></input>
				<table>
					<tbody>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
						</tr>
						{employees}
					</tbody>
				</table>		
				<div>
					{navLinks}
				</div>
			</div>
		)
	}
}