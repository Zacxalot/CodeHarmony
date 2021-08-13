import React, { useEffect } from 'react';
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup";
import {python} from "@codemirror/lang-python";
import './Codemirror.css';

function Codemirror() {
    useEffect(() => {
        let parent = document.getElementById("code_window");
        let view:EditorView;
        if (parent) {
            let view = new EditorView({
                state: EditorState.create({extensions:[basicSetup, python()]}),
                parent: parent
            });
        }
        else{
            console.log("Could not find parent element")
        }


        return () => {
            view.destroy();
        } 
        
    });


    return (
        <div id="code_window" className="Codemirror">
            
        </div>
    );
}

export default Codemirror;
