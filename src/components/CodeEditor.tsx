'use client'

import { useRef } from 'react'
import Editor from '@monaco-editor/react'
import type * as MonacoType from 'monaco-editor'
import { EXAMPLE_VULNERABLE_CONTRACT } from '@/lib/constants'

interface CodeEditorProps {
	value: string
	onChange: (value: string) => void
	disabled?: boolean
}

export default function CodeEditor({
	value,
	onChange,
	disabled = false,
}: CodeEditorProps) {
	const editorRef = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(null)

	function handleEditorDidMount(
		editor: MonacoType.editor.IStandaloneCodeEditor,
	) {
		editorRef.current = editor
	}

	function handleLoadExample() {
		onChange(EXAMPLE_VULNERABLE_CONTRACT)
	}

	return (
		<div className='flex flex-col gap-2'>
			{/*  Header and buttons */}
			<div className='flex items-center justify-between'>
				<label className='text-sm font-medium text-gray-300'>
					Solidity Contract Code
				</label>
				<button
					onClick={handleLoadExample}
					disabled={disabled}
					className='text-xs text-emerald-400 hover:text-emerald-300 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200'
				>
					Load Example Contract
				</button>
			</div>

			{/* Monaco Editor */}
			<div
				className='rounded-xl overflow-hidden border border-gray-700 
                      shadow-2xl shadow-black/50'
			>
				<Editor
					height='420px'
					language='sol'
					theme='vs-dark'
					value={value}
					onChange={val => onChange(val || '')}
					onMount={handleEditorDidMount}
					options={{
						fontSize: 14,
						fontFamily:
							"'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
						fontLigatures: true,
						minimap: { enabled: false },
						scrollBeyondLastLine: false,
						lineNumbers: 'on',
						roundedSelection: true,
						automaticLayout: true,
						tabSize: 4,
						wordWrap: 'on',
						readOnly: disabled,
						padding: { top: 16, bottom: 16 },
						scrollbar: {
							verticalScrollbarSize: 6,
							horizontalScrollbarSize: 6,
						},
					}}
				/>
			</div>

			{/* Character count */}
			<div className='flex justify-end'>
				<span className='text-xs text-gray-500'>
					{value.length.toLocaleString()} / 50,000 characters
				</span>
			</div>
		</div>
	)
}
