
const roles = {
    admin:'admin',
    client:'client',
    freelancer:'freelancer',
}

const endPoints = {
    admin: [roles.admin],
    freelancer: [roles.freelancer],
    client: [roles.client],
    allUsers: [roles.admin, roles.client, roles.freelancer],
    allUsersExceptAdmin: [roles.client, roles.freelancer],
    adminAndFreelancer: [roles.admin, roles.freelancer],
    adminAndClient: [roles.admin, roles.client]
}

export default endPoints