export interface Controls {
    initial: ControlType,
    subjectSelect: ControlType,
    constraints: ControlType,
    full: ControlType
};

export interface State {
    controls: Controls;
    subjects: String[];
}

export enum ControlType {
    Disabled = "disabled", // all colour should be disabled and nothing should be clickable
    Foreground = "fg",     // focus should be on the element and animations are shown
    Background = "bg"      // the element is interactive, but not foregrounded
}

export function initialState(): State {
    return {
        controls: {
            initial: ControlType.Foreground,
            subjectSelect: ControlType.Disabled,
            constraints: ControlType.Disabled,
            full: ControlType.Disabled
        },
        subjects: ["COSM10004 Foundations of Time Travel", "ASTR20007 Darth Vader and Planet Vulcan"]
    }
}