'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import EmployeeList from './components/EmployeeList';
import CreateDialog from './components/CreateDialog';
import client from './client';
import follow from './follow';

const root = '/api';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {employees : [], attributes:[], pageSize:2, links:{}};
		this.onCreate = this.onCreate.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.onDelete = this.onDelete.bind(this);
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
		).then(employeeCollection => {
			return client({
				method: 'GET',
				path: employeeCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return employeeCollection;
			});
		}).done(employeeCollection => {
			this.setState({
				employees: employeeCollection.entity._embedded.employees,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: employeeCollection.entity._links
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
			console.log(response);
			this.onNavigate(response.entity._links.last.href);
		});
	}
	
	onDelete(employee) {
		client({method: 'DELETE', path: employee._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}

	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(employeeCollection => {
			this.setState({
				employees: employeeCollection.entity._embedded.employees,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: employeeCollection.entity._links
			});
		});
	}

	render(){
		return (
			<div>
				<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate} />
				<EmployeeList 
					employees={this.state.employees} 
					links = {this.state.links}
					pageSize = {this.state.pageSize}
					onNavigate={this.onNavigate}
					onDelete={this.onDelete}
					// updatePageSize={this.updatePageSize}
				/>
			</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)