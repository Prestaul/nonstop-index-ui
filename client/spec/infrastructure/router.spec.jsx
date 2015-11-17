import routerFactory from "inject!infrastructure/router.jsx";
import ReactRouter, { RouteHandler } from "react-router";

describe( "Router", () => {
	let router, luxLocationStub, navStore, el;

	beforeEach( () => {
		el = document.createElement( "div" );
		el.className = "app-root";
		document.body.appendChild( el );

		luxLocationStub = sinon.stub().returns( ReactRouter.HistoryLocation );
		navStore = {
			namespace: "navigation"
		};

		const App = React.createClass( {
			render: () => {
				return ( <div className="component-app">App<RouteHandler /></div> );
			}
		} );

		router = routerFactory( {
			App: App,
			Dashboard: getMockReactComponent( "Dashboard" ),
			ProjectDetail: getMockReactComponent( "ProjectDetail" ),
			"infrastructure/luxLocationFactory": luxLocationStub,
			"stores/navigationStore": navStore
		} );
	} );

	afterEach( () => {
		ReactDOM.unmountComponentAtNode( el );
		document.body.removeChild( el );
	} );

	it( "should pass the navigation store to the luxLocationFactory", () => {
		luxLocationStub.should.be.calledOnce.and.calledWith( navStore );
	} );

	it( "should render the App", () => {
		router.transitionTo( "/" );

		const app = document.querySelector( ".component-app" );
		should.exist( app );
	} );

	it( "should render the Dashboard component for the root path", () => {
		router.transitionTo( "/" );

		const dashboard = document.querySelector( ".component-dashboard" );
		should.exist( dashboard );
	} );

	it( "should render the ProjectDetail component for project paths", () => {
		router.transitionTo( "/project/project-name/owner/branch" );

		const projectDetail = document.querySelector( ".component-projectdetail" );
		should.exist( projectDetail );
	} );
} );
