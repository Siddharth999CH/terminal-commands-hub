#!/usr/bin/env node
export interface CommandMetadata {
    name: string;
    description: string;
    arguments?: string;
    executable: string;
    isCliCommand?: boolean;
}
export declare const commandsList: CommandMetadata[];
