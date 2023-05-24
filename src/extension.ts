// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as sass from 'sass';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('jcore.compile-inline-sass', compilieInlineSassCommand));
}

// this method is called when your extension is deactivated
export function deactivate() { }

function getSelections() {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) {
        return [];
    }

    var selections = [];
    for (var i = 0; i < activeTextEditor.selections.length; i++) {
        var s = activeTextEditor.selections[i];
        if (!s.start.isEqual(s.end))
            selections.push(new vscode.Range(s.start, s.end));
    }

    if (selections.length === 0) {
        selections.push(new vscode.Range(activeTextEditor.document.positionAt(0), activeTextEditor.document.positionAt(activeTextEditor.document.getText().length)));
    }

    return selections;
};

async function compilieInlineSassCommand() {

    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) {
        return;
    }

    const selections = getSelections();


    activeTextEditor.edit(function (builder) {
        for (var i = 0; i < selections.length; i++) {
            var range = selections[i];
            var text = activeTextEditor.document.getText(range).toString();
            vscode.window.showInformationMessage('Minificando: ' + text);
            var bt
            try {
                bt = sass.compileString(text).css;
            }
            catch (err: unknown) {
                if (err instanceof Error) {
                    vscode.window.showErrorMessage('Error: ' + err.message);
                }
                else {
                    vscode.window.showErrorMessage('Error: desconocido');
                }
                return;
            }
            builder.replace(range, bt);
        }
    });
}
