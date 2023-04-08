import React, { useState, useEffect, useRef, MutableRefObject } from 'react';

import { VimWasm, ScreenDrawer } from 'public/vim-wasm';
import type { VimWasmConstructOptions } from 'public/vim-wasm';

interface VimProps {
    worker: string;
    drawer?: ScreenDrawer;
    debug?: boolean;
    perf?: boolean;
    clipboard?: boolean;
    onVimExit?: (status: number) => void;
    onVimInit?: () => void;
    onFileExport?: (fullpath: string, contents: ArrayBuffer) => void;
    readClipboard?: () => Promise<string>;
    onWriteClipboard?: (text: string) => Promise<void>;
    onError?: (err: Error) => void;
    onTitleUpdate?: (title: string) => void;
    files?: {
        [path: string]: string;
    };
    fetchFiles?: {
        [path: string]: string;
    };
    dirs?: string[];
    persistentDirs?: string[];
    cmdArgs?: string[];
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    onVimCreated?: (vim: VimWasm) => void;
}

function useVim({
	worker,
	drawer,
	debug,
	perf,
	clipboard,
	onVimExit,
	onVimInit,
	onFileExport,
	readClipboard,
	onWriteClipboard,
	onError,
	onTitleUpdate,
	files,
	fetchFiles,
	dirs,
	persistentDirs,
	cmdArgs,
	className,
	style,
	id,
	onVimCreated
}: VimProps): [
	React.RefObject<HTMLCanvasElement> | null,
	React.RefObject<HTMLInputElement> | null,
	VimWasm | null,
] {
	const canvas = useRef<HTMLCanvasElement>(null);
	const input = useRef<HTMLInputElement>(null);
	const [vim, setVim] = useState<VimWasm | null>(null);
	
	useEffect(() => {
		let opts: VimWasmConstructOptions;
		if (drawer === undefined) {
			if (canvas.current === null || input.current === null) {
				return;
			}
			opts = {
				workerScriptPath: worker,
				canvas: canvas.current,
				input: input.current,
			}
		} else {
			opts = {
				workerScriptPath: worker,
				screen: drawer,
			}
		}
		const v = new VimWasm(opts);
		v.onVimInit = onVimInit;
		v.onVimExit = onVimExit;
		v.onFileExport = onFileExport;
		v.readClipboard = readClipboard;
		v.onWriteClipboard = onWriteClipboard;
		v.onTitleUpdate = onTitleUpdate;
		v.onError = onError;
		if (canvas.current !== null) {
		    canvas.current.addEventListener('dragover', (e) => {
			e.stopPropagation();
			e.preventDefault();
			if (e.dataTransfer) {
			    e.dataTransfer.dropEffect = 'copy';
			}
		    }, false);
		    canvas.current.addEventListener('drop', (e) => {
			e.stopPropagation();
			e.preventDefault();
			if (e.dataTransfer) {
			    v.dropFiles(e.dataTransfer.files).catch(onError);
			}
		    }, false);
		}
		if (onVimCreated !== undefined) {
		    onVimCreated(v);
		}
		v.start({ debug, perf, clipboard, files, fetchFiles, dirs, persistentDirs, cmdArgs });
		setVim(v);
		return () => {
		    if (v.isRunning()) {
			v.cmdline('qall!');
		    }
		};
	}, [worker, debug, perf, clipboard, files, dirs, persistentDirs, cmdArgs]);
    
    if (drawer !== undefined) {
        return [null, null, vim];
    }
    return [canvas, input, vim];
}

const INPUT_STYLE = {
    width: '1px',
    color: 'transparent',
    backgroundColor: 'transparent',
    padding: '0px',
    border: '0px',
    outline: 'none',
    position: 'relative',
    top: '0px',
    left: '0px',
};

export const Vim = (props: VimProps) => {
    const [canvasRef, inputRef, vim] = useVim(props);
    if (canvasRef === null || inputRef === null) {
        // When drawer prop is set, it has responsibility to render screen.
        // This component does not render screen and handle inputs.
        return null;
    }
    const { style, className, id, onVimExit, onVimInit, onFileExport, onWriteClipboard, onError, readClipboard, } = props;
    if (vim !== null) {
        vim.onVimExit = onVimExit;
        vim.onVimInit = onVimInit;
        vim.onFileExport = onFileExport;
        vim.onWriteClipboard = onWriteClipboard;
        vim.onError = onError;
        vim.readClipboard = readClipboard;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("canvas", { ref: canvasRef, style: style, className: className, id: id }),
        React.createElement("input", { ref: inputRef, style: INPUT_STYLE, autoComplete: "off", autoFocus: true })));
};
	
