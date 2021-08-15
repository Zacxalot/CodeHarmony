import React from 'react';
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup";
import {python} from "@codemirror/lang-python";
import './Codemirror.scss';

class Codemirror extends React.Component {
    view: EditorView | undefined;
    

    render(){
        return(<div id="code_window" className="Codemirror">
            
        </div>)
    }

    componentDidMount() {
        let parent = document.getElementById("code_window");
        
        if (parent) {
            this.view = new EditorView({
                state: EditorState.create({extensions:[basicSetup, python()]}),
                parent: parent
            });
        }
        else{
            console.log("Could not find parent element")
        }
    }

    componentWillUnmount() {
        if (this.view){
            this.view.destroy();
        }
    }

    getEditorState () {
        return(this.view?.state.doc);
    }
}

export default Codemirror;
