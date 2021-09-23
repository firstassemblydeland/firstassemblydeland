import * as React from "react";

enum LiveService {
    SundayService,
    WednesdayService,
    MegaMen,
}

const REFRESH_INTERVAL = 5 * 60 * 1000;

interface LiveState {
    isLiveService?: LiveService;
}

export class Live extends React.Component<{}, LiveState> {
    constructor(props: {}) {
        super(props);
        this.state = { isLiveService: this.isLiveService() };
    }

    isLiveService() {
        const now = new Date();
        const params = new URLSearchParams(window.location.search);
        const day = params.get("day") ? parseInt(params.get("day"), 10) : now.getDay();
        const hour = `${now.getHours()}`.padStart(2, "0");
        const minute = `${now.getMinutes()}`.padStart(2, "0");
        const time = params.get("time") || `${hour}:${minute}`;
        if (day === 4 && time >= "18:00" && time <= "19:30") {
            // return LiveService.MegaMen;
        } else if (day === 0 && time >= "10:00" && time <= "11:15") {
            return LiveService.SundayService;
        } else if (day === 3 && time >= "18:30" && time <= "20:00") {
            return LiveService.WednesdayService;
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ isLiveService: this.isLiveService() });
        }, REFRESH_INTERVAL);
    }

    render() {
        const { isLiveService } = this.state;
        if (isLiveService === LiveService.MegaMen) {
            return (
                <div className="megamen live hero">
                    <a href="https://zoom.us/j/3867362948" target="_blank">
                        <h2>MEGA Men is live now!</h2>
                        Click here to connect to the Zoom call
                    </a>
                </div>
            );
        } else if (isLiveService === LiveService.SundayService) {
            return (
                <div className="sunday live hero">
                    <a href="https://www.youtube.com/c/Firstassemblydeland/live" target="_blank">
                        <h2>Sunday Service is live now!</h2>
                        Click here to watch to the live stream
                    </a>
                </div>
            );
        } else if (isLiveService === LiveService.WednesdayService) {
            return (
                <div className="wednesday live hero">
                    <a href="https://www.youtube.com/c/Firstassemblydeland/live" target="_blank">
                        <h2>Wednesday Bible Study is live now!</h2>
                        Click here to watch to the live stream
                    </a>
                </div>
            );
        }
        return null;
    }
}
