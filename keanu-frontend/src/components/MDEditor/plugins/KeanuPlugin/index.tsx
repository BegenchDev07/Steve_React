/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$insertNodeToNearestRoot} from '@lexical/utils';
import {COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand} from 'lexical';
import {useEffect} from 'react';

import {$createKeanuNode, KeanuNode} from '../../nodes/KeanuNode';

export const INSERT_KEANU_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_KEANU_COMMAND',
);

export default function KeanuPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([KeanuNode])) {
      throw new Error('FigmaPlugin: FigmaNode not registered on editor');
    }

    return editor.registerCommand<string>(
        INSERT_KEANU_COMMAND,
      (payload) => {
        const keanuNode = $createKeanuNode(payload);
        $insertNodeToNearestRoot(keanuNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
