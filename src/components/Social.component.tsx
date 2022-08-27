import * as React from "react";

interface SocialState {
    loaded: boolean;
}

const SocialLoaded = () => (
    <React.Fragment>
        <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div
                    className="fb-page"
                    data-href="https://www.facebook.com/firstassemblydeland"
                    data-tabs="timeline"
                    data-height="400"
                    data-width="1000"
                    data-small-header="true"
                    data-adapt-container-width="true"
                    data-hide-cover="false"
                    data-show-facepile="false"
                >
                    <blockquote
                        cite="https://www.facebook.com/firstassemblydeland"
                        className="fb-xfbml-parse-ignore"
                    >
                        <a href="https://www.facebook.com/firstassemblydeland">
                            First Assembly DeLand
                        </a>
                    </blockquote>
                </div>
            </div>
        </div>
        <div id="fb-root"></div>
    </React.Fragment>
);

const SocialNotLoaded = () => (
    <div className="social row">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div>
                <a href="https://www.facebook.com/firstassemblydeland" target="_blank"><h3><i className="icon-facebook2"></i> Facebook</h3></a>
            </div>
        </div>    
    </div>
);

export class Social extends React.Component<{}, SocialState> {
    constructor(props: {}) {
        super(props);
        this.state = { loaded: false };
    }

    loadScript(url: string) {
        return new Promise(resolve => {
            const script = document.createElement("script");
            script.src = url;
            script.onload = () => resolve();
            document.head.appendChild(script);
        });
    }

    componentDidMount() {
        if (navigator.doNotTrack !== "1") {
            Promise.all([
                this.loadScript("https://platform.twitter.com/widgets.js"),
                this.loadScript("https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0&appId=151829711542674&autoLogAppEvents=1"),
            ]).then(() => this.setState({ loaded: true }));
        }
    }

    render() {
        return (
            <React.Fragment>
                <h2>Connect with us</h2>
                {this.state.loaded ? <SocialLoaded /> : <SocialNotLoaded />}
            </React.Fragment>
        );
    }
}
