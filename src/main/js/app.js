'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
	render(){
		return (
			<div>
				what the hello
			</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)