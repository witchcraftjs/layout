const e=o=>{navigator.clipboard?navigator.clipboard.writeText(o).catch(r=>{console.warn(`There was an error copying to the clipboard, please file a bug report.
${r}`)}):console.warn("Could not copy to clipboard, your browser is not supported.")};export{e as c};
