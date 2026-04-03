export interface AsideItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: AsideItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const AdminAsideItems: AsideItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/dashboard',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },

 

  // TEAMS SECTION
  {
    id: 'teams',
    title: 'Teams',
    type: 'group',
    icon: 'ti ti-users-group',
    children: [
      {
        id: 'team-list',
        title: 'All Teams',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/teams',
        icon: 'ti ti-users-group',
        breadcrumbs: false
      }
    ]
  },

  // PROJECTS SECTION
  {
    id: 'projects',
    title: 'Projects',
    type: 'group',
    icon: 'ti ti-folders',
    children: [
      {
        id: 'project-list',
        title: 'All Projects',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/projects',
        icon: 'ti ti-layout-kanban',
        breadcrumbs: false
      }
    ]
  },


 // ORGANIZATION STRUCTURE SECTION
  {
    id: 'organization',
    title: 'Organization',
     type: 'group',
    icon: 'ti ti-building',
    children: [
      {
        id: 'departments',
        title: 'Departments',
        type: 'item',
        icon: 'ti ti-building-community',
        classes: 'nav-item',
        url: '/admin/departments',
        breadcrumbs: true

      },
      {
        id: 'job-titles',
        title: 'Job Titles',
        type: 'item',
        icon: 'ti ti-briefcase',
        classes: 'nav-item',
        url: '/admin/job-titles',
        breadcrumbs: false

      },
      {
        id: 'designations',
        title: 'Designations',
        type: 'item',
        icon: 'ti ti-hierarchy',
        classes: 'nav-item',
        url: '/admin/designations',
        breadcrumbs: false
      },
         {
        id: 'employee-directory',
        title: 'Employee Directory',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/employees',
        icon: 'ti ti-id',
        breadcrumbs: false
      },
      {
        id: 'organization-hierarchy',
        title: 'Hierarchy View',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/employee-hierarchy',
        icon: 'ti ti-sitemap',
        breadcrumbs: false
      }
    ]
  },
  // ADMIN TOOLS SECTION
  {
    id: 'admin-tools',
    title: 'Admin Tools',
    type: 'group',
    icon: 'ti ti-tool',
    children: [
      {
        id: 'invite-management',
        title: 'Invitations',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/invites',
        icon: 'ti ti-mail',
        breadcrumbs: false
      },
      {
        id: 'settings',
        title: 'System Settings',
        type: 'collapse',
        icon: 'ti ti-settings',
        children: [
          {
            id: 'hierarchy-settings',
            title: 'Hierarchy Settings',
            type: 'item',
            classes: 'nav-item',
            url: '/admin/settings/hierarchy',
            icon: 'ti ti-hierarchy-2',
            breadcrumbs: false
          }
        ]
      }
    ]
  }
];

// export const AdminAsideItems: AsideItem[] = [
//   {
//     id: 'dashboard',
//     title: 'Dashboard',
//     type: 'group',
//     icon: 'icon-navigation',
//     children: [
//       {
//         id: 'default',
//         title: 'Dashboard',
//         type: 'item',
//         classes: 'nav-item',
//         url: '/admin/dashboard',
//         icon: 'ti ti-dashboard',
//         breadcrumbs: false
//       }
//     ]
//   },

//   // PROJECTS SECTION
//   {
//     id: 'projects',
//     title: 'Projects',
//     type: 'group',
//     icon: 'icon-navigation',
//     children: [
//       {
//         id: 'project-list',
//         title: 'All Projects',
//         type: 'item',
//         classes: 'nav-item',
//         url: '/admin/projects',
//         icon: 'ti ti-folder',
//         breadcrumbs: false
//       }
//     ]
//   },
//   // PROJECTS SECTION
//   {
//     id: 'Teams',
//     title: 'Teams',
//     type: 'group',
//     icon: 'icon-navigation',
//     children: [
//       {
//         id: 'team-list',
//         title: 'All Teams',
//         type: 'item',
//         classes: 'nav-item',
//         url: '/admin/teams',
//         icon: 'ti ti-folder',
//         breadcrumbs: false
//       }
//     ]
//   },
//   // ADMIN-SPECIFIC: Adding an Admin Tools group
//   {
//     id: 'admin-tools',
//     title: 'Admin Tools',
//     type: 'group',
//     icon: 'icon-navigation',
//     children: [
//       {
//         id: 'user-management',
//         title: 'User Management',
//         type: 'item',
//         classes: 'nav-item',
//         url: '/admin/users',
//         icon: 'ti ti-users',
//         breadcrumbs: false
//       },
//       {
//         id: 'invite-management',
//         title: 'Invitation Management',
//         type: 'item',
//         classes: 'nav-item',
//         url: '/admin/invites',
//         icon: 'ti ti-users',
//         breadcrumbs: false
//       }
//     ]
//   },

