import * as React from 'react';
import { schedule, editor, config } from './models';

interface ScheduleRowProps {
    config: config,
    schedule: schedule,
    editor: editor,
    window: any

}

interface ScheduleRowState {
    hoverId: string
}

export default class ScheduleRow extends React.Component<ScheduleRowProps, ScheduleRowState> {
    constructor(props) {
        super(props);
        this.state = {
            hoverId: null
        }
    }
    setItemHover(id) {
        this.setState({
            hoverId: id
        });
    }
    openScheduleOnWhenHub(scheduleId: string) {
        window.open(`${this.props.config.site}studio#/apps/schedules/${scheduleId}/events`, 'Studio');
    }
    addSchedule(schedule) {
        let shortcode = `[whenhub schedule-id="${schedule.id}" `;
        if (schedule.scope === 'private') {
            shortcode += `view-code="${schedule.viewCode}"]`;
        } else {
            shortcode += ']'
        }

        this.props.editor.execCommand("mceInsertContent", false, shortcode);
        this.props.editor.windowManager.close(this.props.window);
    }
    render() {

        let availableMedia = this.props.schedule.media ? this.props.schedule.media.filter(x => x.type === 'image') : null;
        let media;
        if (availableMedia && availableMedia.length > 0) {
            media = <img src={availableMedia[0].url} style={{ width: 32, height: 32, objectFit: 'cover' }} />
        } else {
            let imgUrl = this.props.config.cdn + 'img/logo/favicon/favicon-32x32.png';
            media = <img src={imgUrl} style={{
                width: 32, height: 32, objectFit: 'cover', opacity: 0.3
            }} />
        }

        return <li key={this.props.schedule.id} style={{
            flex: 1,
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #ccc'
        }}>
            <div style={{
                width: 32,
                height: 32,
                marginRight: 6,
                backgroundColor: '#dcdcdc'
            }}><a href="#" onMouseOver={this.setItemHover.bind(this, this.props.schedule.id)} onMouseOut={this.setItemHover.bind(this)} onClick={this.addSchedule.bind(this, this.props.schedule)} style={{ flex: 1 }}>{media}</a></div>
            <a href="#" onMouseOver={this.setItemHover.bind(this, this.props.schedule.id)} onMouseOut={this.setItemHover.bind(this)} onClick={this.addSchedule.bind(this, this.props.schedule)} style={{ flex: 1 }}>{this.props.schedule.name} </a>
            {
                this.state.hoverId === this.props.schedule.id ? (<span style={{
                    textDecoration: 'none',
                    color: '#999',
                    marginRight: 6,
                    fontSize: '0.9em'
                }}>( click to insert )</span>) : null
            }
            {/* <div><button onClick={this.addSchedule.bind(this, s)} style={{ marginRight: 4 }} className="button">Insert</button></div>  */}
            <div><button onClick={this.openScheduleOnWhenHub.bind(this, this.props.schedule.id)} className="button button-primary">Open</button></div>
        </li>
    }
}