/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
    EditorConfig,
    ElementFormatType,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    Spread,
} from 'lexical';

import {BlockWithAlignableContents} from '@lexical/react/LexicalBlockWithAlignableContents';
import {
    DecoratorBlockNode,
    SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';

type KeanuComponentProps = Readonly<{
    className: Readonly<{
        base: string;
        focus: string;
    }>;
    format: ElementFormatType | null;
    nodeKey: NodeKey;
    documentID: string;
}>;

function KeanuComponent({
                            className,
                            format,
                            nodeKey,
                            documentID,
                        }: KeanuComponentProps) {

    const searchParams = new URLSearchParams(documentID);
    const width = searchParams.get("width")??800;
    const height = searchParams.get("height")??600;

    debugger;
    return (
        <BlockWithAlignableContents
            className={className}
            format={format}
            nodeKey={nodeKey}>
            <iframe
                width={width}
                height={height}
                src={'https://d2imi96x5xekwb.cloudfront.net/public/engine/keanu.html?project=jimmy-game&palette=unnamed1'}
                allowFullScreen={true}
            />
        </BlockWithAlignableContents>
    );
}

export type SerializedKeanuNode = Spread<
    {
        documentID: string;
        type: 'gamehub';
        version: 1;
    },
    SerializedDecoratorBlockNode
>;

export class KeanuNode extends DecoratorBlockNode {
    __id: string;

    static getType(): string {
        return 'gamehub';
    }

    static clone(node: KeanuNode): KeanuNode {
        return new KeanuNode(node.__id, node.__format, node.__key);
    }

    static importJSON(serializedNode: SerializedKeanuNode): KeanuNode {
        const node = $createKeanuNode(serializedNode.documentID);
        node.setFormat(serializedNode.format);
        return node;
    }

    exportJSON(): SerializedKeanuNode {
        return {
            ...super.exportJSON(),
            documentID: this.__id,
            type: 'gamehub',
            version: 1,
        };
    }

    constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
        super(format, key);
        this.__id = id;
        debugger;
    }

    updateDOM(): false {
        return false;
    }

    getId(): string {
        return this.__id;
    }

    getTextContent(
        _includeInert?: boolean | undefined,
        _includeDirectionless?: false | undefined,
    ): string {
        return `https://www.figma.com/file/${this.__id}`;
    }

    decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
        debugger;
        const embedBlockTheme = config.theme.embedBlock || {};
        const className = {
            base: embedBlockTheme.base || '',
            focus: embedBlockTheme.focus || '',
        };
        return (
            <KeanuComponent
                className={className}
                format={this.__format}
                nodeKey={this.getKey()}
                documentID={this.__id}
            />
        );
    }

    isInline(): false {
        return false;
    }
}

export function $createKeanuNode(documentID: string): KeanuNode {
    return new KeanuNode(documentID);
}

export function $isKeanuNode(
    node: KeanuNode | LexicalNode | null | undefined,
): node is KeanuNode {
    return node instanceof KeanuNode;
}