// ];



export const EmployeeAsideItems: AsideItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      // Common item
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'work',
    title: 'My Work',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      // EMPLOYEE-SPECIFIC: Personal tasks
      {
        id: 'my-tasks',
        title: 'My Tasks',
        type: 'item',
        classes: 'nav-item',
        url: '/tasks/my',
        icon: 'ti ti-user-check'
      },
      {
        id: 'time-tracker',
        title: 'Time Tracker',
        type: 'item',
        classes: 'nav-item',
        url: '/time',
        icon: 'ti ti-clock'
      }
    ]
  },
  {
    id: 'settings',
    title: 'Account',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'profile',
        title: 'Profile',
        type: 'item',
        classes: 'nav-item',
        url: '/profile',
        icon: 'ti ti-user-circle'
      }
    ]
  }
];

// export const AsideItems: AsideItem[] = [
//   {
//     id: 'dashboard',
//     title: 'Dashboard',
//     type: 'group',
//     icon: 'icon-navigation',
//     children: [
//       {
//         id: 'default',
//         title: 'Dashboard',
//         type: 'item',
//         classes: 'nav-item',
//         url: '/',
//         icon: 'ti ti-dashboard',
//         breadcrumbs: false
//       }
//     ]
//   },
//   {
//     id: 'page',
//     title: 'Pages',
//     type: 'group',
//     icon: 'icon-navigation',
//     children: [
//       {
//         id: 'Authentication',
//         title: 'Authentication',
//         type: 'collapse',
//         icon: 'ti ti-key',
//         children: [
//           {
//             id: 'login',
//             title: 'Login',
//             type: 'item',
//             url: '/login',
//             target: true,
//             breadcrumbs: false
//           },
//           {
//             id: 'register',
//             title: 'Register',
//             type: 'item',
//             url: '/register',
//             target: true,
//             breadcrumbs: false
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: 'elements',
//     title: 'Elements',
//     type: 'group',
//     icon: 'icon-navigation',
//     children: [
//       {
//         id: 'typography',
//         title: 'Typography',
//         type: 'item',
//         classes: 'nav-item',
//         url: '/typography',
//         icon: 'ti ti-typography'
//       },
//       {
//         id: 'color',
//         title: 'Colors',
//         type: 'item',
//         classes: 'nav-item',
//         url: '/color',
//         icon: 'ti ti-brush'
//       },
//       {
//         id: 'tabler',
//         title: 'Tabler',
//         type: 'item',
//         classes: 'nav-item',
//         url: 'https://tabler-icons.io/',
//         icon: 'ti ti-plant-2',
//         target: true,
//         external: true
//       }
//     ]
//   },
//   {
//     id: 'other',
//     title: 'Other',
//     type: 'group',
//     icon: 'icon-navigation',
//     children: [
//       {
//         id: 'sample-page',
//         title: 'Sample Page',
//         type: 'item',
//         url: '/sample-page',
//         classes: 'nav-item',
//         icon: 'ti ti-brand-chrome'
//       },
//       {
//         id: 'document',
//         title: 'Document',
//         type: 'item',
//         classes: 'nav-item',
//         url: 'https://codedthemes.gitbook.io/berry-angular/',
//         icon: 'ti ti-vocabulary',
//         target: true,
//         external: true
//       }
//     ]
//   }
// ];
