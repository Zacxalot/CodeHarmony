import axios from "axios";
import React from "react";
import "./CodingInfoWindow.scss";

interface CodeInfoElement{
    type:String,
    props:any,
    children:String
}


class CodingInfoWindow extends React.Component {
    renderlist:Array<JSX.Element>;

    render(){
        return (
            <div className="info-window-container">
                <div className="info-window">
                    {this.renderlist}
                </div>
            </div>
        );
    };

    constructor(props:any){
        super(props);

        this.renderlist = [];

        let a =  React.createElement("h1",[],["test",React.createElement("h2",[],"madness")]);

        this.renderlist.push(a);

        console.log("Pushed element to render list")

        // for(let i = 0; i <= 30; i++){
        //     this.renderlist.push(<h1>Hello</h1>)
        //     this.renderlist.push(<h2>Sad</h2>)
        //     this.renderlist.push(<script>console.log("test")</script>)
        // }
    }
}

export default CodingInfoWindow;
