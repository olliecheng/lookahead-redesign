export enum Status {
    FirstLoad = 0,
    SubjectSelect,
    Constraints,
    Full
};

export interface State {
    status: Status;
    subjects: String[];
}

export enum ControlType {
    Disabled = "disabled", // all colour should be disabled and nothing should be clickable
    Foreground = "fg",     // focus should be on the element and animations are shown
    Background = "bg"      // the element is interactive, but not foregrounded
}

export function getControlType(state: State, fg_state: Status): ControlType {
    if (state.status < fg_state) {
        return ControlType.Disabled;
    } else if (state.status === fg_state) {
        return ControlType.Foreground;
    } else {
        return ControlType.Background;
    }
}

export function initialState(): State {
    return {
        status: Status.FirstLoad,
        subjects: ["COSM10004 Foundations of Time Travel", "ASTR20007 Darth Vader and Planet Vulcan"]
    }
}