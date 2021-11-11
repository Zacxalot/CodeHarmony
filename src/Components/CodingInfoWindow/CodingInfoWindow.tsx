// import axios from "axios";
import React from "react";
import "./CodingInfoWindow.scss";

// interface CodeInfoElement{
//     type:String,
//     props:any,
//     children:String
// }


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



        // Example of adding a JSX element
        let a =  React.createElement("h1",[],["test",React.createElement("h2",[],"madness")]);

        this.renderlist.push(a);
    }
}

export default CodingInfoWindow;
