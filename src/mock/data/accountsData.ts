export const profileData = {
    id: '1',
    name: 'Angelina Gotelli',
    firstName: 'Nasir',
    lastName: 'Rajput',
    email: 'n4sir_@hotmail.com',
    img: '/img/avatars/thumb-1.jpg',
    location: 'India, US',
    address: '123 Main St',
    postcode: '10001',
    city: 'New York',
    country: 'US',
    dialCode: '+1',
    birthday: '10/10/1992',
    phoneNumber: '+12-123-1234',
}


export const roleGroupsData = [
    {
        id: 'admin',
        name: 'Admin',
        description:
            'Full access to all functionalities and settings. Can manage users, roles, and configurations.',
        users: [],
        accessRight: {
            users: ['write', 'read', 'delete'],
            products: ['write', 'read', 'delete'],
            configurations: ['write', 'read', 'delete'],
            files: ['write', 'read', 'delete'],
            reports: ['write', 'read', 'delete'],
        },
    },
    {
        id: 'supervisor',
        name: 'Supervisor',
        description:
            'Oversees operations and users. Can view reports and has limited configuration access.',
        users: [],
        accessRight: {
            users: ['write', 'read'],
            products: ['write', 'read'],
            configurations: ['write', 'read'],
            files: ['write', 'read'],
            reports: ['read'],
        },
    },
    {
        id: 'support',
        name: 'Support',
        description:
            'Provides technical assistance. Can access user accounts and system reports for diagnostics.',
        users: [],
        accessRight: {
            users: ['read'],
            products: ['write', 'read'],
            configurations: ['read'],
            files: ['write', 'read'],
            reports: ['read'],
        },
    },
    {
        id: 'user',
        name: 'User',
        description:
            'Access to basic features necessary for tasks. Limited administrative privileges.',
        users: [],
        accessRight: {
            users: [],
            products: ['read'],
            configurations: [],
            files: ['write', 'read'],
            reports: [],
        },
    },
    {
        id: 'auditor',
        name: 'Auditor',
        description:
            'Reviews system activities. Can access reports, but cannot make changes.',
        users: [],
        accessRight: {
            users: ['read'],
            products: ['read'],
            configurations: [],
            files: ['read'],
            reports: ['read'],
        },
    },
    {
        id: 'guest',
        name: 'Guest',
        description:
            'Temporary access to limited features. Ideal for visitors or temporary users.',
        users: [],
        accessRight: {
            users: [],
            products: ['read'],
            configurations: [],
            files: [],
            reports: [],
        },
    },
]

export const pricingPlansData = {
    featuresModel: [
        {
            id: '',
            description: '',
        },
    ],
    plans: [
        {
            id: 'basic',
            name: 'Basic',
            description:
                'Ideal for individuals or small teams. Includes essential task and project management features.',
            price: {
                monthly: 59,
                annually: 500,
            },
            features: [
                'taskManagement',
                'managementTools',
                'reporting',
                'support',
            ],
            recommended: false,
        },
        {
            id: 'standard',
            name: 'Standard',
            description:
                'Perfect for growing teams. Offers advanced features for better productivity and collaboration.',
            price: {
                monthly: 79,
                annually: 700,
            },
            features: [
                'taskManagement',
                'managementTools',
                'reporting',
                'support',
                'fileSharing',
            ],
            recommended: false,
        },
        {
            id: 'pro',
            name: 'Pro',
            description:
                'Best for large teams. Includes premium features and dedicated support for optimal workflow.',
            price: {
                monthly: 129,
                annually: 1000,
            },
            features: [
                'taskManagement',
                'managementTools',
                'reporting',
                'support',
                'fileSharing',
                'advancedSecurity',
                'customIntegrations',
            ],
            recommended: true,
        },
    ],
}
