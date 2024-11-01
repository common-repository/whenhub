export interface schedule {
    id: string,
    name: string,
    media: Array<{ type: string, url: string }>,
    description: string
}

export interface editor {
    execCommand(command: string, ui: boolean, value: string): void,
    windowManager: {
        close(window: any): void
    }
}

export interface config {
    site: string,
    api: string,
    cdn: string
}