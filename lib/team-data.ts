export interface TeamMember {
    username: string;
    role: string;
    skills: {
        frontend: number;
        backend: number;
        database: number;
        security: number;
        devops: number;
    };
}

export const SQUAD_DATA: TeamMember[] = [
    {
        username: "neko01t",
        role: "Frontend Architect",
        skills: {
            frontend: 60,
            backend: 40,
            database: 50,
            security: 75,
            devops: 0,
        }
    },
    {
        username: "piyushsontakke0",
        role: "Fullstack Lead",
        skills: {
            frontend: 70,
            backend: 60,
            database: 50,
            security: 40,
            devops: 0,
        }
    }
];