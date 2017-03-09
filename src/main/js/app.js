'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import EmployeeList from './components/EmployeeList';
import CreateDialog from './components/CreateDialog';
import client from './client';
import follow from './follow';
import when from 'when';

const root = '/api';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {employees : [], attributes:[], pageSize:2, links:{}};
		this.onCreate = this.onCreate.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.updatePageSize = this.updatePageSize.bind(this);
	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}

	loadFromServer(pageSize) {

		follow(client, root, [
			{
				rel: 'employees', 
				params: {size: pageSize}
			}]
		).then(rs => {
			return client({
				method: 'GET',
				path: rs.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				this.links = rs.entity._links
				return rs;
			});
		}).then(rs => {
			return rs.entity._embedded.employees.map(employee =>
				client({
					method : 'GET',
					path : employee._links.self.href
				})
			);
		})
		.then(employeePromises => {
			return when.all(employeePromises);
		}).done(employees => {
			console.log('load server');
			console.log(employees);
			this.setState({
				employees: employees,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: this.links
			});
		});
	}

	onCreate(newEmployee) {
		follow(client, root, ['employees']).then(employeeCollection => {
			return client({
				method: 'POST',
				path: employeeCollection.entity._links.self.href,
				entity: newEmployee,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'employees', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			this.onNavigate(response.entity._links.last.href);
		});
	}
	
	onDelete(employee) {
		client({method: 'DELETE', path: employee.entity._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}

	onUpdate(employee, updateEmployee) {
		client({
			method: 'GET',
			path : employee.entity._links.self.href,
			entity: updateEmployee,
			header : {
				'Content-Type' : 'application/json',
				'If-Match' : employee.headers.Etag
			}
		}).done(res => {
			this.loadFromServer(this.state.pageSize);
		}, res => {
			if (res.status.code === 412) {
				alert('denied: unable to update' + 
					employee.entity._links.self.href + '. Your copy is stale')
			}
		})
	}

	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(employeeCollection => {
			this.links = employeeCollection.entity._links;

			return employeeCollection.entity._embedded.employees.map(employee =>
				client({
					method : 'GET',
					path: employee._links.self.href
				})
			);
		}).then(employeePromises => {
			return when.all(employeePromises);
		}).done(employees => {
			console.log('onNvigate')
			console.log(employees);
			this.setState({
				employees: employees,
				attributes : Object.keys(this.schema.properties),
				pageSize : this.state.pageSize,
				links : this.links
			});
		});
	}

	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		} 
	}

	render() {
		return (
			<div>
				<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate} />
				<EmployeeList 
					employees={this.state.employees} 
					links = {this.state.links}
					pageSize = {this.state.pageSize}
					onNavigate={this.onNavigate}
					onDelete={this.onDelete}
					updatePageSize={this.updatePageSize}
				/>
			</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)