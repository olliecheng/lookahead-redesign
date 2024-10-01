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

export function initialState(): State {
    return {
        status: Status.FirstLoad,
        subjects: ["COSM10004 Foundations of Time Travel", "ASTR20007 Darth Vader and Planet Vulcan"]
    }
}