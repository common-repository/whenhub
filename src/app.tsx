import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ScheduleRow from './schedule-row';
import axios from 'axios';
import { schedule, editor, config } from './models';

interface AppProps {
    height: number,
    config: {
        site: string,
        api: string,
        cdn: string
    },
    editor: editor,
    window: any
}

interface AppState {
    schedules: Array<schedule>
    accessToken: string,
    networkError?: boolean
}

export default class App extends React.Component<AppProps, AppState> {
    private CONSTANTS = {
        accessToken: 'whenhub-accessToken'
    }
    constructor(props) {
        super();

        this.state = {
            schedules: [],
            accessToken: null
        }
    }
    componentDidMount() {
        const accessToken = localStorage.getItem(this.CONSTANTS.accessToken);
        if (accessToken) {
            this.setState({
                accessToken
            });
            this.fetchSchedules(accessToken);
        }
    }
    fetchSchedules(accessToken: string) {
        return axios.get(`${this.props.config.api}users/me/schedules?filter[include]=media&access_token=${accessToken}`).then(response => {
            this.setState({
                schedules: response.data
            });
        }).catch(err => {
            if (err.response && err.response.status === 401) {
                this.logout();
            }
            if (err.message === 'Network Error') {
                this.setState({ networkError: true });
            }

        });
    }
    logout() {
        localStorage.removeItem(this.CONSTANTS.accessToken);
        this.setState({ accessToken: null });
    }
    login() {
        let action = (event) => {
            let payload;
            try {
                if (typeof event.data === 'string') {
                    payload = JSON.parse(event.data);
                } else {
                    payload = event.data;
                }
            } catch (error) {
                window.removeEventListener('message', action, false);
                return console.error('Unable to parse event', event);
            }

            if (payload && payload.action === 'LOGIN_COMPLETED') {
                localStorage.setItem(this.CONSTANTS.accessToken, payload.data.accessToken);
                this.setState({ accessToken: payload.data.accessToken })
                this.fetchSchedules(payload.data.accessToken);
            }
            window.removeEventListener('message', action, false);
        };
        window.addEventListener('message', action);
        window.open(window['whenhub'].site + 'signin#login', 'AuthWindow', 'width=450, height=600');
    }
    retryFetchSchedules() {
        this.setState({ networkError: false });
        this.fetchSchedules(this.state.accessToken);
    }
    render() {
        if (this.state.accessToken) {
            let children = this.state.schedules.map(s => {
                return <ScheduleRow key={s.id} config={this.props.config} schedule={s} editor={this.props.editor} window={this.props.window} />
            });

            const logout = <div style={{ backgroundColor: '#dcdcdc', marginTop: 20, display: 'flex', justifyContent: 'flex-end', padding: 4, borderRadius: 4 }}>
                <button onClick={this.logout.bind(this)} className="button button-primary">Logout</button>
            </div>;

            if (children.length === 0) {
                return <div>
                    {!this.state.networkError ? <div>Loading...<i className="fa fa-spinner fa-pulse fa-fw"></i></div> : <div style={{
                        color: 'red'
                    }}>Failed to communicate with WhenHub. <a href="#" onClick={this.retryFetchSchedules.bind(this)}> Please try again</a></div>}
                    {logout}
                </div>
            }
            children.unshift(<li key="header" style={{
                flex: 1,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #ccc'
            }}><div>Click schedule to insert shortcode or open in WhenHub studio</div></li>)
            return (<div style={{ height: this.props.height * 0.9, overflowY: 'scroll' }}>
                <ul style={{ display: 'flex', flexDirection: 'column' }}>
                    {children}
                </ul>
                {logout}
            </div>)
        }

        return <button onClick={this.login.bind(this)} className="button button-primary">Login</button>

    }
}