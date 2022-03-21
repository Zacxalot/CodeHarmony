/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable max-classes-per-file */
// TODO FIX

import React from 'react';
import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { python } from '@codemirror/lang-python';
import { ChangeSet } from '@codemirror/state';
import { ViewPlugin, ViewUpdate, EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import './Codemirror.scss';

let changes: ChangeSet[] = [];

const runExtension = () => {
  const plugin = ViewPlugin.fromClass(class {
    // eslint-disable-next-line no-useless-constructor, no-empty-function, no-unused-vars
    constructor(private view: EditorView) { }

    // Save the update to a list of updates
    // eslint-disable-next-line class-methods-use-this
    update(u: ViewUpdate) {
      if (u.docChanged) {
        changes.push(u.changes);
      }
    }
  });
  return plugin;
};

class Codemirror extends React.Component {
  view: EditorView | undefined;

  componentDidMount() {
    changes = [];
    const parent = document.getElementById('code-window');

    // Create Code Mirror state and view
    if (parent) {
      const state = EditorState.create({
        extensions: [basicSetup, python(), runExtension(), oneDark],
      });

      this.view = new EditorView({
        state,
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
  // eslint-disable-next-line react/no-unused-class-component-methods
  getEditorState() {
    if (this.view) {
      return (this.view.state.doc.toJSON());
    }
    return (['']);
  }

  getChanges(version: number) {
    return (changes.slice(version));
  }

  // Focus editor
  focusEditor() {
    this.view?.focus();
  }

  render() {
    return (
      <div
        id="code-window"
      />
    );
  }
}

export default Codemirror;
