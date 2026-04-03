import { environment } from "../../../environments/environment";

const BASE_URL = environment.serverApiBaseUrl; // Get base URL from environment

export const API_ENDPOINTS = {
    // =========================
    // Authentication Endpoints
    // =========================
    Account: {
        LOGIN: `${BASE_URL}/Account/login`,
        REGISTER: `${BASE_URL}/Account/register`,
        REFRESH_TOKEN: `${BASE_URL}/Account/refresh-token`,
        GetUserById: (userId: string) => `${BASE_URL}/Account/${userId}`,
        GetMyInfo: `${BASE_URL}/Account/get-my-info`,
    },

    // =========================
    // Specialty Areas
    // =========================
    SpecialtyAreas: {
        GetList: `${BASE_URL}/SpecialtyAreas/Get-List`,
    },

    // =========================
    // Tenants
    // =========================
    Tenants: {
        Create: `${BASE_URL}/Tenants/Create`,
        GetCurrent: `${BASE_URL}/Tenants/current`,
        GetById: (id: string) => `${BASE_URL}/Tenants/${id}`,
    },

    // =========================
    // Invitations
    // =========================
    Invitations: {
        Create: `${BASE_URL}/Invitations/Create`,
        AcceptInvite: `${BASE_URL}/Invitations/AcceptInvite`,
        GetList: `${BASE_URL}/Invitations`,
        GetListWithTitles: `${BASE_URL}/Invitations/with-titles`,
        GetById: (id: string) => `${BASE_URL}/Invitations/${id}`,
        GetByToken: (token: string) =>
            `${BASE_URL}/Invitations/get-by-token?token=${token}`,
        Revoke: `${BASE_URL}/Invitations/revoke`,
    },

    // =========================
    // Employees
    // =========================
    Employees: {
        GetList: `${BASE_URL}/Employees`,
        GetWithTitlesList: `${BASE_URL}/Employees/with-titles`,
        GetListAll: `${BASE_URL}/Employees/list-all`,
    },


    // =========================
    // Projects
    // =========================
    Projects: {
        Create: `${BASE_URL}/Projects/Create`,
        Update: `${BASE_URL}/Projects/Update`,
        Archive: `${BASE_URL}/Projects/archive`,
        GetList: `${BASE_URL}/Projects`,
        GetById: (id: string) => `${BASE_URL}/Projects/${id}`,
        GetAdminDashboardById: (id: string) => `${BASE_URL}/Projects/${id}/admin-dashboard`,
    },

    // =========================
    // Project Tasks
    // =========================
    ProjectTasks: {
        Create: `${BASE_URL}/ProjectTasks/create`,
        Update: `${BASE_URL}/ProjectTasks/update`,
        Reassign: `${BASE_URL}/ProjectTasks/reassign`,
        GetList: `${BASE_URL}/ProjectTasks`,
        GetWithAssigneeList: `${BASE_URL}/ProjectTasks/with-assignee/list`,
        GetById: (id: string) => `${BASE_URL}/ProjectTasks/${id}`,
    },

    // =========================
    // Project Teams
    // =========================
    ProjectTeams: {
        Create: `${BASE_URL}/ProjectTeams/create`,
        SetMain: `${BASE_URL}/ProjectTeams/set-main`,
        GetList: `${BASE_URL}/ProjectTeams`,
        GetListLookup: `${BASE_URL}/ProjectTeams/lookup`,
        GetStatsList: `${BASE_URL}/ProjectTeams/stats/list`,
        GetSingle: `${BASE_URL}/ProjectTeams/Get-single`,
    },

    // =========================
    // Teams
    // =========================
    Teams: {
        Create: `${BASE_URL}/Teams/create`,
        Update: `${BASE_URL}/Teams/update`,
        Archive: `${BASE_URL}/Teams/archive`,
        CreateWithMembers: `${BASE_URL}/Teams/with-members/Create`,
        GetList: `${BASE_URL}/Teams`,
        GetById: (id: string) => `${BASE_URL}/Teams/${id}`,
    },

    // =========================
    // Team Members
    // =========================
    TeamMembers: {
        Create: `${BASE_URL}/TeamMembers/create`,
        GetList: `${BASE_URL}/TeamMembers`,
        GetWithTaskCountList: `${BASE_URL}/TeamMembers/task-count/list`,
        GetById: (id: string) => `${BASE_URL}/TeamMembers/${id}`,
    },

    // =========================
    // Departments
    // =========================
    Departments: {
        Create: `${BASE_URL}/Departments/create`,
        Update: `${BASE_URL}/Departments/update`,
        ToggleIsActive: `${BASE_URL}/Departments/isactive/toggle`,
        GetList: `${BASE_URL}/Departments`,
        GetListLookup: `${BASE_URL}/Departments/lookup`,
        GetById: (id: string) => `${BASE_URL}/Departments/${id}`,
    },

    // =========================
    // Designations
    // =========================
    Designations: {
        Create: `${BASE_URL}/Designations/create`,
        Update: `${BASE_URL}/Designations/update`,
        ToggleIsActive: `${BASE_URL}/Designations/isactive/toggle`,
        GetList: `${BASE_URL}/Designations`,
        GetListLookup: `${BASE_URL}/Designations/lookup`,
        GetListLookupWithCount: `${BASE_URL}/Designations/lookup-with-count`,
        GetById: (id: string) => `${BASE_URL}/Designations/${id}`,
    },

    // =========================
    // JobTitles
    // =========================
    JobTitles: {
        Create: `${BASE_URL}/JobTitles/create`,
        Update: `${BASE_URL}/JobTitles/update`,
        ToggleIsActive: `${BASE_URL}/JobTitles/isactive/toggle`,
        GetList: `${BASE_URL}/JobTitles`,
        GetListLookup: `${BASE_URL}/JobTitles/lookup`,
        GetById: (id: string) => `${BASE_URL}/JobTitles/${id}`,
    },
};
