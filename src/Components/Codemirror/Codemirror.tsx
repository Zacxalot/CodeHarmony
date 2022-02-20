// TODO FIX
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */
// eslint-disable-next-line react/no-unused-class-component-methods

import React from 'react';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { python } from '@codemirror/lang-python';
import './Codemirror.scss';
import { ViewPlugin, ViewUpdate } from '@codemirror/view';

class Codemirror extends React.Component {
  view: EditorView | undefined;

  componentDidMount() {
    const parent = document.getElementById('code-window');

    // Create Code Mirror state and view
    if (parent) {
      this.view = new EditorView({
        state: EditorState.create({ extensions: [basicSetup, python(), runExtension()] }),
        parent,

      });
    } else {
      console.log('Could not find parent element');
    }
  }

  // Destroys the Code Mirror state when the component is unmounted
  componentWillUnmount() {
    if (this.view) {
      this.view.destroy();
    }
  }

  // Returns the code in the editor
  getEditorState() {
    return (this.view?.state.doc.toJSON());
  }

  render() {
    return (
      <div id="code-window" className="Codemirror" />
    );
  }
}

const runExtension = () => {
  const plugin = ViewPlugin.fromClass(class {
    timerRunning = false;

    // Run when a change is made to the document.
    // Sets a timer to send the changes, calls send bundle
    // when timer finishes.
    update(update: ViewUpdate) {
      if (update.docChanged) {
        if (this.timerRunning === false) {
          this.timerRunning = true;
          setTimeout(this.sendBundle, 1000);
        }
      }
    }

    sendBundle = () => {
      console.log('Sending');
      this.timerRunning = false;
    }
  });
  return plugin;
};

export default Codemirror;
